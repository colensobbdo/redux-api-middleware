import isPlainObject from 'lodash.isPlainObject'
import axios from 'axios'

import CALL_API from './CALL_API'
import * as Validation from './validation'
import * as Errors from './errors'
import * as Utils from './util'

function apiMiddleware({ getState }) {
    return (next) => async (action) => {

        if (!Validation.isRSAA(action)) {
            return next(action)
        }

        var callAPI = action[CALL_API]
        const validationErrors = Validation.validateRSAA(action)
        if (validationErrors.length > 0) {

            if (callAPI.types && AriaRequestEvent.isRSAA(callAPI.types)) {
                var request = callAPI.types[0]
                if (request && request.type) {
                    request = type
                }

                next({
                    type: request,
                    payload: new Errors.InvalidActionError(validationErrors),
                    error: true
                })
            }

            return
        }

        var { endpoint, headers, timeout } = callAPI
        var { method, body, credentials, bailout, types } = callAPI
        var [request, success, failure] = Utils.getTypes(types)

        try {
            if (typeof bailout === 'boolean' && bailout) {
                return
            }
            else if (typeof bailout === 'function' && await bailout(getState()) === true) {
                return
            }
        }
        catch (e) {
            if (typeof bailout === 'function' && bailout(getState())) {
                return
            }

            return next(await Utils.actionWith(
                request,
                [action, getState(), new Errors.RequestError('bailout failed for CALL_API')]
            ))
        }

        if (typeof endpoint === 'function') {
            try {
                endpoint = endpoint(getState())
            }
            catch (e) {
                return next(await Utils.actionWith(
                    failure,
                    [action, getState(), new Errors.RequestError('endpoint function failed for CALL_API')]
                ))
            }
        }

        if (typeof headers === 'function') {
            try {
                headers = headers(getState());
            } catch (e) {
                return next(await Utils.actionWith(
                    failure,
                    [action, getState(), new RequestError('headers function failed CALL_API')]
                ))
            }
        }


        next(await Utils.actionWith(
            request,
            [action, getState()]
        ))

        var t

        try {
            var res
            var config = {
                url: endpoint,
                method,
                data: body,
                withCredentials: credentials,
                headers: headers || {},
                timeout: timeout || 0
            }

            if (timeout) {
                t = setTimeout(async () => {
                    failure.meta = action
                    return next(await Utils.actionWith(
                        failure,
                        [action, getState(), new Errors.TimeoutError(`CALL_API exceeded timeout of ${timeout/1000} seconds`)]
                    ))
                }, timeout)
            }

            res = await axios(config)
        }
        catch (e) {
            return next(await actionWith(
                {
                    type: failure.type || failure,
                    meta: action,
                    payload: failure.payload || e
                },
                [action, getState(), e]
            ))
        }

        if (t) {
            clearTimeout(t)
        }

        if (res.status === 200) {
            return next(await Utils.actionWith(
                success,
                [action, getState(), res]
            ))
        }
        else {
            return next(await Utils.actionWith(
                { type: failure.type || failure, meta: action },
                [action, getState(), res]
            ))
        }
    }
}

exports.version = '1.0.0'
export default apiMiddleware
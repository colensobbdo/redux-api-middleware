import {describe, before, it} from 'mocha'
import {expect} from 'code'
import {CALL_API, fetchComponentData} from  '../src'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {RequestError, ApiError, TimeoutError} from '../src/errors'

describe('Errors', () => {

    it('RequestError should set name and message', (done) => {

        var err = new RequestError('Test')
        expect(err.name).to.be.equal('RequestError')
        expect(err.message).to.be.equal('Test')
        done()
    })

    it('ApiError should set name, message, status and response', (done) => {

        var err = new ApiError(200, 'OK', 'Valid')
        expect(err.name).to.equal('ApiError')
        expect(err.status).to.equal(200)
        expect(err.statusText).to.equal('OK')
        expect(err.response).to.equal('Valid')
        expect(err.message).to.equal('200 - OK')
        done()
    })

    it('TimeoutError should set name and message', (done) => {
        var err = new TimeoutError('timeout of 10ms exceeded')
        expect(err.name).to.equal('TimeoutError')
        expect(err.message).to.equal('timeout of 10ms exceeded')
        done()
    })
})

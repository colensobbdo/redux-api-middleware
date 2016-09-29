import {describe, before, it} from 'mocha'
import {expect} from 'code'
import {CALL_API, fetchComponentData} from  '../src'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {getTypes, actionWith} from '../src/util'

describe('Utils', () => {

    it('should return the request types', (done) => {

        var types = getTypes([
            'REQUEST',
            'SUCCESS',
            'FAILURE'
        ])

        expect(types).to.be.array()
        done()
    })

    it('should inject a payload function into failure type', (done) => {

        var types = getTypes([
            'REQUEST',
            'SUCCESS',
            'FAILURE'
        ])

        expect(types).to.be.array()

        // failure is always the last type
        var failure = types[types.length - 1]
        expect(failure.payload).to.be.function()
        var result = failure.payload('FAILURE', {}, "")
        expect(result.then).to.be.function()
        done()
    })

    it('should handle an error correctly', (done) => {

        var result = actionWith({ meta: () => { throw new Error() }, error: false })
        expect(result).to.exist()

        done()
    })
})

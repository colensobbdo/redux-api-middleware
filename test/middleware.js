import {describe, before, it} from 'mocha'
import {expect} from 'code'
import {CALL_API} from  '../src'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import apiMiddleware from '../src/middleware'

describe('API Middleware', () => {

    var next

    var setupStore = function(reducer) {
        return createStore(
            combineReducers([reducer]),
            applyMiddleware(apiMiddleware)
        )
    }

    it('should return a promise', (done) => {

        var middlewareTestReducer = function(state = {}, action) {
            return state
        }

        var store = setupStore(middlewareTestReducer)
        var middleware = apiMiddleware(store)
        var result = middleware()
        expect(result().then).to.be.function()

        done()
    })

    it('should handle types as objects', (done) => {
        var action = {
            [CALL_API]: {
                endpoint: function() {
                    return 'http://www.google.co.nz'
                },
                method: 'GET',
                types: [{
                    type: 'REQUEST'
                }]
            }
        }

        var middlewareTestReducer = function(state = {}, action) {
            switch (action.type) {
                case 'REQUEST':
                    return state

                default:
                    return state
            }
        }

        // setup the store
        var store = setupStore(middlewareTestReducer)
        var result = store.dispatch(action)

        done()
    })

    it('should process endpoint as a function', (done) => {

        var action = {
            [CALL_API]: {
                endpoint: function() {
                    return 'http://www.google.co.nz'
                },
                method: 'GET',
                types: ['REQUEST', 'SUCCESS', 'FAILURE']
            }
        }

        var middlewareTestReducer = function(state = {}, action) {
            switch (action.type) {
                case 'REQUEST':
                    expect(action.payload).to.not.exist()
                    done()
                    return state

                default:
                    return state
            }
        }

        // setup the store
        var store = setupStore(middlewareTestReducer)
        var result = store.dispatch(action)
    })

    it('should bailout if supplied a bailout boolean', (done) => {
        var action = {
            [CALL_API]: {
                endpoint: 'http://www.google.co.nz',
                method: 'GET',
                types: ['REQUEST', 'SUCCESS', 'FAILURE'],
                bailout: true
            }
        }

        var middlewareTestReducer = function(state = {}, action) {
            switch (action.type) {
                case 'REQUEST':
                    // failing test will run here
                    expect(1+1).to.equal(3)
                    return state

                default:
                    return state
            }
        }

        // setup the store
        var store = setupStore(middlewareTestReducer)
        var result = store.dispatch(action)

        result.then(() => {
            done()
        })
    })

    it('should process headers as a function', (done) => {
        var action = {
            [CALL_API]: {
                endpoint: 'http://www.google.co.nz',
                method: 'GET',
                types: ['REQUEST', 'SUCCESS', 'FAILURE'],
                headers: function() {
                    return [{'Referer': 'http://www.google.com'}]
                }
            }
        }

        var middlewareTestReducer = function(state = {}, action) {
            switch (action.type) {
                default:
                    return state
            }
        }

        // setup the store
        var store = setupStore(middlewareTestReducer)
        var result = store.dispatch(action)

        done()
    })

    it('should dispatch a success when done', (done) => {
        var action = {
            [CALL_API]: {
                endpoint: 'http://www.google.co.nz',
                method: 'GET',
                types: ['REQUEST', {
                    type: 'SUCCESS',
                    payload: (action, state, res) => {
                        return res
                    }
                }, 'FAILURE']
            }
        }

        var middlewareTestReducer = (state = {}, action) => {
            
            if (action.type === 'SUCCESS') {
                expect(action.payload).to.exist()
                done()
            }

            return state
        }

        // setup the store
        var store = setupStore(middlewareTestReducer)
        store.dispatch(action)
    })

    it('should return json', (done) => {
        var action = {
            [CALL_API]: {
                endpoint: 'http://whatismyip.azurewebsites.net/json/',
                method: 'GET',
                types: ['REQUEST', {
                    type: 'SUCCESS',
                    payload: (action, state, res) => {
                        return res
                    }
                }, 'FAILURE']
            }
        }

        var middlewareTestReducer = function(state = {}, action) {

            if (action.type === 'SUCCESS') {
                expect(action.payload.data).to.be.object()
                done()
            }

            return state
        }

        // setup the store
        var store = setupStore(middlewareTestReducer)
        store.dispatch(action)
    })
})

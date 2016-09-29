import {describe, before, it} from 'mocha'
import {expect} from 'code'
import {CALL_API, fetchComponentData} from  '../src'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {isValidTypeDescriptor, validateRSAA, isValidRSAA} from '../src/validation'

describe('Validation', () => {

    it('should return false if isValidTypeDescriptor is not passed an object', (done) => {

        var result = isValidTypeDescriptor()
        expect(result).to.equal(false)

        done()
    })

    it('should return false if isValidTypeDescriptor is not passed correctly keyed object', (done) => {

        var result = isValidTypeDescriptor({ foo: 'bar' })
        expect(result).to.equal(false)

        done()
    })

    it('should return false if isValidTypeDescriptor is not passed type as a string', (done) => {

        var result = isValidTypeDescriptor({ type: {} })
        expect(result).to.equal(false)

        done()
    })

    it('should validate a RSAA correctly', (done) => {

        var emptyRSAA = validateRSAA()
        expect(emptyRSAA.length).to.be.above(0)

        var nonRootKeyRSAA = validateRSAA({ foo: 'bar', [CALL_API]: {} })
        expect(nonRootKeyRSAA.length).to.be.above(0)

        var nonObjectRSAA = validateRSAA({ [CALL_API]: 'foo' })
        expect(nonObjectRSAA.length).to.be.above(0)

        var endpointObjectRSAA = validateRSAA({ [CALL_API]: { endpoint: {} }})
        expect(endpointObjectRSAA.length).to.be.above(0)

        var methodObjectRSAA = validateRSAA({ [CALL_API]: { endpoint: '', method: {} }})
        expect(methodObjectRSAA.length).to.be.above(0)

        var validMethodRSAA = validateRSAA({ [CALL_API]: { endpoint: '', method: 'foo' }})
        expect(validMethodRSAA.length).to.be.above(0)

        var validHeadersRSAA = validateRSAA({ [CALL_API]: { endpoint: '', method: 'GET', headers: 1 }})
        expect(validHeadersRSAA.length).to.be.above(0)

        var validCredentialsRSAA = validateRSAA({ [CALL_API]: { endpoint: '', method: 'GET', credentials: 'asdf' }})
        expect(validCredentialsRSAA.length).to.be.above(0)

        var validBailoutRSAA = validateRSAA({ [CALL_API]: { endpoint: '', method: 'GET', bailout: 1 }})
        expect(validBailoutRSAA.length).to.be.above(0)

        var validRequestTypeRSAA = validateRSAA({ [CALL_API]: { endpoint: '', method: 'GET', types: [1,2,3] }})
        expect(validRequestTypeRSAA.length).to.be.above(0)

        var isValid = isValidRSAA({})
        expect(isValid).to.equal(false)

        done()
    })
})

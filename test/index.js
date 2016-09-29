import {describe, before, it} from 'mocha'
import {expect} from 'code'
import {CALL_API, fetchComponentData} from  '../src'
import * as apiMiddleware from '../src/middleware'

describe('Module', () => {

    it('should spoon in redux-api-middleware', (done) => {

        expect(CALL_API).to.exist()
        done()
    })

    it('should spoon in custom middleware', (done) => {

        expect(apiMiddleware.version).to.equal('1.0.0')
        done()
    })

})

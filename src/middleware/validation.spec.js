const { describe, it } = require('mocha')
const { expect, assert, use } = require('chai')
const { spy, mock } = require('sinon')
const sinonChai = require('sinon-chai')

use(sinonChai)

const { createValidator } = require('./validation')

describe('Validation module', () => {
    describe('#createValidator(extractor, predicate, errorMessage?)', () => {
        describe('Validator creation', () => {
            it('Should return validator function', () => {
                const extractor = () => true
                const predicate = () => true
                const validator = createValidator(extractor, predicate)
                expect(validator)
                    .to.exist
                    .and
                    .to.be.a('function')
            })
            it('Should throw an Error - invalid extractor', () => {
                const extractor = undefined
                const predicate = undefined
                assert.throws(() => createValidator(extractor, predicate), 'Invalid extractor!')
            })
            it('Should throw an Error - invalid predicate', () => {
                const extractor = () => true
                const predicate = undefined
                assert.throws(() => createValidator(extractor, predicate), 'Invalid predicate!')
            })
        })
        describe('Validation logic', () => {
            let req, res, next, send

            beforeEach(() => {
                send = spy()
                res = mock()
                res = {
                    status: spy(() => ({
                        send
                    }))
                }
                next = spy()
            })

            it('Should pass validation', () => {
                const param = 'param'
                const extractor = spy(() => param)
                const predicate = spy(() => true)
                const validator = createValidator(extractor, predicate)
                validator(req, res, next)
                expect(extractor).to.be.calledOnceWith(req)
                expect(predicate).to.be.calledOnceWith(param)
                expect(next).to.be.calledOnce
            })

            it('Should fail validation with default errorMessage', () => {
                const param = 'param'
                const extractor = spy(() => param)
                const predicate = spy(() => false)
                const validator = createValidator(extractor, predicate)
                validator(req, res, next)
                expect(extractor).to.be.calledOnceWith(req)
                expect(predicate).to.be.calledOnceWith(param)
                expect(res.status).to.be.calledOnceWith(400)
                expect(send).to.be.calledOnceWith('Validation failed!')
            })

            it('Should use custom errorMessage', () => {
                const param = 'param'
                const extractor = spy(() => param)
                const predicate = spy(() => false)
                const errorMessage = 'ERROR'
                const validator = createValidator(extractor, predicate, errorMessage)
                validator(req, res, next)
                expect(extractor).to.be.calledOnceWith(req)
                expect(predicate).to.be.calledOnceWith(param)
                expect(res.status).to.be.calledOnceWith(400)
                expect(send).to.be.calledOnceWith(errorMessage)
            })
        })
    })
})

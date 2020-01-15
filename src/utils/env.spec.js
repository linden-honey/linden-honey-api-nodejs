const { describe, it } = require('mocha')
const { expect } = require('chai')

const { getEnv } = require('./env')

describe('Env module', () => {
    describe('#getEnv(key, defaultValue?)', () => {
        it('Should return default value', () => {
            const key = `KEY_${Math.random().toString(36)}`
            const defaultValue = 'defaultValue'
            const result = getEnv(key, defaultValue)
            expect(result).is.equal(defaultValue)
        })
        it('Should return a value', () => {
            const key = `KEY_${Math.random().toString(36)}`
            const value = 'value'
            process.env[key] = value
            const result = getEnv(key)
            expect(result).is.equal(value)
        })
        it('Should throw an Error - missing key argument', () => {
            expect(() => getEnv()).to.throw("Missing 'key' argument!")
        })
        it('Should throw an Error - required key', () => {
            const key = `KEY_${Math.random().toString(36)}`
            expect(() => getEnv(key)).to.throw(`"${key}" is required!`)
        })
    })
})

const { describe, it } = require('mocha')
const { expect, assert } = require('chai')

const { getEnv } = require('./env')

describe('Env module', () => {
    describe('#getEnv(key, defaultValue?)', () => {
        it('Should return default value', () => {
            const key = `KEY_${new Date().getMilliseconds()}`
            const defaultValue = 'defaultValue'
            const result = getEnv(key, defaultValue)
            expect(result).is.equal(defaultValue)
        })
        it('Should return a value', () => {
            const key = `KEY_${new Date().getMilliseconds()}`
            const value = 'value'
            process.env[key] = value
            const result = getEnv(key)
            expect(result).is.equal(value)
        })
        it('Should throw an Error - missing key argument', () => {
            assert.throws(() => getEnv(), "Missing 'key' argument!")
        })
        it('Should throw an Error - required key', () => {
            const key = `KEY_${new Date().getMilliseconds()}`
            assert.throws(() => getEnv(key), `"${key}" is required!`)
        })
    })
})

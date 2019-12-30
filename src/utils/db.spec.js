const { describe, it } = require('mocha')
const { expect, assert } = require('chai')

const { convertSortOrder } = require('./db')

describe('DB module', () => {
    describe('#convertSortOrder(order?)', () => {
        it('Should return default order - ascending', () => {
            const result = convertSortOrder()
            expect(result).is.equal(1)
        })
        it('Should return 1 for ascending order', () => {
            const result = convertSortOrder('asc')
            expect(result).is.equal(1)
        })
        it('Should return -1 for descending order', () => {
            const result = convertSortOrder('desc')
            expect(result).is.equal(-1)
        })
    })
})

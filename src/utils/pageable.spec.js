const { describe, it } = require('mocha')
const { expect } = require('chai')

const { createPageable, defaultPageable } = require('./pageable')

describe('Pageable module', () => {
    describe('Default pageable object', () => {
        it('Should be an initialized and frozen object', () => {
            expect(defaultPageable)
                .to.exist
                .and
                .to.be.frozen
                .and
                .to.be.deep.equals({
                    limit: 20,
                    offset: 0,
                    sortBy: undefined,
                    sortOrder: 'asc',
                })
        })
    })
    describe('#createPageable({ limit, offset, sortBy, sortOrder })', () => {
        it('Should create pageable from configuration object', () => {
            const input = {
                limit: 10,
                offset: 20,
                sortBy: 'title',
                sortOrder: 'asc',
            }
            const result = createPageable(input)
            expect(result).to.be.deep.equals(input)
        })
        it('Should return default pageable', () => {
            const result = createPageable()
            expect(result).to.be.deep.equals(defaultPageable)
        })
        it('Should substitute default values if some properties is missing', () => {
            const input = {
                limit: undefined,
                offset: undefined,
                sortBy: undefined,
                sortOrder: undefined,
            }
            const result = createPageable(input)
            expect(result).to.be.deep.equals(defaultPageable)
        })
        describe('Should convert limit and offset to Int', () => {
            it('Pass strings with valid numbers', () => {
                const input = {
                    limit: '10',
                    offset: '20',
                }
                const result = createPageable(input)
                expect(result).to.be.deep.equals({
                    limit: 10,
                    offset: 20,
                    sortBy: defaultPageable.sortBy,
                    sortOrder: defaultPageable.sortOrder,
                })
            })
            it('Pass numbers', () => {
                const input = {
                    limit: 10,
                    offset: 20,
                }
                const result = createPageable(input)
                expect(result).to.be.deep.equals({
                    limit: 10,
                    offset: 20,
                    sortBy: defaultPageable.sortBy,
                    sortOrder: defaultPageable.sortOrder,
                })
            })
            it('Pass strings that parsed to NaN', () => {
                const input = {
                    limit: 'a',
                    offset: 'b',
                    sortBy: undefined,
                    sortOrder: undefined,
                }
                const result = createPageable(input)
                expect(result).to.be.deep.equals(defaultPageable)
            })
        })
    })
})

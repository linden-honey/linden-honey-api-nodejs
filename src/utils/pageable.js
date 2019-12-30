const defaults = {
    limit: 20,
    offset: 0,
    sortBy: undefined,
    sortOrder: 'asc'
}

const createPageable = ({
    limit = defaults.limit,
    offset = defaults.offset,
    sortBy = defaults.sortBy,
    sortOrder = defaults.sortOrder,
} = defaults) => ({
    limit: parseInt(limit) || defaults.limit,
    offset: parseInt(offset) || defaults.offset,
    sortBy,
    sortOrder,
})

module.exports = {
    createPageable,
    defaultPageable: Object.freeze(defaults),
}

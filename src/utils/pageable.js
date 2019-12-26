const defaults = {
    limit: 20,
    offset: 0,
    sortBy: '',
    sortOrder: 'asc'
}

const createPageable = ({
    limit = defaults.limit,
    offset = defaults.offset,
    sortBy = defaults.sortBy,
    sortOrder = defaults.sortOrder,
} = defaults) => ({
    limit: parseInt(limit),
    offset: parseInt(offset),
    sortBy,
    sortOrder,
})

module.exports = {
    createPageable,
}

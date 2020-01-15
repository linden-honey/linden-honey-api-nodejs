const getEnv = (key, defaultValue) => {
    if (key === undefined) {
        throw new Error("Missing 'key' argument!")
    }
    const hasValue = process.env[key] !== undefined
    if (!hasValue && defaultValue === undefined) {
        throw new Error(`"${key}" is required!`)
    }
    return hasValue ? process.env[key] : defaultValue
}

module.exports = {
    getEnv,
}

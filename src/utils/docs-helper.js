exports.getRoutes = (routesStack) => {
    return routesStack.reduce((previousRoute, currentRoute, index, array) => {
        return [].concat(...currentRoute.methods.map(method => {
            return {'method': method, path: currentRoute.path}
        }))
    })
}

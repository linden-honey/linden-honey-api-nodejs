exports.getRoutes = routesStack => {
    const routes = routesStack.map(route => (
        route.methods.map(method => ({'method': method, 'path': route.path}))
    ))
    return [].concat(...routes)
}

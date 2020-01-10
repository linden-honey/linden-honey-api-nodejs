const swaggerUi = require('swagger-ui-express')

class DocsController {
    constructor({ spec }) {
        this.spec = spec
        this.getSwaggerUi = swaggerUi.setup(null, {
            swaggerUrl: '/api-docs',
        })
    }

    getSpec = (_, res) => {
        res.json(this.spec)
    }

    swaggerUiStatic = swaggerUi.serve
}

module.exports = DocsController

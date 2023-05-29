import { FastifyInstance } from "fastify"
import fp from "fastify-plugin"

declare module 'fastify' {
  interface FastifyInstance {
    routes: Map<string, any>
  }
}

function routes(fastify: FastifyInstance, options: any, next: Function) {
  fastify.decorate('routes', new Map())

  fastify.addHook('onRoute', (routeOptions) => {
    const { url } = routeOptions

    let routeListForUrl = fastify.routes.get(url)
    if (!routeListForUrl) {
      routeListForUrl = []
      fastify.routes.set(url, routeListForUrl)
    }

    routeListForUrl.push(routeOptions)
  })

  next()
}

export default fp(routes)
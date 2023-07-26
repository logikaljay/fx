import path from "node:path"
import { FastifyInstance } from "fastify";
import { loadConfig } from "../config";
import fp from "fastify-plugin"
import { jsonSchemaTransform } from "fastify-type-provider-zod"

async function wellKnownPlugin(fastify: FastifyInstance) {
  const config = await loadConfig()

  if (!config?.wellKnown) {
    return
  }

  const url = path.join(config.baseUrl||'/', '.well-known/fx-configuration')
    .replace(/\/\//gi, '/')

    
  fastify.get(url, async (req, reply) => {
    let routes = []
    for (let [key, route] of fastify.routes) {
      for (let routeMethod of route) {
        if (routeMethod.schema) {
          routes.push({
            ...jsonSchemaTransform({
              schema: routeMethod.schema,
              url: routeMethod.url
            }),
            method: routeMethod.method
          })
        }
      }
    }

    reply.send({
      name: 'fx',
      routes
    })
  })
}

export default fp(wellKnownPlugin)
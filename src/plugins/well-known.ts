import path from "node:path"
import { FastifyInstance } from "fastify";
import { loadConfig } from "../config";

async function wellKnownPlugin(fastify: FastifyInstance) {
  const { data } = await loadConfig()

  if (!data?.wellKnown) {
    return
  }

  const url = path.join(data.baseUrl||'/', '.well-known/fx-configuration')
    .replace(/\/\//gi, '/')
  console.log(url)
  fastify.get(url, async (req, reply) => {
    reply.send({
      name: 'fx',
      config: data
    })
  })
}

export default wellKnownPlugin
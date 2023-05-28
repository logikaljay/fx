import { basename } from "path"
import { Cli } from "../types"

export default function init(cli: Cli) {
  let cmd = cli.command('init', 'Scaffold a new function')
  cmd.option('-n, --name [name]', 'The name of the function')
  cmd.action(handler)
}

async function handler(opts: any) {

  let fx = {
    name: opts.name ?? basename(process.cwd())
  }

  let files = {
    '.gitignore': `
      dist
      node_modules
      .env*
      .env
      .vscode
    `,

    'index.ts': `
    import type { FastifyRequest } from "fastify"
    import { http } from "@5oo/fx"

    type ExampleRequest = FastifyRequest<{
      Querystring: {
        name: string
      }
    }>

    http.get('/*', (req: ExampleRequest, reply) => {
      reply.send({ foo: 'bar', name: req.query.name })
    })
    `,

    'package.json': `
    {
      "name": "${fx.name}",
      "version": "0.0.0",
      "description": "",
      "main": "dist/index.js",
      "scripts": {
        "dev": "fx dev",
        "build": "fx build"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "dependencies": {
        "fastify": "^4.17.0"
      },
      "devDependencies": {
        "fx": "@5oo/fx"
      }
    }
    `
  }
}
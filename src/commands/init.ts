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
    import { http } from "@5oo/fx"
    import { z } from "zod"
    
    http.route({
      method: 'GET',
      url: '/:name',
      schema: {
        querystring: z.object({
          name: z.string()
        })
      },
      handler: (req, reply) => {
        return reply.send({ name: req.query.name })
      }
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
import { basename, dirname } from "path"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import { Cli } from "../types"
import { execSync } from "child_process"
import pkg from "../../package.json"

export default function init(cli: Cli) {
  let cmd = cli.command('init', 'Scaffold a new function')
  cmd.option('-n, --name [name]', 'The name of the function')
  cmd.action(handler)
}

async function handler(opts: any) {

  let fx = {
    name: opts.name ?? basename(process.cwd())
  }

  let files: Record<string, string> = {
    '.gitignore': `
    dist
    node_modules
    .env*
    .env
    .vscode
    `,

    'src/index.ts': `
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
        "fastify": "^4.20.0",
        "zod": "^3.21.4"
      },
      "devDependencies": {
        "@5oo/fx": "^${pkg.version}"
      }
    }
    `,

    'fx.config.ts': `
    import { defineConfig } from "@5oo/fx"

    export default defineConfig({
      basePath: 'src'
    })
    `
  }

  function sanitise(input?: string) {
    return (input || "").replace(/\n    /gi, '\n').replace('\nimport', 'import')
  }

  for (let file in files) {
    // get basename
    let pathToFile = dirname(file)
    
    // mkdir if needed
    if (!existsSync(pathToFile)) {
      mkdirSync(pathToFile, { recursive: true })
    }

    // scaffold files
    writeFileSync(file, sanitise(files[file]))
  }

  execSync('pnpm install', {
    stdio: ['inherit', 'inherit', 'inherit'],
    cwd: process.cwd()
  })
}
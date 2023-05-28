import { join } from "path"
import { Cli } from "../types"
import { build } from "tsup"

export default function dev(cli: Cli) {
  let cmd = cli.command('dev', 'Start a development server')
  cmd.option('-p, --port [port]', "Port to listen on")
  cmd.action(handler)
}

async function handler(opts: any) {
  let index = join(process.cwd(), 'index.ts')
  build({
    entry: [index],
    splitting: false,
    format: 'cjs',
    target: 'node18',
    platform: 'node',
    external: ['esbuild'],
    clean: true
  })
}
import { join } from "path"
import { Cli } from "../types"
import { build } from "tsup"

export default function buildCmd(cli: Cli) {
  let cmd = cli.command('build', 'Build the function')
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
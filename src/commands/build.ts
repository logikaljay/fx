import { build } from "tsup"
import { join } from "path"
import { Cli } from "../types"
import { loadConfig } from "../config"

export default function buildCmd(cli: Cli) {
  let cmd = cli.command('build', 'Build the function')
  cmd.action(handler)
}

async function handler(opts: any) {
  const config = await loadConfig()
  let index = join(config.basePath, 'index.ts')
  
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
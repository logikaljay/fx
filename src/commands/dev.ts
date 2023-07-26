import { build } from "tsup"
import { join } from "path"
import { spawn } from "child_process"
import { Cli } from "../types"
import { loadConfig } from "../config"

export default function dev(cli: Cli) {
  let cmd = cli.command('dev', 'Start a development server')
  cmd.option('-p, --port [port]', "Port to listen on")
  cmd.action(handler)
}

async function handler(opts: any) {
  const config = await loadConfig()
  let index = join(config?.basePath || "", 'index.ts')

  build({
    entry: [index],
    splitting: false,
    format: 'cjs',
    target: 'node18',
    platform: 'node',
    external: ['esbuild', 'tsup'],
    clean: true,
    watch: true,
    onSuccess: async () => {
      let proc = spawn("node", ['./dist/index.js'], {
        stdio: [0, 1, 2, 'ipc'],
        env: {
          ...process.env,
          PORT: opts.p ?? 3000
        },
        cwd: process.cwd()
      })

      return async () => {
        console.log(`Change detected. Restarting dev server`)
        proc.kill()
      }
    }
  })
}
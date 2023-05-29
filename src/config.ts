import path from "node:path"
import fs from "node:fs"
import { z } from "zod"
import { bundleRequire } from "bundle-require"

const configSchema = z.object({
  host: z.string().default('127.0.0.1'),
  port: z.number().default(3000),
  wellKnown: z.boolean().default(true),
  baseUrl: z.string().default('')
    .transform(url => url?.endsWith('/') ? url.substring(0, url.length - 1) : url)
})
export type Config = z.output<typeof configSchema>

export function defineConfig(opts: z.input<typeof configSchema>) {
  return configSchema.parse(opts)
}

export async function loadConfig(
  cwd?: string,
  configFile?: string
): Promise<{ path?: string, data?: Config }> {

  const configPaths = configFile 
    ? [configFile]
    : [
      "fx.config.ts",
      "fx.config.js",
      "fx.config.cjs",
      "fx.config.mjs",
      "fx.config.json",
      "package.json"
    ].filter(configFile => path.resolve(cwd || process.cwd(), configFile))

  const configPath = configPaths[0]
  if (configPath) {
    if (configPath.endsWith('.json')) {
      let configStr = fs.readFileSync(path.join(process.cwd(), configPath)).toString()
      let data;
      try {
        data = JSON.parse(configStr)
      }
      catch (err) {
        console.error(`Could not load ${configPath} file:`)
        console.error(err)
      }

      if (configPath.endsWith('package.json')) {
        data = data.fx
      }

      if (data) {
        return { path: configPath, data }
      }
      else {
        return {}
      }
    }

    const config = await bundleRequire({
      filepath: configPath
    })

    return {
      path: configPath,
      data: configSchema.parse(config.mod.fx || config.mod.default || config.mod)
    }
  }

  return {}
}
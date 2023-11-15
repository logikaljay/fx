import path from "node:path"
import fs from "node:fs"
import { z } from "zod"
import { bundleRequire } from "bundle-require"

const configSchema = z.object({
  http: z.object({
    host: z.string().default('127.0.0.1'),
    port: z.number().default(3000),
    wellKnown: z.boolean().default(true),
    baseUrl: z.string()
      .default('')
      .transform(url => url?.endsWith('/') ? url.substring(0, url.length - 1) : url),
  }).optional().default({
    host: '127.0.0.1',
    port: 3000,
    wellKnown: true,
    baseUrl: ''
  }),
  amqp: z.object({
    uri: z.string(),
    exchange: z.string(),
    queue: z.string(),
    pattern: z.string(),
    ack: z.boolean().default(true),
  }).optional(),
  basePath: z.string().optional().nullable()
})

export const defaultConfig = configSchema.parse({})

export type Config = z.output<typeof configSchema>

export function defineConfig(opts: z.input<typeof configSchema>) {
  config = configSchema.parse(opts)
  return config
}

let config: z.infer<typeof configSchema>;

export async function loadConfig(
  cwd?: string,
  configFile?: string
): Promise<Config> {

  if (config) {
    return config
  }
  
  const configPaths = configFile 
    ? [configFile]
    : [
      "fx.config.ts",
      "fx.config.js",
      "fx.config.cjs",
      "fx.config.mjs",
      "fx.config.json",
      "package.json"
    ]
    .map(configFile => path.resolve(cwd || process.cwd(), configFile))
    .filter(configPath => fs.existsSync(configPath))

  const configPath = configPaths[0]
  if (configPath) {
    if (configPath.endsWith('.json')) {
      let configStr = fs.readFileSync(configPath).toString()
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
        return data
      }
      else {
        return defaultConfig
      }
    }

    const config = await bundleRequire({
      filepath: configPath
    })

    return configSchema.parse(config.mod.fx || config.mod.default || config.mod)
  }

  return defaultConfig
}

export function setConfig(
  input: z.input<typeof configSchema>
) {
  config = configSchema.parse(input)
  return config
}
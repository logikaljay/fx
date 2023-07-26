import { describe, expect, it } from "vitest"
import { loadConfig, defaultConfig, setConfig } from "./config"

describe('config', () => {
  it('should return the default config if no config file can be found', async () => {
    let config = await loadConfig()
    expect(config).toEqual(defaultConfig)
  })

  it('should setConfig correctly', async () => {
    let config = setConfig({
      basePath: '/api/test',
    })

    expect(config.basePath).toBe('/api/test')
  })
})
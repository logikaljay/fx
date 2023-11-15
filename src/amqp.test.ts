import { describe, expect, it } from "vitest"
import { loadConfig, defaultConfig, setConfig } from "./config"
import { amqp } from "./"
import { z } from "zod"

describe('amqp', () => {
  it('expose get and listen', async () => {
    expect(amqp).toHaveProperty('get')
    expect(amqp).toHaveProperty('listen')
  })
})
import { describe, expect, it } from "vitest"
import { route } from "./http"
import { setConfig } from "./config"

describe('http', () => {
  it('should load the route correctly', async () => {
    
    const payload = { greeting: "hello" }

    const app = await route({
      url: "/",
      method: "GET",
      handler: (req, reply) => {
        reply.send(payload)
      }
    })

    const response = await app.inject({
      method: 'GET',
      url: '/'
    })

    expect(response.statusCode).toBe(200)
    expect(await response.json()).toEqual(payload)
  })

  it('should use the correct url when a baseUrl is set', async () => {
    setConfig({
      baseUrl: '/api/test',
      port: 0
    })

    const payload = { greeting: "hello" }

    const app = await route({
      url: "/foo",
      method: "GET",
      handler: (req, reply) => {
        reply.send(payload)
      }
    })

    const response = await app.inject({
      method: 'GET',
      url: '/api/test/foo'
    })

    expect(response.statusCode).toBe(200)
    expect(await response.json()).toEqual(payload)
  })

  it('should use the handle trailing slashes correctly', async () => {
    setConfig({
      baseUrl: '/api/test',
      port: 0
    })

    const payload = { greeting: "hello" }

    const app = await route({
      url: "/foo/",
      method: "GET",
      handler: (req, reply) => {
        reply.send(payload)
      }
    })

    const response = await app.inject({
      method: 'GET',
      url: '/api/test/foo'
    })

    expect(response.statusCode).toBe(200)
    expect(await response.json()).toEqual(payload)
  })
})

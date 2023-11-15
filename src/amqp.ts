import amqplib from "amqplib"
import { loadConfig } from "./config"
import { Schema, ZodAny, ZodSchema, ZodType, z } from "zod"

export type Config = NonNullable<Awaited<ReturnType<typeof loadConfig>>["amqp"]>
export type EventHandler<T extends amqplib.Message, Schema extends Object> = (msg: T & { data: Schema }) => Promise<void>

let channel: amqplib.Channel
let queue: amqplib.Replies.AssertQueue

async function createChannel(config: Config) {
  const conn = await amqplib.connect(config.uri)
  channel = await conn.createChannel()
  queue = await channel.assertQueue(config.queue)
  await channel.bindQueue(config.queue, config.exchange, config.pattern)
  console.info(`Bound ${config.exchange} to ${config.queue} for events matching pattern '${config.pattern}'`)
  return { channel, queue }
}

export async function listen<Schema extends ZodType>(handler: EventHandler<amqplib.ConsumeMessage, Schema["_output"]>) {
  const config = (await loadConfig()).amqp!
  let { channel, queue } = await createChannel(config)
  await channel.consume(queue.queue, async msg => {
    if (msg) {
      const data = JSON.parse(msg.content.toString()) as Schema["_output"]
      await handler({ ...msg, data })
      if (msg && config.ack) {
        channel.ack(msg)
      }
    }
  })
}

export async function get<Schema extends ZodType>(handler: EventHandler<amqplib.GetMessage, Schema["_output"]>) {
  const config = (await loadConfig()).amqp!
  let { channel, queue } = await createChannel(config)
  const msg = await channel.get(queue.queue)
  if (msg) {
    const data = JSON.parse(msg.content.toString()) as Schema["_output"]
    await handler({ ...msg, data })
    process.exit(0)
  }
  else {
    console.log(`no messages waiting, exiting`)
    process.exit(0)
  }
}
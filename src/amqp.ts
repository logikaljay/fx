import amqplib from "amqplib"
import { loadConfig } from "./config"
import { z } from "zod"

export type Config = NonNullable<Awaited<ReturnType<typeof loadConfig>>["amqp"]>
export type EventHandler = (msg: amqplib.Message | amqplib.ConsumeMessage | amqplib.GetMessage) => Promise<void>

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

export async function listen(handler: EventHandler) {
  const config = (await loadConfig()).amqp!
  let { channel, queue } = await createChannel(config)
  await channel.consume(queue.queue, async msg => {
    if (msg) {
      await handler(msg)
      if (msg && config.ack) {
        channel.ack(msg)
      }
    }
  })
}

export async function get(handler: EventHandler) {
  const config = (await loadConfig()).amqp!
  let { channel, queue } = await createChannel(config)
  const msg = await channel.get(queue.queue)
  if (msg) {
    await handler(msg)
    process.exit(0)
  }
  else {
    console.log(`no messages waiting, exiting`)
    process.exit(0)
  }
}
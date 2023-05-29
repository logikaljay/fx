#!/usr/bin/env node

import { cac } from 'cac'

import dev from "./commands/dev"
import build from "./commands/build"

const cli = cac('fx')

function register(mod: any) {
  mod(cli)
}

async function main() {

  let commands = [
    dev,
    build,
  ]

  commands.map(register)
  cli.version('v1.0.0')
  cli.help()
  cli.parse()
}

main()
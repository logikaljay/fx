#!/usr/bin/env node

import { cac } from 'cac'

import dev from "./commands/dev"
import build from "./commands/build"

const cli = cac()

function register(mod: any) {
  mod(cli)
}

async function main() {

  [
    dev,
    build,
  ].map(register)

  cli.name = 'fx'
  cli.version('v1.0.0')
  cli.help()
  cli.parse()
}

main()
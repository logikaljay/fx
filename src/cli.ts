#!/usr/bin/env node

import { cac } from 'cac'
import { commands } from './commands'
import pkg from "../package.json"

const cli = cac('fx')

function register(mod: any) {
  mod(cli)
}

async function main() {

  commands.map(register)
  cli.version(`v${pkg.version}`)
  cli.help()
  cli.parse()
}

main()
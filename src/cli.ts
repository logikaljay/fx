import { cac } from 'cac'

import dev from "./commands/dev"

const cli = cac()

function register(mod: any) {
  mod(cli)
}

async function main() {

  [
    dev
  ].map(register)

  cli.name = 'fx'
  cli.version('v1.0.0')
  cli.help()
  cli.parse()
}

main()
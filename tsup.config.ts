import { defineConfig } from 'tsup'
import { spawn } from 'child_process'

export default defineConfig({
  external: ['esbuild', 'tsup']
  
  // async onSuccess() {
  //   let proc = spawn("node", ['./dist/cli.js'], {
  //     stdio: [0, 1, 2, 'ipc'],
  //     env: process.env
  //   })

  //   return () => {
  //     proc.kill()
  //   }
  // },
})
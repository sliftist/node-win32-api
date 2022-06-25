import { spawn } from 'child_process'
import assert from 'node:assert/strict'

import { fileShortPath } from '@waiting/shared-core'

import { calcLpszWindow } from './config.unittest.js'
import {
  destroyWin,
  user32,
} from './helper.js'


describe(fileShortPath(import.meta.url), () => {
  it('Open a calc.exe and find it\'s window hWnd', (done) => {
    const child = spawn('calc.exe')

    setTimeout(() => {
      const hWnd = user32.FindWindowExW(0, 0, null, calcLpszWindow)

      if (typeof hWnd === 'number' && hWnd > 0
        || typeof hWnd === 'bigint' && hWnd > 0
        || typeof hWnd === 'string' && hWnd.length > 0
      ) {
        assert(true)
        destroyWin(hWnd)
      }
      else {
        assert(false, 'found no calc window')
      }

      child.kill()
      done()
    }, 1500)
  })

  it('Open a calc.exe and change it\'s window title', (done) => {
    const child = spawn('calc.exe')

    setTimeout(() => {
      const hWnd = user32.FindWindowExW(0, 0, null, calcLpszWindow)

      if (typeof hWnd === 'number' && hWnd > 0
        || typeof hWnd === 'bigint' && hWnd > 0
        || typeof hWnd === 'string' && hWnd.length > 0
      ) {
        const title = 'Node-Calculator'
        const len = title.length + 1
        // Change title of the Calculator
        const res = user32.SetWindowTextW(hWnd, Buffer.from(title + '\0', 'ucs2'))

        if (! res) {
          // https://github.com/node-ffi/node-ffi/issues/261
          // See: [System Error Codes] below
          // const errcode = knl32.GetLastError()
          // const len = 255
          // const buf = Buffer.alloc(len)
          // // tslint:disable-next-line
          // const p = 0x00001000 | 0x00000200 // FORMAT_MESSAGE_FROM_SYSTEM | FORMAT_MESSAGE_IGNORE_INSERTS
          // const langid = 0x0409 // 0x0409: US, 0x0000: Neutral locale language
          // const msglen = knl32.FormatMessageW(p, null, errcode, langid, buf, len, null)

          // if (msglen) {
          //   const errmsg = ref.reinterpretUntilZeros(buf, 2).toString('ucs2')
          //   assert(false, `window found but change the title failed. errcode: ${errcode}, errmsg: "${errmsg}"`)
          // }
          assert(false, 'user32.SetWindowTextW() failed')
        }
        else {
          const buf = Buffer.alloc(len * 2)

          user32.GetWindowTextW(hWnd, buf, len)
          const str = buf.toString('ucs2').replace(/\0+$/, '')
          assert(str === title, `title should be changed to "${title}", bug got "${str}"`)
        }

        destroyWin(hWnd)
      }
      else {
        assert(false, 'found no calc window')
      }

      child.kill()
      done()
    }, 1000)
  })

})


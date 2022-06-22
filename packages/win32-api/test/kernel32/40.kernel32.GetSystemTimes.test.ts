import assert from 'node:assert/strict'

import { fileShortPath } from '@waiting/shared-core'
import {
  DModel as M,
  DStruct as DS,
} from 'win32-def'

import {
  knl32,
  Struct,
} from '../helper.js'


describe(fileShortPath(import.meta.url), () => {

  const fileTimeClass = Struct(DS.FILETIME)

  it('sync works', () => {
    const idleTime: M.FILETIME_Struct = new fileTimeClass() as M.FILETIME_Struct
    const kernelTime: M.FILETIME_Struct = new fileTimeClass() as M.FILETIME_Struct
    const userTime: M.FILETIME_Struct = new fileTimeClass() as M.FILETIME_Struct

    knl32.GetSystemTimes(idleTime.ref(), kernelTime.ref(), userTime.ref())
    assert(fileTimeToNumber(idleTime) > 0)
    assert(fileTimeToNumber(kernelTime) > 0)
    assert(fileTimeToNumber(userTime) > 0)
  })

  it('async works', () => {
    const idleTime: M.FILETIME_Struct = new fileTimeClass() as M.FILETIME_Struct
    const kernelTime: M.FILETIME_Struct = new fileTimeClass() as M.FILETIME_Struct
    const userTime: M.FILETIME_Struct = new fileTimeClass() as M.FILETIME_Struct

    knl32.GetSystemTimes.async(idleTime.ref(), kernelTime.ref(), userTime.ref(), (err) => {
      if (err) {
        return assert(false, err.message ? err.message : 'unknown error')
      }
      assert(fileTimeToNumber(idleTime) > 0)
      assert(fileTimeToNumber(kernelTime) > 0)
      assert(fileTimeToNumber(userTime) > 0)
    })
  })
})


function fileTimeToNumber(fileTime: M.FILETIME_Struct): number {
  return fileTime.dwLowDateTime + fileTime.dwHighDateTime * Math.pow(2, 32)
}

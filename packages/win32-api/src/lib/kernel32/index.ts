import { FModel } from 'win32-def'

import { load as hload } from '../helper.js'
import { DllNames } from '../model.js'

import { apiDef, Win32Fns } from './api.js'


export { apiDef }
export { Win32Fns }
export const dllName = DllNames.kernel32
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const load = (
  fns?: FModel.FnName[],
  settings?: FModel.LoadSettings,
) => hload<FModel.ExpandFnModel<Win32Fns>>(dllName, apiDef, fns, settings)


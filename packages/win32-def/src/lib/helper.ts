import {
  settingsDefault,
  windefSet,
  _UNICODE_HOLDER,
  _WIN64_HOLDER,
} from './config.js'
import {
  DataTypes,
  FnParam,
  LoadSettings,
  MacroDef,
  MacroMap,
} from './ffi.model.js'


// convert macro variable of windef
export function parse_windef(windefObj: DataTypes, macroMap: MacroMap, settings?: LoadSettings): DataTypes {
  const ww = clone_filter_windef(windefObj) // output without macroMap
  const macroSrc = prepare_macro(macroMap, settings)
  const ret = prepare_windef_ref(ww, macroSrc)

  validateWinData(ret, windefSet)
  return ret
}


/**
 * convert typeof array of param to string
 * such like ['_WIN64_HOLDER_', 'int64', 'int32'], no changed returning when string
 */
export function parse_param_placeholder(param: FnParam | MacroDef, settings?: LoadSettings): FnParam {
  if (typeof param === 'string') {
    return param
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  else if (! param) {
    throw new Error('parse_param_placeholder(ps, settings) value of ps invalid')
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  else if (! Array.isArray(param) || param.length !== 3) {
    throw new Error('parse_param_placeholder(ps, settings) value of ps must Array and has THREE elements')
  }

  const st = parse_settings(settings)
  let ps: FnParam = ''

  switch (param[0]) {
    case _WIN64_HOLDER:
      ps = parse_placeholder_arch(param, st._WIN64 as boolean)
      break
    case _UNICODE_HOLDER:
      ps = parse_placeholder_unicode(param, st._UNICODE as boolean)
      break
    default:
      throw new Error('the value of param placeholder invlaid:' + param[0])
  }

  return ps
}


// convert param like ['_WIN64_HOLDER_', 'int64', 'int32] to 'int64' or 'int32'
export function parse_placeholder_arch(param: FnParam | MacroDef, _WIN64: boolean): FnParam {
  if (typeof param === 'string') {
    return param
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  else if (! param || param.length !== 3) {
    throw new Error('_WIN64 macro should be Array and has 3 items')
  }

  return _WIN64 ? param[1] : param[2]
}

// convert param like ['_UNICODE_HOLDER_', 'uint16*', 'uint8*'] to 'uint16*' or 'uint8*'
export function parse_placeholder_unicode(param: FnParam | MacroDef, _UNICODE: boolean): FnParam {
  if (typeof param === 'string') {
    return param
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  else if (! param || param.length !== 3) {
    throw new Error('_UNICODE macro should be Array and has 3 items')
  }
  return _UNICODE ? param[1] : param[2]
}


/**
 * parse ['_WIN64_HOLDER', 'int64*', 'int32*'] to 'int64*' or 'int32'
 * or ['_UNICODE_HOLDER_', 'uint16*', 'uint8*'] to 'uint16*' or 'uint8*'
 */
export function prepare_macro(macroMap: MacroMap, settings?: LoadSettings): Map<string, FnParam> {
  const ret = new Map<string, FnParam>()

  // v string|array
  for (const [k, v] of macroMap.entries()) {
    ret.set(k, parse_param_placeholder(v, settings))
  }
  return ret
}


/**
 * parse const HANDLE = 'PVOID' to the realy FFIParam (like 'uint32*')
 * macroMap <['PVOID', 'uint32*'], ...>
 */
export function prepare_windef_ref(ww: DataTypes, macroSrc: Map<string, string>): DataTypes {
  const ret: DataTypes = {}
  const map = new Map<string, string>()

  // first loop paser keys which exists in macroSrc
  for (const x of Object.keys(ww)) {
    /* istanbul ignore next */
    if (map.has(x)) {
      continue
    }
    if (macroSrc.has(x)) { // PVOID:_WIN64_HOLDER -> PVOID:'uint64*'
      const vv = macroSrc.get(x)

      if (vv) {
        map.set(x, vv)
      }
      else {
        throw new Error(`Value of macroSrc item "${x}" blank`)
      }
    }
    else {
      continue // not throw error
    }
  }
  // 2nd loop paser key , maybe value refer other key
  for (const [k, v] of Object.entries(ww)) {
    /* istanbul ignore next */
    if (map.has(k)) {
      continue
    }

    if (typeof v === 'string') {
      if (windefSet.has(v)) {
        map.set(k, v)
      }
      else {
        const value = lookupRef(v, ww, macroSrc)

        // tslint:disable-next-line
        if (typeof value === 'string' && value) {
          map.set(k, value)
        }
        else {
          map.set(k, v) // maybe invalid for windefSet, will validateWinData() later
        }
      }
    }
    else {
      throw new Error(`prepare_windef_ref() missing entry for k/v: ${k}/"N/A"`)
    }
  }

  map.forEach((v, k) => {
    ret[k] = v
  })

  return ret
}


export function clone_filter_windef(windef: DataTypes): DataTypes {
  const ret: DataTypes = {}

  for (const x of Object.keys(windef)) {
    if (typeof windef[x] === 'string') {
      Object.defineProperty(ret, x, {
        value: windef[x],
        writable: true,
        enumerable: true,
        configurable: true,
      })
    }
    else {
      throw new Error(`typeof value of ${x} NOT string`)
    }
  }

  return ret
}

export function parse_settings(settings?: LoadSettings): LoadSettings {
  const st: LoadSettings = { ...settingsDefault }

  if (typeof settings !== 'undefined' && Object.keys(settings).length) {
    Object.assign(st, settings)
  }
  return st
}


export function lookupRef(key: string, ww: DataTypes, macroSrc: Map<string, string>): string {
  let ret = _lookupRef(key, ww, macroSrc)

  if (! ret) {
    return ''
  }

  for (let i = 0, len = 3; i < len; i += 1) {
    const tmp = _lookupRef(ret, ww, macroSrc)

    if (tmp) {
      ret = tmp
    }
    else {
      break
    }
  }

  return ret
}
export function _lookupRef(key: string, ww: DataTypes, macroSrc: Map<string, string>): string {
  if (macroSrc.has(key)) {
    return (macroSrc.get(key) ?? '') as string
  }

  // key is not valid FFIParam such 'int/uint...', like HMODULE: 'HANDLE'
  if (typeof ww[key] === 'string') {
    // parse HANDLE: 'PVOID' , PVOID already parsed
    const ret = ww[key]

    if (ret && macroSrc.has(ret)) { //  HANDLE:PVOID, macroSrc has PVOID
      return macroSrc.get(ret) as string
    }
    return ret ?? ''
  }

  return ''
}


// valid parsed value exists in windefSet
export function isValidDataDef(key: string, srcSet: Set<string>): boolean {
  return !! srcSet.has(key)
}

export function validateWinData(windef: DataTypes, srcSet: Set<string>): void {
  for (const [k, v] of Object.entries(windef)) {
    if (! k || ! v) {
      throw new Error(`validateWinData() k or v empty: "${k}"/"${v}"`)
    }
    if (typeof v !== 'string') {
      throw new Error(`validateWinData() v not typeof string: "${k}"/"N/A"`)
    }

    if (! isValidDataDef(v, srcSet)) {
      throw new Error(`validateWinData() value is invalid ffi param value: "${k}"/"${v}", may extra space`)
    }
  }
}

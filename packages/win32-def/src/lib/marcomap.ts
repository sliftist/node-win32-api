import {
  _UNICODE_HOLDER,
  _WIN64_HOLDER,
} from './config.js'
import { MacroMap } from './ffi.model.js'
import {
  LPCSTR,
  LPCWSTR,
  LPSTR,
  LPWSTR,
  WCHAR,
} from './windef.js'


export const macroMap: MacroMap = new Map([
  ['HANDLE', [_WIN64_HOLDER, 'uint64', 'uint32'] ],
  ['PVOID', [_WIN64_HOLDER, 'uint64*', 'uint32*'] ],
  ['HALF_PTR', [_WIN64_HOLDER, 'int32', 'int16'] ],
  ['INT_PTR', [_WIN64_HOLDER, 'int64', 'int32'] ],
  ['LONG_PTR', [_WIN64_HOLDER, 'int64', 'int32'] ],
  ['LPCTSTR', [_UNICODE_HOLDER, LPCWSTR, LPCSTR] ],
  ['LPHANDLE', [_WIN64_HOLDER, 'uint64*', 'uint32*'] ],
  ['LPTSTR', [_UNICODE_HOLDER, LPWSTR, 'uint8*'] ],
  ['PCTSTR', [_WIN64_HOLDER, LPCWSTR, LPCSTR] ],
  ['PHANDLE', [_WIN64_HOLDER, 'uint64**', 'uint32**'] ],
  ['PHKEY', [_WIN64_HOLDER, 'uint64*', 'uint32*'] ],
  ['POINTER_32', [_WIN64_HOLDER, 'uint32*', 'uint32*'] ],
  ['POINTER_64', [_WIN64_HOLDER, 'uint64*', 'uint32*'] ],
  ['PTBYTE', [_UNICODE_HOLDER, 'int16*', 'int8*'] ],
  ['PTCHAR', [_UNICODE_HOLDER, 'uint16*', 'uint8*'] ],
  ['PTSTR', [_UNICODE_HOLDER, LPWSTR, LPSTR] ],
  ['TBYTE', [_UNICODE_HOLDER, 'int16', 'int8'] ],
  ['TCHAR', [_UNICODE_HOLDER, WCHAR, 'uint8'] ],
  ['UHALF_PTR', [_WIN64_HOLDER, 'uint32', 'uint16'] ],
  ['UINT_PTR', [_WIN64_HOLDER, 'uint64', 'uint32'] ],
  ['ULONG_PTR', [_WIN64_HOLDER, 'uint64', 'uint32'] ],
])

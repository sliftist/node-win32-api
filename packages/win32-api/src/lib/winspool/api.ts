/* eslint-disable id-length */
import * as M from 'win32-def'
import * as W from 'win32-def/common.def'


export interface Win32Fns {

  /**
   * @docs https://docs.microsoft.com/en-us/windows/win32/printdocs/getdefaultprinter
   */
  GetDefaultPrinterW: (
    pszBuffer: M.LPTSTR,
    pcchBuffer: M.LPDWORD,
  ) => M.BOOL

  /**
   * Retrieves information about a specified printer.
   * @docs https://docs.microsoft.com/en-us/windows/win32/printdocs/getprinter
   * @docs https://docs.microsoft.com/zh-cn/windows/win32/printdocs/getprinter
   */
  GetPrinterW: (
    hPrinter: M.HANDLE,
    Level: M.DWORD,
    pPrinter: M.LPBYTE,
    cbBuf: M.DWORD,
    pcbNeeded: M.LPDWORD,
  ) => M.BOOL


  /**
   * Retrieves a handle to the specified printer or print server or other types of handles in the print subsystem.
   * @docs https://docs.microsoft.com/en-us/windows/win32/printdocs/openprinter
   * @docs https://docs.microsoft.com/zh-cn/windows/win32/printdocs/openprinter
   */
  OpenPrinterW: (
    pPrinterName: M.LPTSTR,
    phPrinter: M.LPHANDLE,
    pDefault: M.LPPRINTER_DEFAULTS,
  ) => M.BOOL
}


export const apiDef: M.DllFuncs<Win32Fns> = {

  GetDefaultPrinterW: [W.BOOL, [W.LPTSTR, W.LPDWORD] ],

  GetPrinterW: [W.BOOL, [W.HANDLE, W.DWORD, W.LPBYTE, W.DWORD, W.LPDWORD] ],

  OpenPrinterW: [W.BOOL, [W.LPTSTR, W.LPHANDLE, W.LPRINTER_DEFAULTS] ],

}


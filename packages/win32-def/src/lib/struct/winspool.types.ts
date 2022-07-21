import {
  _POINTER,
  StructInstanceBase,
  ACCESS_MASK,
  DWORD,
  WCHAR_String,
} from '../common.types.js'

import { DEVMODEW } from './wingdi.types.js'


/**
 * Specifies the default data type, environment, initialization data, and access rights for a printer.
 * @link https://docs.microsoft.com/zh-cn/windows/win32/printdocs/printer-defaults
 */
export interface PRINTER_DEFAULTS extends StructInstanceBase {
  /**
   * Pointer to a null-terminated string that specifies the default data type for a printer.
   */
  pDatatype: WCHAR_String
  /**
   * Pointer to a DEVMODE structure that identifies the default environment and initialization data for a printer.
   */
  // pDevMode: LPDEVMODEW
  pDevMode: DEVMODEW
  DesiredAccess: ACCESS_MASK
}
/** A pointer to PRINTER_DEFAULTS */
export type PPRINTER_DEFAULTS = _POINTER
export type LPPRINTER_DEFAULTS = _POINTER


/**
 * Specifies general printer information
 * @docs https://docs.microsoft.com/en-us/windows/win32/printdocs/getprinter#parameters
 */
export interface PRINTER_INFO_X {
  1: PRINTER_INFO_1
  [key: number]: StructInstanceBase
}

/**
 * Specifies general printer information
 * @docs https://docs.microsoft.com/en-us/windows/win32/printdocs/printer-info-1
 */
export interface PRINTER_INFO_1 extends StructInstanceBase {
  Flags: DWORD
  pDescription: WCHAR_String
  pName: WCHAR_String
  pComment: WCHAR_String
  // pDescription: LPTSTR
  // pName: LPTSTR
  // pComment: LPTSTR
}
export type PPRINTER_INFO_1 = _POINTER


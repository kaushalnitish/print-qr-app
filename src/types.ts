export interface PrintFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string; // object URL or empty string
  pageCount: number;
}

export type ColorMode = 'bw' | 'color';
export type PaperSize = 'a4' | 'a3';
export type SideOption = 'single' | 'double';

export interface PrintSettings {
  copies: number;
  colorMode: ColorMode;
  paperSize: PaperSize;
  sideOption: SideOption;
}

export interface PrintSubmission {
  token: string;
  file: PrintFile;
  settings: PrintSettings;
  timestamp: string;
  estimatedCost: number;
  waitTimeMinutes: number;
}

import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Minus, 
  Plus, 
  Sparkles, 
  Layers, 
  File, 
  ChevronRight, 
  ArrowLeft 
} from 'lucide-react';
import { PrintFile, PrintSettings, ColorMode, PaperSize, SideOption } from '../types';

interface Screen2SettingsProps {
  file: PrintFile;
  settings: PrintSettings;
  onChangeSettings: (settings: PrintSettings) => void;
  onNext: () => void;
  onBack: () => void;
  key?: string;
}

export default function Screen2Settings({
  file,
  settings,
  onChangeSettings,
  onNext,
  onBack
}: Screen2SettingsProps) {

  const handleCopiesChange = (val: number) => {
    const newCopies = Math.max(1, Math.min(99, settings.copies + val));
    onChangeSettings({ ...settings, copies: newCopies });
  };

  const updateColorMode = (mode: ColorMode) => {
    onChangeSettings({ ...settings, colorMode: mode });
  };

  const updatePaperSize = (size: PaperSize) => {
    onChangeSettings({ ...settings, paperSize: size });
  };

  const updateSideOption = (side: SideOption) => {
    onChangeSettings({ ...settings, sideOption: side });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col flex-1 px-5 pt-4 pb-8 justify-between min-h-[580px]"
      id="screen-2-settings"
    >
      <div>
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-5">
          <button 
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors"
            id="settings-back-btn"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2]" />
          </button>
          <span className="text-sm font-semibold text-slate-500 font-sans">Step 2 of 3</span>
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>

        {/* Selected File Context */}
        <div className="bg-slate-50 rounded-2xl p-4 mb-6 flex items-center gap-3 border border-slate-100" id="file-context-badge">
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-slate-800 truncate font-sans">
              {file.name}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              {(file.size / 1024).toFixed(0)} KB • {file.pageCount} {file.pageCount === 1 ? 'page' : 'pages'}
            </p>
          </div>
        </div>

        {/* Setting Option 1: Copies (Large vertical or horizontal layout with min 56px height) */}
        <div className="mb-6">
          <label className="text-base font-semibold text-slate-800 block mb-2.5 font-sans">
            How many copies?
          </label>
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-2 shadow-sm" id="copies-selector-box">
            <button
              onClick={() => handleCopiesChange(-1)}
              disabled={settings.copies <= 1}
              className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                settings.copies <= 1 
                  ? 'text-slate-200 bg-slate-50 cursor-not-allowed' 
                  : 'text-slate-600 hover:bg-slate-100 bg-slate-50 active:bg-slate-200'
              }`}
              id="copies-decrement-btn"
            >
              <Minus className="w-6 h-6 stroke-[2.5]" />
            </button>
            
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-slate-900 font-mono" id="copies-display-value">
                {settings.copies}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold font-sans mt-0.5">
                {settings.copies === 1 ? 'copy' : 'copies'}
              </span>
            </div>

            <button
              onClick={() => handleCopiesChange(1)}
              className="w-14 h-14 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 bg-slate-50 active:bg-slate-200 cursor-pointer transition-colors"
              id="copies-increment-btn"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Setting Option 2: Color Mode (Large touch-friendly Cards) */}
        <div className="mb-6">
          <label className="text-base font-semibold text-slate-800 block mb-2.5 font-sans">
            Color Mode
          </label>
          <div className="grid grid-cols-2 gap-3" id="color-mode-grid">
            <button
              onClick={() => updateColorMode('bw')}
              className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between h-28 cursor-pointer transition-all ${
                settings.colorMode === 'bw'
                  ? 'border-blue-600 bg-blue-50/25 ring-4 ring-blue-600/5'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
              id="color-mode-bw-card"
            >
              <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-white text-[10px] font-bold font-mono">
                B&W
              </div>
              <div>
                <p className="text-[17px] font-bold text-slate-900 font-sans">Black & White</p>
                <p className="text-xs text-slate-500 mt-0.5 font-sans">Economic & quick</p>
              </div>
            </button>

            <button
              onClick={() => updateColorMode('color')}
              className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between h-28 cursor-pointer transition-all ${
                settings.colorMode === 'color'
                  ? 'border-blue-600 bg-blue-50/25 ring-4 ring-blue-600/5'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
              id="color-mode-color-card"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 via-amber-400 to-blue-500 border border-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <div>
                <p className="text-[17px] font-bold text-slate-900 font-sans">Full Color</p>
                <p className="text-xs text-slate-500 mt-0.5 font-sans">Vibrant high quality</p>
              </div>
            </button>
          </div>
        </div>

        {/* Setting Option 3: Paper Size */}
        <div className="mb-6">
          <label className="text-base font-semibold text-slate-800 block mb-2.5 font-sans">
            Paper Size
          </label>
          <div className="grid grid-cols-2 gap-3" id="paper-size-grid">
            <button
              onClick={() => updatePaperSize('a4')}
              className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between h-28 cursor-pointer transition-all ${
                settings.paperSize === 'a4'
                  ? 'border-blue-600 bg-blue-50/25 ring-4 ring-blue-600/5'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
              id="paper-size-a4-card"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 font-mono">
                A4
              </div>
              <div>
                <p className="text-[17px] font-bold text-slate-900 font-sans">Standard A4</p>
                <p className="text-xs text-slate-500 mt-0.5 font-sans">Standard print sheet</p>
              </div>
            </button>

            <button
              onClick={() => updatePaperSize('a3')}
              className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between h-28 cursor-pointer transition-all ${
                settings.paperSize === 'a3'
                  ? 'border-blue-600 bg-blue-50/25 ring-4 ring-blue-600/5'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
              id="paper-size-a3-card"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 font-mono">
                A3
              </div>
              <div>
                <p className="text-[17px] font-bold text-slate-900 font-sans">Large A3</p>
                <p className="text-xs text-slate-500 mt-0.5 font-sans">Double standard size</p>
              </div>
            </button>
          </div>
        </div>

        {/* Setting Option 4: Side Option */}
        <div className="mb-4">
          <label className="text-base font-semibold text-slate-800 block mb-2.5 font-sans">
            Sides Option
          </label>
          <div className="grid grid-cols-2 gap-3" id="side-option-grid">
            <button
              onClick={() => updateSideOption('single')}
              className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between h-28 cursor-pointer transition-all ${
                settings.sideOption === 'single'
                  ? 'border-blue-600 bg-blue-50/25 ring-4 ring-blue-600/5'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
              id="side-option-single-card"
            >
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <File className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-[17px] font-bold text-slate-900 font-sans">Single Sided</p>
                <p className="text-xs text-slate-500 mt-0.5 font-sans">Print on front only</p>
              </div>
            </button>

            <button
              onClick={() => updateSideOption('double')}
              className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between h-28 cursor-pointer transition-all ${
                settings.sideOption === 'double'
                  ? 'border-blue-600 bg-blue-50/25 ring-4 ring-blue-600/5'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
              id="side-option-double-card"
            >
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <Layers className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-[17px] font-bold text-slate-900 font-sans">Double Sided</p>
                <p className="text-xs text-slate-500 mt-0.5 font-sans">Print both sides</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Action Button (min 56px height) */}
      <div className="mt-8">
        <button
          onClick={onNext}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/15 cursor-pointer select-none transition-colors"
          id="settings-next-btn"
        >
          <span>Continue to Preview</span>
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </motion.div>
  );
}

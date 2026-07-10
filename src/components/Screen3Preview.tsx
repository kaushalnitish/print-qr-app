import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Check, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  Sparkles, 
  Coins 
} from 'lucide-react';
import { PrintFile, PrintSettings } from '../types';

interface Screen3PreviewProps {
  file: PrintFile;
  settings: PrintSettings;
  onPrintSubmit: (estimatedCost: number) => void;
  onBack: () => void;
  key?: string;
}

export default function Screen3Preview({
  file,
  settings,
  onPrintSubmit,
  onBack
}: Screen3PreviewProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Pricing constants (e.g. standard local print pricing)
  const PRICING = {
    bw: { a4: 0.15, a3: 0.30 },
    color: { a4: 0.50, a3: 1.00 }
  };

  const getPricePerPage = () => {
    return PRICING[settings.colorMode][settings.paperSize];
  };

  const pricePerPage = getPricePerPage();
  const rawCost = pricePerPage * file.pageCount * settings.copies;
  
  // Adjust cost slightly for double-sided if needed, or keep it standard. Let's keep it direct.
  const totalCost = rawCost;

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < file.pageCount) {
      setCurrentPage(c => c + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(c => c - 1);
    }
  };

  // Render a mock page look for documents, or display the image directly
  const renderPagePreview = () => {
    if (file.url) {
      return (
        <div className="relative w-full aspect-[3/4] max-h-[220px] bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 flex items-center justify-center">
          <img 
            src={file.url} 
            alt="Preview of uploaded document" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2 right-2 bg-black/60 text-white text-[11px] font-mono px-2 py-0.5 rounded-full">
            Image
          </div>
        </div>
      );
    }

    // Interactive elegant mock document view for PDF/DOCX
    return (
      <div className="relative w-full aspect-[3/4] max-h-[220px] bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 p-5 flex flex-col justify-between">
        {/* Mock content headers */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase font-mono">
              {file.type.toUpperCase()} Document
            </span>
            <span className="text-[9px] font-semibold text-slate-400 font-mono">
              Page {currentPage} of {file.pageCount}
            </span>
          </div>
          
          {/* Skeleton document lines */}
          <div className="h-3.5 bg-slate-900/10 rounded w-11/12" />
          <div className="h-3 bg-slate-900/5 rounded w-10/12" />
          <div className="h-3 bg-slate-900/5 rounded w-full" />
          <div className="h-3 bg-slate-900/5 rounded w-9/12" />
          <div className="h-3 bg-slate-900/5 rounded w-11/12 mt-4" />
          <div className="h-3 bg-slate-900/5 rounded w-8/12" />
        </div>

        {/* Floating document badge */}
        <div className="flex justify-center items-center py-2 bg-slate-50 border border-slate-100 rounded-lg">
          <FileText className="w-4 h-4 text-slate-400 mr-1.5" />
          <span className="text-[11px] font-semibold text-slate-500 font-sans truncate max-w-[150px]">
            {file.name}
          </span>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col flex-1 px-5 pt-4 pb-8 justify-between min-h-[580px]"
      id="screen-3-preview"
    >
      <div>
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors"
            id="preview-back-btn"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2]" />
          </button>
          <span className="text-sm font-semibold text-slate-500 font-sans">Step 3 of 3</span>
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>

        {/* Big Preview Area */}
        <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 flex flex-col items-center">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase font-sans mb-3">
            Document Preview
          </span>

          {renderPagePreview()}

          {/* Page swiping helper (only visible if multi-page file) */}
          {file.pageCount > 1 && (
            <div className="flex items-center justify-center gap-4 mt-3" id="page-carousel-controls">
              <button
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 1}
                className={`p-1.5 rounded-full border transition-all ${
                  currentPage === 1
                    ? 'text-slate-300 border-slate-100 cursor-not-allowed bg-slate-50'
                    : 'text-slate-600 border-slate-200 hover:bg-white bg-slate-100 cursor-pointer'
                }`}
                id="prev-page-btn"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
              <span className="text-xs font-semibold text-slate-500 font-mono">
                Page {currentPage} of {file.pageCount}
              </span>
              <button
                onClick={() => handlePageChange('next')}
                disabled={currentPage === file.pageCount}
                className={`p-1.5 rounded-full border transition-all ${
                  currentPage === file.pageCount
                    ? 'text-slate-300 border-slate-100 cursor-not-allowed bg-slate-50'
                    : 'text-slate-600 border-slate-200 hover:bg-white bg-slate-100 cursor-pointer'
                }`}
                id="next-page-btn"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>

        {/* Selected Settings Summary Cards */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-slate-800 mb-2.5 font-sans">
            Print Configuration
          </h3>
          <div className="grid grid-cols-2 gap-2" id="summary-options-grid">
            <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs">
              <span className="text-xs text-slate-400 font-sans font-medium">Color Mode</span>
              <span className="text-base font-bold text-slate-800 mt-1 flex items-center gap-1 font-sans">
                {settings.colorMode === 'bw' ? '⚫ Black & White' : '🌈 Full Color'}
              </span>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs">
              <span className="text-xs text-slate-400 font-sans font-medium">Sheet Size</span>
              <span className="text-base font-bold text-slate-800 mt-1 font-mono uppercase">
                {settings.paperSize}
              </span>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs">
              <span className="text-xs text-slate-400 font-sans font-medium">Copies</span>
              <span className="text-base font-bold text-slate-800 mt-1 font-sans">
                {settings.copies} {settings.copies === 1 ? 'Copy' : 'Copies'}
              </span>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs">
              <span className="text-xs text-slate-400 font-sans font-medium">Sides</span>
              <span className="text-base font-bold text-slate-800 mt-1 font-sans">
                {settings.sideOption === 'single' ? 'Single Sided' : 'Double Sided'}
              </span>
            </div>
          </div>
        </div>

        {/* Estimated Pricing Block */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-50/40 rounded-2xl p-4 border border-blue-100 mb-6" id="pricing-summary-card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-blue-700">
              <Coins className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold font-sans">Estimated Total Price</span>
            </div>
            <span className="text-xs text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-md font-sans font-medium">
              Pay at counter
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-blue-900 font-mono" id="summary-total-price">
              ${totalCost.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 font-sans">
              {file.pageCount} {file.pageCount === 1 ? 'pg' : 'pgs'} × ${pricePerPage.toFixed(2)} × {settings.copies} {settings.copies === 1 ? 'copy' : 'copies'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div>
        <button
          onClick={() => onPrintSubmit(totalCost)}
          className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15 cursor-pointer select-none transition-colors"
          id="preview-submit-btn"
        >
          <Printer className="w-5 h-5 stroke-[2.2]" />
          <span>Print Now</span>
        </button>
      </div>
    </motion.div>
  );
}

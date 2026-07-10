import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, FileText, AlertTriangle, Printer, Sparkles } from 'lucide-react';
import { PrintFile } from '../types';

interface Screen1HomeProps {
  onFileUploaded: (file: PrintFile) => void;
  key?: string;
}

export default function Screen1Home({ onFileUploaded }: Screen1HomeProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedExtensions = ['pdf', 'docx', 'jpg', 'jpeg', 'png'];

  const validateAndProcessFile = (file: File) => {
    setError(null);
    const name = file.name;
    const extension = name.split('.').pop()?.toLowerCase() || '';

    // Human-friendly validation
    if (!allowedExtensions.includes(extension)) {
      if (['zip', 'rar', '7z'].includes(extension)) {
        setError("Oops! We can't print zipped archive folders. Please extract your files and upload the document or image directly.");
      } else if (['exe', 'apk', 'bat', 'sh'].includes(extension)) {
        setError("Oops! For safety reasons, we can't accept application files (EXE, APK). Please upload a document or image.");
      } else if (['js', 'html', 'css', 'ts', 'json'].includes(extension)) {
        setError("Oops! We cannot print raw code files directly. Please convert your file to a PDF or document and try again.");
      } else {
        setError(`We can't print this file type (.${extension}). Please upload a PDF, Word document (DOCX), or image (JPG, PNG).`);
      }
      return;
    }

    // Size check (max 50MB for general printing sanity)
    if (file.size > 50 * 1024 * 1024) {
      setError("This file is a bit too large (over 50MB). Please try a smaller, optimized file for faster printing.");
      return;
    }

    // Simulate smooth upload progress
    setUploading(true);
    setFileName(file.name);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simulate reading document page count
        // Default random page count based on extension
        let pageCount = 1;
        if (extension === 'pdf') {
          pageCount = Math.floor(Math.random() * 8) + 1; // 1 to 8 pages
        } else if (extension === 'docx') {
          pageCount = Math.floor(Math.random() * 4) + 1; // 1 to 4 pages
        }

        setTimeout(() => {
          onFileUploaded({
            id: 'file-' + Date.now(),
            name: file.name,
            size: file.size,
            type: extension,
            url: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
            pageCount: pageCount
          });
          setUploading(false);
        }, 300);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 120);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col flex-1 px-5 pt-6 pb-8 justify-between min-h-[580px]"
      id="screen-1-home"
    >
      {/* Upper Section */}
      <div className="flex flex-col items-center text-center">
        {/* Apple-style minimalist brand icon */}
        <div className="relative mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/15">
            <Printer className="w-8 h-8 text-white stroke-[2.2]" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-1.5 shadow-md flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 fill-white text-amber-500" />
          </div>
        </div>

        {/* Shop Branding */}
        <div className="mb-2">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full font-sans">
            CAMPUS COPY HUBS
          </span>
        </div>
        <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-tight font-display">
          Print Your Documents
        </h1>
        <p className="mt-2 text-slate-500 text-[18px] max-w-xs leading-relaxed font-sans font-light">
          No sign-ups, no logins. Upload your file, customize settings, and print in 30 seconds.
        </p>
      </div>

      {/* Upload Box/CTA Section */}
      <div className="my-8 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!uploading ? (
            <motion.div
              key="upload-zone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer select-none min-h-[260px] ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' 
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white shadow-sm'
              }`}
              id="file-drop-zone"
            >
              <input 
                ref={fileInputRef}
                type="file" 
                id="file-upload-input"
                className="hidden" 
                onChange={handleFileChange}
                accept=".pdf,.docx,.jpg,.jpeg,.png"
              />
              
              <div className="p-4 bg-slate-50 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-10 h-10 text-slate-400 stroke-[1.8]" />
              </div>
              
              <h3 className="text-xl font-semibold text-slate-800 font-display">
                Tap to select file
              </h3>
              <p className="text-sm text-slate-400 mt-1 font-sans">
                or drag and drop here
              </p>

              <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-xs">
                {allowedExtensions.map((ext) => (
                  <span key={ext} className="text-xs bg-slate-100 font-medium text-slate-600 px-2.5 py-1 rounded-md uppercase tracking-wider font-mono">
                    {ext}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="uploading-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="border border-slate-100 rounded-3xl p-8 bg-white shadow-sm flex flex-col items-center justify-center text-center min-h-[260px]"
              id="upload-progress-container"
            >
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <FileText className="w-7 h-7" />
              </div>
              <p className="text-lg font-semibold text-slate-800 line-clamp-1 max-w-[250px]">
                {fileName}
              </p>
              <p className="text-sm text-slate-400 mt-1 font-sans">
                Reading your document...
              </p>
              
              {/* Progress bar container */}
              <div className="w-full max-w-[240px] bg-slate-100 h-2.5 rounded-full overflow-hidden mt-6">
                <motion.div 
                  className="bg-blue-600 h-full rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>
              <span className="text-sm font-semibold text-blue-600 mt-2 font-mono">
                {uploadProgress}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 text-left items-start"
              id="upload-error-alert"
            >
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-rose-800 font-sans">
                  Unable to upload
                </p>
                <p className="text-sm text-rose-600 mt-0.5 font-sans leading-relaxed">
                  {error}
                </p>
                <button 
                  onClick={() => setError(null)}
                  className="text-xs font-semibold text-rose-700 underline mt-2 hover:text-rose-900 cursor-pointer"
                  id="dismiss-error-btn"
                >
                  Dismiss error
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Safety / Quick Info Footer */}
      <div className="flex items-center justify-center gap-2 text-slate-400 text-xs text-center border-t border-slate-100 pt-4 font-sans">
        <span>🔒 Secure instant printing</span>
        <span className="text-slate-300">•</span>
        <span>No app required</span>
      </div>
    </motion.div>
  );
}

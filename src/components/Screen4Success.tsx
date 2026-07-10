import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  FileCheck, 
  Plus, 
  Sparkles 
} from 'lucide-react';
import { PrintFile, PrintSettings } from '../types';

interface Screen4SuccessProps {
  file: PrintFile;
  settings: PrintSettings;
  token: string;
  estimatedCost: number;
  waitTimeMinutes: number;
  onReset: () => void;
  key?: string;
}

export default function Screen4Success({
  file,
  settings,
  token,
  estimatedCost,
  waitTimeMinutes,
  onReset
}: Screen4SuccessProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Simple live simulated status updates to amaze the user!
  useEffect(() => {
    // Stage 0: Submitted
    // Stage 1: Received & In Queue
    // Stage 2: Printing
    // Stage 3: Ready for pickup
    const timer1 = setTimeout(() => {
      setCurrentStep(1); // Received & In Queue
    }, 4000);

    const timer2 = setTimeout(() => {
      setCurrentStep(2); // Printing
    }, 15000);

    const timer3 = setTimeout(() => {
      setCurrentStep(3); // Ready
    }, 28000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const steps = [
    { label: "Submitted", desc: "Sent to copy machine", status: "done" },
    { label: "In Queue", desc: "Position #2 in printer", status: "pending" },
    { label: "Printing", desc: "Transferring onto paper", status: "pending" },
    { label: "Ready", desc: "Pick up at counter", status: "pending" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col flex-1 px-5 pt-6 pb-8 justify-between min-h-[580px]"
      id="screen-4-success"
    >
      <div className="flex flex-col items-center text-center">
        {/* Success Icon Badge */}
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-9 h-9 stroke-[2.2] animate-bounce" />
        </div>

        <h1 className="text-[26px] font-bold text-slate-900 tracking-tight leading-tight font-display">
          Print Request Sent!
        </h1>
        <p className="mt-1 text-slate-500 text-[16px] max-w-xs font-sans leading-relaxed">
          Your file has been transferred to the shop counter printer.
        </p>

        {/* Big Ticket Token Number Card */}
        <div className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 mt-6 relative overflow-hidden" id="token-card">
          {/* Subtle design styling circles to mimic paper ticket cuts */}
          <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white border-r border-slate-100 rounded-full -translate-y-1/2" />
          <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white border-l border-slate-100 rounded-full -translate-y-1/2" />
          
          <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase font-sans">
            YOUR TICKET TOKEN
          </span>
          <p className="text-5xl font-extrabold text-blue-600 mt-2 font-mono tracking-tight" id="token-display-id">
            {token}
          </p>
          
          {/* Divider line */}
          <div className="border-t border-dashed border-slate-200 my-4" />

          {/* Quick info grid */}
          <div className="grid grid-cols-2 gap-2 text-left" id="token-meta-info">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase font-sans">Wait Time</span>
              <p className="text-sm font-bold text-slate-700 flex items-center gap-1 font-sans mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                ~{waitTimeMinutes} {waitTimeMinutes === 1 ? 'min' : 'mins'}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase font-sans">Total Amount</span>
              <p className="text-sm font-bold text-slate-700 font-mono mt-0.5">
                ${estimatedCost.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Simple live status updates/tracker (Very Premium Detail) */}
        <div className="w-full mt-6 text-left" id="live-status-tracker">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3 font-sans">
            Live Printer Status
          </span>

          <div className="space-y-3.5 bg-white border border-slate-100 rounded-2xl p-4 shadow-xs">
            {steps.map((step, idx) => {
              const isDone = idx < currentStep;
              const isActive = idx === currentStep;
              const isFuture = idx > currentStep;

              return (
                <div key={idx} className="flex items-center justify-between" id={`status-step-${idx}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isDone 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : isActive 
                        ? 'bg-blue-100 text-blue-600 animate-pulse' 
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {isDone ? (
                        <FileCheck className="w-3.5 h-3.5" />
                      ) : isActive ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-bold font-sans ${isActive ? 'text-blue-600' : isDone ? 'text-slate-700' : 'text-slate-400'}`}>
                        {step.label}
                      </p>
                      <p className="text-[11px] text-slate-400 font-sans">{step.desc}</p>
                    </div>
                  </div>
                  
                  {isDone && (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-sans">
                      Done
                    </span>
                  )}
                  {isActive && (
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-sans animate-pulse">
                      Active
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* primary Done / Print Another File button */}
      <div className="mt-8 flex flex-col gap-3">
        <button
          onClick={onReset}
          className="w-full h-14 bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer select-none transition-colors"
          id="success-done-btn"
        >
          <Plus className="w-5 h-5 stroke-[2.2]" />
          <span>Print Another File</span>
        </button>
        <p className="text-center text-xs text-slate-400 font-sans">
          You can close this window at any time. Take a screenshot of the ticket token for your records.
        </p>
      </div>
    </motion.div>
  );
}

import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { PrintFile, PrintSettings } from './types';
import Screen1Home from './components/Screen1Home';
import Screen2Settings from './components/Screen2Settings';
import Screen3Preview from './components/Screen3Preview';
import Screen4Success from './components/Screen4Success';

export default function App() {
  const [step, setStep] = useState<number>(1);
  const [file, setFile] = useState<PrintFile | null>(null);
  const [settings, setSettings] = useState<PrintSettings>({
    copies: 1,
    colorMode: 'bw',
    paperSize: 'a4',
    sideOption: 'single'
  });
  const [token, setToken] = useState<string>('');
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [waitTimeMinutes, setWaitTimeMinutes] = useState<number>(2);

  const handleFileUploaded = (uploadedFile: PrintFile) => {
    setFile(uploadedFile);
    setStep(2); // Auto proceed to step 2 after file upload completes
  };

  const handleSettingsChange = (newSettings: PrintSettings) => {
    setSettings(newSettings);
  };

  const handlePrintSubmit = (cost: number) => {
    // Generate a random customer print token code
    const randomNum = Math.floor(Math.random() * 900) + 100; // 100 to 999
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
    const generatedToken = `#P-${randomLetter}${randomNum}`;

    // Simulate wait time based on copies and page count
    const baseWait = 2; // mins
    const additionalWait = Math.ceil((settings.copies * (file?.pageCount || 1)) / 10);
    const generatedWaitTime = Math.min(15, baseWait + additionalWait);

    setToken(generatedToken);
    setEstimatedCost(cost);
    setWaitTimeMinutes(generatedWaitTime);
    setStep(4); // Proceed to success screen
  };

  const handleReset = () => {
    // Cleanup preview URLs to avoid memory leaks
    if (file?.url) {
      URL.revokeObjectURL(file.url);
    }
    setFile(null);
    setSettings({
      copies: 1,
      colorMode: 'bw',
      paperSize: 'a4',
      sideOption: 'single'
    });
    setToken('');
    setEstimatedCost(0);
    setWaitTimeMinutes(2);
    setStep(1); // Go back to start
  };

  return (
    <div className="min-h-screen bg-slate-100 md:py-10 flex flex-col items-center justify-center font-sans antialiased" id="pwa-root-container">
      {/* 
        This is the responsive phone preview wrapper. 
        On desktop, it mimics a premium mobile app frame with soft shadows and rounded corners.
        On mobile, it expands smoothly to fill the screen for a true PWA experience.
      */}
      <div className="w-full max-w-md min-h-screen md:min-h-[760px] md:max-h-[850px] bg-white md:rounded-[40px] md:shadow-2xl border border-slate-200/60 overflow-hidden flex flex-col justify-between relative" id="mobile-pwa-viewport">
        
        {/* Dynamic Screen Container */}
        <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col" id="workflow-container">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <Screen1Home 
                key="screen1"
                onFileUploaded={handleFileUploaded} 
              />
            )}
            
            {step === 2 && file && (
              <Screen2Settings 
                key="screen2"
                file={file}
                settings={settings}
                onChangeSettings={handleSettingsChange}
                onNext={() => setStep(3)}
                onBack={handleReset}
              />
            )}

            {step === 3 && file && (
              <Screen3Preview 
                key="screen3"
                file={file}
                settings={settings}
                onPrintSubmit={handlePrintSubmit}
                onBack={() => setStep(2)}
              />
            )}

            {step === 4 && file && (
              <Screen4Success 
                key="screen4"
                file={file}
                settings={settings}
                token={token}
                estimatedCost={estimatedCost}
                waitTimeMinutes={waitTimeMinutes}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Subtle home indicator styling on desktop for premium visual flair */}
        <div className="hidden md:block w-32 h-1.5 bg-slate-200 rounded-full mx-auto my-4 shrink-0" id="home-indicator" />
      </div>
    </div>
  );
}

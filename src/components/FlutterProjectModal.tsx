import React, { useState } from 'react';
import {
  FLUTTER_PROJECT_FILES,
  FlutterFile,
  generateFlutterProjectZip,
} from '../services/flutterProjectFiles';
import {
  X,
  FileCode,
  Download,
  Copy,
  Check,
  FolderTree,
  Terminal,
  FileText,
  Smartphone,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

interface FlutterProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterProjectModal: React.FC<FlutterProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(FLUTTER_PROJECT_FILES[1]); // lib/main.dart
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'guide'>('code');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const blob = await generateFlutterProjectZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'skycast_flutter_project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate zip', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-5xl h-[90vh] bg-slate-900 border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Smartphone size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  SkyCast Flutter & Dart Project Repository
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  KHIT Submission Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Models · Services · Providers · Screens · Widgets · Tests · APK Guide
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all"
            >
              <Download size={15} className={isZipping ? 'animate-bounce' : ''} />
              {isZipping ? 'Generating ZIP...' : 'Download Project (.zip)'}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="px-6 py-2 bg-slate-950/60 border-b border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'code'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode size={14} />
              Source Code Explorer ({FLUTTER_PROJECT_FILES.length} files)
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'guide'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal size={14} />
              Android Studio & APK Build Guide
            </button>
          </div>

          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Provider 6.1 · Material 3 · Dart 3
          </span>
        </div>

        {/* Modal Main Content */}
        {activeTab === 'code' ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar File Tree */}
            <div className="w-full md:w-72 bg-slate-950/40 border-r border-white/10 p-3 overflow-y-auto space-y-1 shrink-0">
              <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FolderTree size={14} className="text-sky-400" />
                Project Files
              </div>

              {FLUTTER_PROJECT_FILES.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 font-semibold'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode size={14} className={isSelected ? 'text-sky-400' : 'text-slate-500'} />
                      <span className="truncate">{file.path}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Code Viewer Panel */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
              {/* File details bar */}
              <div className="px-4 py-2.5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-sky-300">
                    {selectedFile.path}
                  </span>
                  <p className="text-[11px] text-slate-400">
                    {selectedFile.description}
                  </p>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-medium transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Pre container */}
              <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-200 leading-relaxed bg-[#0B0F19]">
                <pre className="selection:bg-sky-500/30">
                  <code>{selectedFile.content}</code>
                </pre>
              </div>
            </div>
          </div>
        ) : (
          /* APK & Testing Guide Tab */
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Intro Banner */}
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-start gap-3">
                <Sparkles size={24} className="text-sky-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-200 space-y-1">
                  <h4 className="font-bold text-sky-300 text-sm">
                    KHIT Flutter Group Project Submission Guidelines
                  </h4>
                  <p>
                    Follow these step-by-step instructions to import SkyCast into Android Studio or VS Code, verify with widget tests, run on an Android emulator or physical device, and compile the final release APK.
                  </p>
                </div>
              </div>

              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  Extract or Initialize the Project
                </h4>
                <p className="text-xs text-slate-400">
                  Click the <strong>&quot;Download Project (.zip)&quot;</strong> button above, unzip the contents into your Flutter workspace directory:
                </p>
                <div className="bg-black/60 p-3 rounded-xl font-mono text-xs text-sky-300 overflow-x-auto">
                  cd skycast<br />
                  flutter pub get
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  Execute Widget & Unit Tests
                </h4>
                <p className="text-xs text-slate-400">
                  Ensure all tests pass prior to submitting your repository:
                </p>
                <div className="bg-black/60 p-3 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto">
                  flutter test
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-bold">
                    3
                  </span>
                  Launch Application on Device / Emulator
                </h4>
                <p className="text-xs text-slate-400">
                  Connect your physical Android phone (enable USB Debugging) or boot an Android Virtual Device (AVD):
                </p>
                <div className="bg-black/60 p-3 rounded-xl font-mono text-xs text-sky-300 overflow-x-auto">
                  flutter run
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-bold">
                    4
                  </span>
                  Compile Android Release APK
                </h4>
                <p className="text-xs text-slate-400">
                  Generate the standalone APK file required for group project evaluation:
                </p>
                <div className="bg-black/60 p-3 rounded-xl font-mono text-xs text-amber-300 overflow-x-auto">
                  flutter build apk --release
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  The generated APK will be stored at: <code className="text-white">build/app/outputs/flutter-apk/app-release.apk</code>
                </p>
              </div>

              {/* Defect Log Template Reminder */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <FileText size={18} className="text-purple-400" />
                  Documentation & 5-Minute Live Demo Checklist
                </h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-5">
                  <li><strong>Screen 1:</strong> Demo city search (e.g., Guntur, London) and dynamic weather display.</li>
                  <li><strong>Screen 2:</strong> Walk through the 7-day forecast and min/max temperature visual range bars.</li>
                  <li><strong>Screen 3:</strong> Demonstrate adding a favourite city and deleting via swipe.</li>
                  <li><strong>Screen 4:</strong> Show Celsius/Fahrenheit and wind unit switches updating immediately across all screens.</li>
                  <li><strong>Defect Log:</strong> Included in the exported README.md file ready for project documentation.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Check,
  AlertCircle,
  Play,
  RotateCcw,
  AudioWaveform as WaveformIcon,
  Headphones,
  Zap,
} from 'lucide-react';
import {
  SpeechToTextService,
  SPEECH_SIMULATION_SCENARIOS,
  SpeechSimulationScenario,
} from '../../services/speechToTextService';

export interface VoiceSymptomRecorderProps {
  onSymptomsExtracted: (newSymptoms: string[], fullTranscript: string) => void;
  className?: string;
  buttonLabel?: string;
  compact?: boolean;
  variant?: 'default' | 'hero' | 'compact';
  title?: string;
  subtitle?: string;
  showAllScenarios?: boolean;
}

export const VoiceSymptomRecorder: React.FC<VoiceSymptomRecorderProps> = ({
  onSymptomsExtracted,
  className = '',
  buttonLabel = 'จับเสียงบอกอาการ (Speech-to-Text)',
  compact = false,
  variant = 'default',
  title,
  subtitle,
  showAllScenarios = false,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [detectedSymptoms, setDetectedSymptoms] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [showSimulations, setShowSimulations] = useState<boolean>(
    variant === 'hero' || showAllScenarios
  );
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedScenarioId, setSimulatedScenarioId] = useState<string | null>(null);

  const sessionRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    setIsSupported(SpeechToTextService.isSupported());
  }, []);

  // Whenever transcript updates, auto-extract symptom keywords
  useEffect(() => {
    if (transcript) {
      const extracted = SpeechToTextService.extractSymptoms(transcript);
      setDetectedSymptoms(extracted);
    }
  }, [transcript]);

  const startListening = () => {
    setErrorMessage(null);
    setTranscript('');
    setDetectedSymptoms([]);
    setSimulatedScenarioId(null);

    if (!SpeechToTextService.isSupported()) {
      setErrorMessage('เบราว์เซอร์ไม่รองรับ Web Speech API แนะนำให้คลิกเลือก "จำลองเสียงคนไข้" ด้านล่างเพื่อทดสอบได้ทันที');
      setShowSimulations(true);
      return;
    }

    const session = SpeechToTextService.createRecognitionSession(
      (text: string) => {
        setTranscript(text);
      },
      (err: string) => {
        setErrorMessage(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (session) {
      sessionRef.current = session;
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (sessionRef.current) {
      sessionRef.current.stop();
      sessionRef.current = null;
    }
    setIsListening(false);
  };

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleApplySymptoms = () => {
    if (detectedSymptoms.length > 0 || transcript) {
      onSymptomsExtracted(detectedSymptoms, transcript);
      setTranscript('');
      setDetectedSymptoms([]);
      setSimulatedScenarioId(null);
      if (isListening) stopListening();
    }
  };

  // Simulated Voice Dictation (For environments with no microphone or demo pitching)
  const handleSimulateScenario = (scenario: SpeechSimulationScenario) => {
    if (isListening) stopListening();
    setIsSimulating(true);
    setSimulatedScenarioId(scenario.id);
    setErrorMessage(null);
    setTranscript('');
    setDetectedSymptoms([]);

    // Typewriter effect simulation to demonstrate speech-to-text in real-time
    const fullText = scenario.fullSpeech;
    let currentIdx = 0;

    const interval = setInterval(() => {
      currentIdx += 2;
      const partial = fullText.slice(0, currentIdx);
      setTranscript(partial);

      if (currentIdx >= fullText.length) {
        clearInterval(interval);
        setIsSimulating(false);
        setTranscript(fullText);
        setDetectedSymptoms(scenario.expectedSymptoms);
      }
    }, 40);
  };

  // HERO VARIANT (High Visibility & Prominence)
  if (variant === 'hero') {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-indigo-950 text-white p-4 sm:p-5 border-2 border-teal-500/50 shadow-xl space-y-4 ${className}`}
      >
        {/* Ambient background glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Header */}
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-teal-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/30 shrink-0">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-sm sm:text-base text-white tracking-tight flex items-center gap-1.5">
                  {title || 'AI Speech-to-Text: ระบบดักจับเสียงคนไข้บอกอาการ'}
                </h3>
                <span className="text-[10px] bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  THAI VOICE NLP
                </span>
              </div>
              <p className="text-[11px] text-teal-200/90 mt-0.5">
                {subtitle ||
                  'บันทึกเสียงผู้ป่วยภาษาไทย (th-TH) แบบเรียลไทม์ พร้อมสกัดคำสำคัญเพื่อวิเคราะห์สมุฏฐาน 4 ธาตุ'}
              </p>
            </div>
          </div>

          {/* Right Status Badge */}
          <div className="flex items-center gap-2 shrink-0">
            {isListening || isSimulating ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-400 text-rose-300 text-[11px] font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
                <span>{isSimulating ? 'กำลังจำลองเสียงพูด...' : 'กำลังรับฟังเสียงสด (LIVE)...'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-[11px]">
                <Zap className="w-3 h-3 text-amber-300" />
                <span>พร้อมรับเสียงภาษาไทย</span>
              </div>
            )}
          </div>
        </div>

        {/* Center Microphone & Waveform Action Row */}
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleToggleListening}
              disabled={isSimulating}
              className={`relative px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer w-full sm:w-auto ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/50 ring-4 ring-rose-500/30'
                  : 'bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 hover:brightness-110 text-slate-950 shadow-teal-500/30'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 animate-spin" />
                  <span>หยุดการฟังเสียง (Stop)</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>🎙️ กดปุ่มเพื่อเริ่มพูดบอกอาการ</span>
                </>
              )}
            </button>

            {/* Audio Wave Sound Bars when Listening or Simulating */}
            {(isListening || isSimulating) && (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-black/40 rounded-lg border border-teal-400/40 text-teal-300 text-xs font-mono shrink-0">
                <span className="w-1 h-3 bg-teal-400 rounded-full animate-pulse"></span>
                <span className="w-1 h-5 bg-teal-300 rounded-full animate-bounce"></span>
                <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="w-1 h-6 bg-teal-200 rounded-full animate-bounce"></span>
                <span className="w-1 h-4 bg-teal-400 rounded-full animate-pulse"></span>
                <span className="w-1 h-5 bg-emerald-300 rounded-full animate-bounce"></span>
                <span className="ml-1.5 font-sans font-semibold text-[11px] text-teal-200 hidden md:inline">
                  Waveform Active
                </span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-amber-300" />
            <span>หรือคลิกตัวอย่างเสียงคนไข้จำลองด้านล่างเพื่อทดสอบทันที</span>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="text-xs bg-amber-950/80 text-amber-200 border border-amber-500/50 rounded-xl p-2.5 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Live Speech Transcript Box */}
        {(transcript || isListening || isSimulating) && (
          <div className="relative bg-black/60 rounded-xl p-3.5 border border-teal-500/40 text-xs space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-[11px] text-teal-300/80 border-b border-white/10 pb-1.5">
              <span className="font-bold text-teal-300 flex items-center gap-1.5">
                <WaveformIcon className="w-3.5 h-3.5 text-teal-400" />
                <span>ข้อความเสียงที่ระบบตรวจจับได้ (Transcribed Text):</span>
              </span>
              <span className="font-mono text-amber-300 text-[10px]">
                {transcript.length} ตัวอักษร
              </span>
            </div>

            <p className="text-slate-100 font-medium italic text-xs sm:text-sm leading-relaxed tracking-wide bg-white/5 p-2.5 rounded-lg border border-white/5">
              "{transcript || 'กำลังรอรับเสียงพูดจากผู้ป่วย...'}"
            </p>

            {/* Extracted Symptoms Preview */}
            {detectedSymptoms.length > 0 && (
              <div className="pt-1.5 border-t border-white/10 space-y-1.5">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>สกัดพบคำบ่งชี้อาการทางคลินิก ({detectedSymptoms.length} อาการ):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {detectedSymptoms.map((sym, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gradient-to-r from-teal-500/30 to-emerald-500/30 border border-teal-400 text-teal-100 font-bold px-2.5 py-0.5 rounded-lg shadow-sm flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-teal-300" />
                      <span>{sym}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setTranscript('');
                  setDetectedSymptoms([]);
                  setSimulatedScenarioId(null);
                }}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded transition cursor-pointer"
              >
                ล้างข้อความ
              </button>
              <button
                type="button"
                onClick={handleApplySymptoms}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 text-xs font-black px-4 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>นำอาการเข้าสู่การประเมินทันที ({detectedSymptoms.length} อาการ)</span>
              </button>
            </div>
          </div>
        )}

        {/* Demo Simulation Scenarios Pills (Always visible in Hero mode for instant testing) */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold flex items-center gap-1.5 text-teal-200">
              <Volume2 className="w-3.5 h-3.5 text-teal-400" />
              <span>คลิกทดสอบจำลองเสียงคนไข้ทันที (Demo Voice Scenarios):</span>
            </span>
            <span className="text-[10px] text-slate-400">ไม่ต้องใช้ไมค์ก็ทดสอบได้</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {SPEECH_SIMULATION_SCENARIOS.slice(0, 3).map((sc) => {
              const isCurrent = simulatedScenarioId === sc.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  disabled={isSimulating}
                  onClick={() => handleSimulateScenario(sc)}
                  className={`text-left p-2.5 rounded-xl border transition-all text-xs cursor-pointer ${
                    isCurrent
                      ? 'bg-teal-500/20 border-teal-400 text-white ring-1 ring-teal-400 shadow-sm'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-teal-400/60 text-slate-200'
                  }`}
                >
                  <div className="font-bold text-[11px] text-teal-300 flex items-center gap-1 truncate">
                    <Play className="w-3 h-3 text-amber-400 shrink-0 fill-amber-400" />
                    <span>{sc.title}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-1 italic">
                    "{sc.fullSpeech.slice(0, 42)}..."
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT / STANDARD COMPONENT VARIANT
  return (
    <div
      className={`rounded-2xl border transition-all ${className} ${
        isListening || isSimulating
          ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-200 shadow-sm'
          : 'bg-teal-50/60 border-teal-200/90 shadow-2xs'
      }`}
    >
      <div className="p-3 sm:p-3.5 space-y-2.5">
        {/* Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleListening}
              disabled={isSimulating}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse ring-2 ring-rose-300'
                  : 'bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5 animate-spin" />
                  <span>กำลังฟังเสียงคนไข้... (คลิกหยุด)</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span>{buttonLabel}</span>
                </>
              )}
            </button>

            {/* Audio Wave Sound Bars when Listening */}
            {(isListening || isSimulating) && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-white/90 rounded-lg border border-rose-200 text-rose-700 text-[10px] font-mono shadow-2xs">
                <span className="w-1.5 h-3 bg-rose-500 rounded-full animate-pulse"></span>
                <span className="w-1.5 h-4 bg-rose-600 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-2 bg-rose-400 rounded-full animate-pulse"></span>
                <span className="w-1.5 h-4 bg-rose-600 rounded-full animate-bounce"></span>
                <span className="ml-1 font-sans font-semibold">
                  {isSimulating ? 'กำลังจำลองเสียง...' : 'กำลังประมวลผลเสียงภาษาไทย (th-TH)'}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowSimulations(!showSimulations)}
              className="text-[11px] bg-white hover:bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1 cursor-pointer font-medium shadow-2xs"
            >
              <Volume2 className="w-3.5 h-3.5 text-teal-700" />
              <span>{showSimulations ? 'ซ่อนบทจำลองเสียง' : '🔊 ทดสอบจำลองเสียง (Demo)'}</span>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200 rounded-xl p-2 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Live Speech Transcript Box */}
        {(transcript || isListening || isSimulating) && (
          <div className="bg-white rounded-xl p-3 border border-slate-200 text-xs space-y-2 animate-in fade-in shadow-xs">
            <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-100 pb-1">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Mic className="w-3 h-3 text-teal-600" />
                ข้อความเสียงที่ตรวจจับได้ (Transcribed Voice):
              </span>
              <span className="font-mono text-teal-800">
                {transcript.length} ตัวอักษร
              </span>
            </div>

            <p className="text-slate-800 font-medium italic leading-relaxed text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
              "{transcript || 'กำลังรอรับเสียงพูด...'}"
            </p>

            {/* Extracted Symptoms Preview */}
            {detectedSymptoms.length > 0 && (
              <div className="pt-1 border-t border-slate-100 space-y-1">
                <div className="text-[10px] font-bold text-teal-900 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-600" />
                  <span>สกัดพบคำสำคัญของอาการ ({detectedSymptoms.length} อาการ):</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {detectedSymptoms.map((sym, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-teal-50 border border-teal-300 text-teal-950 font-bold px-2 py-0.5 rounded-md"
                    >
                      ✓ {sym}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Button */}
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setTranscript('');
                  setDetectedSymptoms([]);
                  setSimulatedScenarioId(null);
                }}
                className="text-[10px] text-slate-500 hover:text-slate-800 px-2 py-1 rounded"
              >
                ล้างข้อความ
              </button>
              <button
                type="button"
                onClick={handleApplySymptoms}
                className="bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold px-3 py-1 rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>นำเข้าอาการที่จับเสียงได้ ({detectedSymptoms.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* Demo Simulation Scenarios Accordion */}
        {showSimulations && (
          <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-200 space-y-2 text-xs">
            <div className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
              <Play className="w-3 h-3 text-brand-700" />
              <span>คลิกเพื่อจำลองเสียงคนไข้พูดบอกอาการ (สำหรับนำเสนอหรือกรณีไม่มีไมโครโฟน):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {SPEECH_SIMULATION_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  disabled={isSimulating}
                  onClick={() => handleSimulateScenario(sc)}
                  className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-[11px] transition cursor-pointer shadow-2xs"
                >
                  <div className="font-semibold text-slate-900 text-[10px] truncate flex items-center gap-1">
                    <span className="text-teal-700">▶</span>
                    <span>{sc.title}</span>
                  </div>
                  <div className="text-[9px] text-slate-500 truncate mt-0.5">
                    "{sc.fullSpeech.slice(0, 45)}..."
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

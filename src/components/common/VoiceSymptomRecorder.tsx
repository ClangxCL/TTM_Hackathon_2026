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
} from 'lucide-react';
import {
  SpeechToTextService,
  SPEECH_SIMULATION_SCENARIOS,
  SpeechSimulationScenario,
} from '../../services/speechToTextService';

interface VoiceSymptomRecorderProps {
  onSymptomsExtracted: (newSymptoms: string[], fullTranscript: string) => void;
  className?: string;
  buttonLabel?: string;
  compact?: boolean;
}

export const VoiceSymptomRecorder: React.FC<VoiceSymptomRecorderProps> = ({
  onSymptomsExtracted,
  className = '',
  buttonLabel = 'จับเสียงบอกอาการ (Speech-to-Text)',
  compact = false,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [detectedSymptoms, setDetectedSymptoms] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [showSimulations, setShowSimulations] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

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

    if (!SpeechToTextService.isSupported()) {
      setErrorMessage('เบราว์เซอร์ไม่รองรับ Web Speech API แนะนำให้ใช้ปุ่มจำลองเสียงคนไข้ด้านล่าง');
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
      if (isListening) stopListening();
    }
  };

  // Simulated Voice Dictation (For environments with no microphone or demo pitching)
  const handleSimulateScenario = (scenario: SpeechSimulationScenario) => {
    if (isListening) stopListening();
    setIsSimulating(true);
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
    }, 45);
  };

  return (
    <div className={`rounded-xl border transition-all ${className} ${
      isListening || isSimulating
        ? 'bg-rose-50/50 border-rose-300 ring-1 ring-rose-200'
        : 'bg-teal-50/40 border-teal-200/80'
    }`}>
      <div className="p-2.5 sm:p-3 space-y-2">
        {/* Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleListening}
              disabled={isSimulating}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-teal-700 hover:bg-teal-800 text-white'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5 animate-spin" />
                  <span>กำลังฟังเสียงคนไข้... (คลิกเพื่อหยุด)</span>
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
              <div className="flex items-center gap-1 px-2 py-1 bg-white/80 rounded-md border border-rose-200 text-rose-700 text-[10px] font-mono">
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
              className="text-[10px] bg-white hover:bg-slate-50 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <Volume2 className="w-3 h-3 text-teal-700" />
              <span>{showSimulations ? 'ซ่อนบทจำลองเสียง' : '🔊 บทจำลองเสียงคนไข้ (Demo)'}</span>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200 rounded-lg p-2 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Live Speech Transcript Box */}
        {(transcript || isListening || isSimulating) && (
          <div className="bg-white rounded-lg p-2.5 border border-slate-200 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-100 pb-1">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Mic className="w-3 h-3 text-teal-600" />
                ข้อความเสียงที่ตรวจจับได้ (Transcribed Voice):
              </span>
              <span className="font-mono text-teal-800">
                {transcript.length} ตัวอักษร
              </span>
            </div>

            <p className="text-slate-800 font-medium italic leading-relaxed text-[11px]">
              "{transcript || 'กำลังรอรับเสียงพูด...'}"
            </p>

            {/* Extracted Symptoms Preview */}
            {detectedSymptoms.length > 0 && (
              <div className="pt-1 border-t border-slate-100 space-y-1">
                <div className="text-[10px] font-semibold text-teal-900 flex items-center gap-1">
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
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setTranscript('');
                  setDetectedSymptoms([]);
                }}
                className="text-[10px] text-slate-500 hover:text-slate-800 px-2 py-1 rounded"
              >
                ล้างข้อความ
              </button>
              <button
                type="button"
                onClick={handleApplySymptoms}
                className="bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-semibold px-3 py-1 rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>นำเข้าอาการที่จับเสียงได้ ({detectedSymptoms.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* Demo Simulation Scenarios Accordion */}
        {showSimulations && (
          <div className="bg-slate-50/90 rounded-lg p-2.5 border border-slate-200 space-y-1.5 text-xs">
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
                  className="text-left p-1.5 rounded-md bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-[11px] transition cursor-pointer"
                >
                  <div className="font-semibold text-slate-900 text-[10px] truncate">
                    ▶ {sc.title}
                  </div>
                  <div className="text-[9px] text-slate-500 truncate mt-0.5">
                    "{sc.fullSpeech.slice(0, 40)}..."
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

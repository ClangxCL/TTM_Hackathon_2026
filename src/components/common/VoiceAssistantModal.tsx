import React from 'react';
import { X, Mic, Sparkles, User, Activity, ArrowRight, Zap } from 'lucide-react';
import { SyntheticCase } from '../../types/patient';
import { VoiceSymptomRecorder } from './VoiceSymptomRecorder';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: SyntheticCase;
  onApplySymptomsToCase: (newSymptoms: string[]) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  currentCase,
  onApplySymptomsToCase,
}) => {
  if (!isOpen) return null;

  const p = currentCase.patient_info;
  const currentSymptoms = currentCase.current_encounter.symptoms;

  const handleSymptomsExtracted = (extractedSymptoms: string[], fullTranscript: string) => {
    if (extractedSymptoms.length === 0) return;
    const combined = Array.from(new Set([...currentSymptoms, ...extractedSymptoms]));
    onApplySymptomsToCase(combined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative bg-slate-900 border border-teal-500/40 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-teal-500/20 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/30">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  AI Speech-to-Text Assistant
                </h3>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  HOT FEATURE
                </span>
              </div>
              <p className="text-xs text-teal-300/80 mt-0.5">
                ระบบดักจับและสกัดคำบอกอาการผู้ป่วยด้วยเสียงภาษาไทย (th-TH NLP)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Active Patient Ribbon */}
        <div className="px-5 py-2.5 bg-white/5 border-b border-white/5 flex items-center justify-between text-xs text-slate-300 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-teal-400" />
            <span>เคสผู้ป่วยเป้าหมาย:</span>
            <span className="font-bold text-white bg-teal-950/80 px-2 py-0.5 rounded-md border border-teal-500/30">
              {p.name} ({p.gender}, {p.age} ปี) - HN: {p.hn}
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            อาการปัจจุบัน ({currentSymptoms.length}):{' '}
            <span className="text-teal-200 font-medium">
              {currentSymptoms.slice(0, 3).join(', ')}
              {currentSymptoms.length > 3 ? '...' : ''}
            </span>
          </div>
        </div>

        {/* Modal Body: Voice Hero Recorder */}
        <div className="p-4 sm:p-5 space-y-4">
          <VoiceSymptomRecorder
            variant="hero"
            buttonLabel="🎙️ พูดบอกอาการคนไข้ (Start Dictation)"
            title="พูดบอกอาการคนไข้ภาษาไทย หรือคลิกตัวอย่างจำลองเสียง"
            subtitle="ระบบจะถอดเสียงภาษาไทยและสกัดคำบ่งชี้อาการเพื่อนำเข้าสู่การประเมินสมุฏฐาน 4 ธาตุอัตโนมัติ"
            onSymptomsExtracted={handleSymptomsExtracted}
          />
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>เชื่อมโยงระบบสมุฏฐานวินิจฉัยและรหัส ICD-10/ICD-10-TM ทันที</span>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer text-xs font-semibold"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

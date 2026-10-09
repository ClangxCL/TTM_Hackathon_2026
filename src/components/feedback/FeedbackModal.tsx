import React, { useState } from 'react';
import { FeedbackRecord } from '../../types/analytics';
import { MockDataService } from '../../services/mockDataService';
import { MessageSquare, Star, Download, CheckCircle2, X } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  caseId: string;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  caseId,
  onClose,
}) => {
  const [usefulness, setUsefulness] = useState<number>(5);
  const [accuracy, setAccuracy] = useState<number>(5);
  const [uxScore, setUxScore] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [clinicianName, setClinicianName] = useState('พท.ป. ผู้ทดสอบระบบ');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const feedback: FeedbackRecord = {
      id: `FB-${Date.now()}`,
      timestamp: new Date().toISOString(),
      case_id: caseId,
      clinician_name: clinicianName,
      usefulness_score: usefulness,
      warning_accuracy_score: accuracy,
      ux_score: uxScore,
      feedback_notes: notes,
      overridden: false,
    };
    MockDataService.saveFeedback(feedback);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  const handleExportAll = () => {
    const list = MockDataService.getFeedbacks();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(list, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ttm_feedbacks_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-modal space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-700" />
            <h3 className="font-bold text-sm text-slate-900">
              แบบประเมินและข้อเสนอแนะแพทย์ผู้ใช้ (Clinician Feedback)
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <div className="font-bold text-sm text-slate-900">บันทึกข้อเสนอแนะเรียบร้อยแล้ว</div>
            <div className="text-xs text-slate-500">ข้อมูลถูกบันทึกในเบราว์เซอร์เพื่อการวิจัยและการปรับปรุงระบบ</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-medium text-slate-700 block mb-1">ชื่อแพทย์ผู้ประเมิน:</label>
              <input
                type="text"
                value={clinicianName}
                onChange={(e) => setClinicianName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:ring-1 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            {/* Rating 1: Usefulness of Smutthan */}
            <div>
              <label className="font-medium text-slate-700 block mb-1">
                1. ความเป็นประโยชน์ของผลวิเคราะห์สมุฏฐาน (1 - 5 ดาว):
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setUsefulness(num)}
                    className={`p-1.5 rounded-lg border flex items-center gap-1 transition ${
                      usefulness >= num
                        ? 'bg-amber-50 text-amber-600 border-amber-300 font-bold'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${usefulness >= num ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span>{num}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rating 2: HDI Warning Accuracy */}
            <div>
              <label className="font-medium text-slate-700 block mb-1">
                2. ความแม่นยำและความเหมาะสมของคำเตือนอันตรกิริยา (HDI Accuracy):
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setAccuracy(num)}
                    className={`p-1.5 rounded-lg border flex items-center gap-1 transition ${
                      accuracy >= num
                        ? 'bg-rose-50 text-rose-600 border-rose-300 font-bold'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${accuracy >= num ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{num}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rating 3: UX Workflow */}
            <div>
              <label className="font-medium text-slate-700 block mb-1">
                3. ความสะดวกในการใช้งานและการสั่งยา (Clinician UX):
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setUxScore(num)}
                    className={`p-1.5 rounded-lg border flex items-center gap-1 transition ${
                      uxScore >= num
                        ? 'bg-brand-50 text-brand-700 border-brand-300 font-bold'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${uxScore >= num ? 'fill-brand-600 text-brand-600' : ''}`} />
                    <span>{num}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="font-medium text-slate-700 block mb-1">
                ข้อเสนอแนะเพิ่มเติม / ความคิดเห็นของแพทย์:
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ระบุข้อเสนอแนะในการปรับปรุงสูตรยา หรือเกณฑ์สมุฏฐาน..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-1 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleExportAll}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-[11px] transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ส่งออก JSON Feedback</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs"
                >
                  ปิด
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl font-semibold bg-brand-700 hover:bg-brand-800 text-white text-xs shadow-sm"
                >
                  บันทึกแบบประเมิน
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

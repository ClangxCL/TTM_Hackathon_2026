import React, { useState } from 'react';
import { PrescribedItem } from '../../types/drug';
import { Trash2, CheckCircle2, FileText, AlertOctagon, Printer, ShieldCheck } from 'lucide-react';

interface PrescriptionCartProps {
  items: PrescribedItem[];
  onRemoveItem: (id: string) => void;
  onAcknowledgeItem: (id: string, reason: string) => void;
  onConfirmPrescription: () => void;
}

export const PrescriptionCart: React.FC<PrescriptionCartProps> = ({
  items,
  onRemoveItem,
  onAcknowledgeItem,
  onConfirmPrescription,
}) => {
  const [ackModalItem, setAckModalItem] = useState<PrescribedItem | null>(null);
  const [justificationNote, setJustificationNote] = useState('');

  const totalPrice = items.reduce(
    (sum, item) => sum + item.total_quantity * item.herb.unit_price_thb,
    0
  );

  // Check if any item has unacknowledged high warnings
  const unacknowledgedHighItems = items.filter(
    (item) => item.warnings.some((w) => w.severity === 'HIGH') && !item.acknowledged
  );

  const canConfirm = items.length > 0 && unacknowledgedHighItems.length === 0;

  const handleOpenAckModal = (item: PrescribedItem) => {
    setAckModalItem(item);
    setJustificationNote(item.acknowledgement_reason || 'แพทย์ผู้ตรวจรับทราบความเสี่ยงและมีแผนติดตามผลค่าทางห้องปฏิบัติการ');
  };

  const handleSaveAck = () => {
    if (ackModalItem) {
      onAcknowledgeItem(ackModalItem.id, justificationNote);
      setAckModalItem(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-soft space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <FileText className="w-4 h-4 text-brand-700" />
          <span>ตะกร้าใบสั่งยา (Prescription Cart)</span>
        </div>
        <span className="text-xs font-semibold bg-brand-50 text-brand-800 px-2.5 py-0.5 rounded-full border border-brand-200">
          {items.length} รายการ
        </span>
      </div>

      {/* Cart Items List */}
      {items.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          ยังไม่มีรายการยาในใบสั่งยา
          <div className="text-[11px] text-slate-400 mt-1">
            เลือกยาจากคอลัมน์กลางและกด "เพิ่มลงในใบสั่งยา"
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => {
            const hasHigh = item.warnings.some((w) => w.severity === 'HIGH');
            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border text-xs transition ${
                  hasHigh && !item.acknowledged
                    ? 'bg-rose-50/60 border-rose-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{item.herb.thai_name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({item.herb.strength_per_unit})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      {item.instructions}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition"
                    title="ลบรายการ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    จำนวน: <b className="text-slate-800 font-mono">{item.total_quantity}</b> {item.herb.unit} ({item.days} วัน)
                  </span>
                  <span className="font-bold text-slate-900">
                    ฿{(item.total_quantity * item.herb.unit_price_thb).toFixed(2)}
                  </span>
                </div>

                {/* High Warning Badge & Acknowledgement Action */}
                {hasHigh && (
                  <div className="mt-2 pt-1 border-t border-rose-200/60 flex items-center justify-between text-[11px]">
                    {item.acknowledged ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[10px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> รับทราบคำเตือนแล้ว
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-[10px]">
                        <AlertOctagon className="w-3.5 h-3.5 text-rose-600" /> มีคำเตือนระดับสูง
                      </span>
                    )}

                    <button
                      onClick={() => handleOpenAckModal(item)}
                      className={`text-[10px] font-semibold px-2 py-1 rounded transition ${
                        item.acknowledged
                          ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          : 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm animate-pulse'
                      }`}
                    >
                      {item.acknowledged ? 'แก้ไขเหตุผล' : 'กดรับทราบคำเตือน'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Cart Summary & Confirm Button */}
      {items.length > 0 && (
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">รวมค่าเวชภัณฑ์สมุนไพร:</span>
            <span className="font-bold text-sm text-slate-900">฿{totalPrice.toFixed(2)}</span>
          </div>

          {!canConfirm && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-[11px] text-rose-800 flex items-start gap-1.5">
              <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <b>ยังไม่สามารถยืนยันได้:</b> โปรดกด "รับทราบคำเตือน" และระบุเหตุผลทางคลินิกสำหรับรายการยาที่มีคำเตือนความเสี่ยงสูง
              </div>
            </div>
          )}

          <button
            onClick={onConfirmPrescription}
            disabled={!canConfirm}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm ${
              canConfirm
                ? 'bg-brand-700 hover:bg-brand-800 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>ยืนยันใบสั่งยา & พิมพ์ฉลาก (Confirm & Print)</span>
          </button>
        </div>
      )}

      {/* Acknowledgement Modal */}
      {ackModalItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-3 shadow-modal">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <AlertOctagon className="w-5 h-5" />
              <span>การรับทราบคำเตือนความเสี่ยงสูง (Clinical Override)</span>
            </div>
            <div className="text-xs text-slate-600">
              ยาที่สั่ง: <b className="text-slate-900">{ackModalItem.herb.thai_name}</b> มีคำเตือนอันตรกิริยาหรือขนาดยาระดับสูง
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                ระบุเหตุผลความจำเป็นทางคลินิกหรือแผนการเฝ้าระวัง:
              </label>
              <textarea
                rows={3}
                value={justificationNote}
                onChange={(e) => setJustificationNote(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-brand-500 focus:outline-none"
                placeholder="เช่น ผู้ป่วยรับทราบและมีนัดตรวจซ้ำ INR สัปดาห์หน้า / ปรับขนาดลดลง..."
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setAckModalItem(null)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveAck}
                disabled={!justificationNote.trim()}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-brand-700 hover:bg-brand-800 text-white shadow-sm disabled:opacity-50"
              >
                บันทึกการรับทราบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

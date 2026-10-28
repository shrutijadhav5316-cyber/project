import React, { useState } from 'react';
import { X, Calendar, Phone, User, CheckCircle2, Utensils, MessageSquare, AlertCircle } from 'lucide-react';
import { Mess } from '../types.ts';

interface BookTrialModalProps {
  mess: Mess;
  onClose: () => void;
  onInquirySubmitted: () => void;
}

export const BookTrialModal: React.FC<BookTrialModalProps> = ({
  mess,
  onClose,
  onInquirySubmitted,
}) => {
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredPlan, setPreferredPlan] = useState<'Trial Meal' | 'Monthly Mess' | 'Tiffin Service'>('Trial Meal');
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !phone.trim()) {
      setError('Please provide your name and contact phone number.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messId: mess.id,
          studentName,
          phone,
          email,
          preferredPlan,
          preferredDate,
          notes,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit booking inquiry');
      }

      setSubmitted(true);
      onInquirySubmitted();
    } catch (err: any) {
      setError(err.message || 'Error booking trial meal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#FFF4E3] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-[#191919] flex flex-col my-auto">
        {/* Header */}
        <div className="bg-[#191919] text-white p-5 sm:p-6 relative border-b-2 border-[#F0442B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0442B] text-white flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Book Trial / Reserve Seat</h3>
              <p className="text-xs text-[#FFD400] font-bold">{mess.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-gray-900">Trial Request Sent!</h4>
              <p className="text-sm text-gray-700 max-w-sm mx-auto leading-relaxed font-medium">
                Your request has been received by <strong>{mess.ownerName}</strong> at{' '}
                <strong>{mess.name}</strong>. They will contact you on <strong>{phone}</strong> to confirm your meal timing.
              </p>
              <div className="p-4 bg-white rounded-2xl border border-gray-200 text-xs text-gray-600 max-w-sm mx-auto">
                📍 Location: {mess.location}
                <br />
                📞 Direct Phone: {mess.phone}
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#F0442B] text-white font-bold text-sm shadow-md"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-100 text-red-800 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Your Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Siddharth Patil"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Phone (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Plan of Interest
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'Trial Meal', label: '1 Free Trial' },
                    { key: 'Monthly Mess', label: 'Monthly Pass' },
                    { key: 'Tiffin Service', label: 'Hostel Tiffin' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.key}
                      onClick={() => setPreferredPlan(item.key as any)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        preferredPlan === item.key
                          ? 'bg-[#191919] text-[#FFD400] border-[#191919] shadow-xs'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Special Notes / Food Preference
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Prefer lunch, want hot Jowar bhakri, staying in boys hostel..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-[#F0442B] hover:bg-[#d93821] text-white font-black text-sm tracking-wide shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Sending Request...' : 'Confirm Trial / Seat Reservation'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

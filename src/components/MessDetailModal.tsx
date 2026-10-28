import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  PhoneCall, 
  Calendar, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Utensils, 
  MessageSquareQuote,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Mess, Review } from '../types.ts';

interface MessDetailModalProps {
  mess: Mess;
  onClose: () => void;
  onBookTrial: (mess: Mess) => void;
  onReviewSubmitted: (updatedMess: Mess) => void;
}

export const MessDetailModal: React.FC<MessDetailModalProps> = ({
  mess,
  onClose,
  onBookTrial,
  onReviewSubmitted,
}) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Default to today's day of week
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const initialDay = daysOfWeek.includes(todayName) ? todayName : 'Monday';
  
  const [selectedDay, setSelectedDay] = useState<string>(initialDay);
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'about'>('menu');

  // Review form states
  const [studentName, setStudentName] = useState('');
  const [college, setCollege] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currentDayMenu = mess.weeklyMenu?.[selectedDay] || {
    lunch: 'Standard Maharashtrian Thali',
    dinner: 'Standard Evening Meal',
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !comment.trim()) {
      setErrorMessage('Please fill in your name and review comments.');
      return;
    }

    setSubmittingReview(true);
    setErrorMessage('');

    try {
      const response = await fetch(`/api/messes/${mess.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          college: college || 'College Student',
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const data = await response.json();
      setReviewSuccess(true);
      setStudentName('');
      setCollege('');
      setComment('');
      onReviewSubmitted(data.mess);

      setTimeout(() => {
        setReviewSuccess(false);
      }, 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#FFF4E3] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border-2 border-[#191919] flex flex-col my-auto">
        {/* Modal Header */}
        <div className="bg-[#191919] text-white p-5 sm:p-7 relative border-b-2 border-[#F0442B]">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              style={{ backgroundColor: mess.buttonColor }}
              className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md text-white shadow-xs"
            >
              {mess.category}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                mess.dietType === 'Veg & Non-Veg'
                  ? 'bg-red-900/60 text-red-200 border border-red-500/40'
                  : 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/40'
              }`}
            >
              {mess.dietType}
            </span>
            <span className="text-xs text-[#FFD400] font-bold">
              {mess.cuisine}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {mess.name}
              </h2>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-300 mt-1">
                <MapPin className="w-4 h-4 text-[#F0442B] shrink-0" />
                <span>{mess.location}</span>
                <span className="text-[#FFD400] font-bold">• {mess.distanceText}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#262626] p-3 rounded-2xl border border-gray-700">
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Monthly Fee</span>
                <span className="text-2xl font-black text-[#FFD400]">
                  ₹{mess.monthlyPrice.toLocaleString()}
                </span>
              </div>
              <div className="w-[1px] h-8 bg-gray-700" />
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Seats Available</span>
                <span className={`text-lg font-black ${mess.availableSeats > 0 ? 'text-[#19B783]' : 'text-red-400'}`}>
                  {mess.availableSeats} of {mess.totalSeats}
                </span>
              </div>
            </div>
          </div>

          {/* Owner Notice Banner if present */}
          {mess.notice && (
            <div className="mt-4 p-2.5 rounded-xl bg-orange-950/70 border border-orange-600/50 text-xs text-orange-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFD400] shrink-0" />
              <span className="font-medium">
                <strong>Mess Notice:</strong> {mess.notice}
              </span>
            </div>
          )}
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#e5d8c6] bg-white px-5 sm:px-7">
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-3.5 px-4 font-bold text-sm sm:text-base border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'menu'
                ? 'border-[#F0442B] text-[#F0442B]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Weekly 7-Day Menu</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 px-4 font-bold text-sm sm:text-base border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-[#F0442B] text-[#F0442B]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Student Reviews ({mess.reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`py-3.5 px-4 font-bold text-sm sm:text-base border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'about'
                ? 'border-[#F0442B] text-[#F0442B]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Timings & Info</span>
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: WEEKLY MENU */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              {/* Day selection pills */}
              <div>
                <span className="text-xs font-black uppercase text-gray-700 tracking-wider block mb-2">
                  Select Day to View Menu:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
                  {daysOfWeek.map((day) => {
                    const isToday = day === todayName;
                    const isSelected = day === selectedDay;
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all border ${
                          isSelected
                            ? 'bg-[#191919] text-[#FFD400] border-[#191919] shadow-md scale-105'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {day} {isToday && '• Today'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Day Menu Card */}
              <div className="bg-white rounded-2xl p-6 border-2 border-[#e6dbc9] shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-[#191919]">{selectedDay}'s Menu</span>
                    {selectedDay === 'Sunday' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                        Special Feast Day 🌟
                      </span>
                    )}
                  </div>
                  {currentDayMenu.specialItem && (
                    <span className="text-xs font-black text-[#F0442B] bg-[#FFF4E3] px-3 py-1 rounded-lg border border-[#f1dec7]">
                      Chef Highlight: {currentDayMenu.specialItem}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Lunch details */}
                  <div className="bg-orange-50/60 p-4 rounded-xl border border-orange-200">
                    <div className="flex items-center gap-2 text-[#F0442B] font-black text-sm mb-2">
                      <Clock className="w-4 h-4" />
                      <span>LUNCH ({mess.timings.lunch})</span>
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed font-medium">
                      {currentDayMenu.lunch}
                    </p>
                  </div>

                  {/* Dinner details */}
                  <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 text-[#304FFE] font-black text-sm mb-2">
                      <Clock className="w-4 h-4" />
                      <span>DINNER ({mess.timings.dinner})</span>
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed font-medium">
                      {currentDayMenu.dinner}
                    </p>
                  </div>
                </div>

                {/* Breakfast if present */}
                {currentDayMenu.breakfast && (
                  <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-2 text-[#19B783] font-black text-sm mb-1.5">
                      <Clock className="w-4 h-4" />
                      <span>BREAKFAST ({mess.timings.breakfast || '7:30 AM – 9:00 AM'})</span>
                    </div>
                    <p className="text-gray-800 text-sm font-medium">
                      {currentDayMenu.breakfast}
                    </p>
                  </div>
                )}

                {/* Sunday Special Banner */}
                {mess.sundaySpecial && selectedDay === 'Sunday' && (
                  <div className="bg-[#FFD400]/20 p-4 rounded-xl border border-[#FFD400] text-sm">
                    <span className="font-extrabold text-[#191919] block mb-1">
                      🎉 Sunday Traditional Feast:
                    </span>
                    <p className="text-gray-800 font-bold">{mess.sundaySpecial}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Rating summary bar */}
              <div className="bg-white rounded-2xl p-6 border-2 border-[#e6dbc9] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-4xl font-black text-[#191919]">{mess.rating}</span>
                    <div className="flex text-[#FFD400]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-6 h-6 ${
                            s <= Math.round(mess.rating) ? 'fill-[#FFD400]' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 font-bold mt-1">
                    Based on {mess.reviewsCount} verified student ratings
                  </p>
                </div>

                <div className="text-xs text-gray-700 max-w-sm text-center sm:text-right">
                  Honest reviews submitted by fellow students living near Kasba Bawda campus.
                </div>
              </div>

              {/* Add a review form */}
              <div className="bg-white rounded-2xl p-6 border-2 border-[#e6dbc9] shadow-sm">
                <h4 className="text-base font-black text-[#191919] mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#F0442B] fill-[#F0442B]" />
                  <span>Leave an Honest Student Review</span>
                </h4>

                {reviewSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your review has been posted successfully! Dhanyawad!</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-800 text-xs font-bold">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Omkar Patil"
                        className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        College / Department
                      </label>
                      <input
                        type="text"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="e.g. DY Patil College, Mech 3rd Year"
                        className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Rate this Mess:
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          type="button"
                          key={starVal}
                          onClick={() => setRating(starVal)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              starVal <= rating
                                ? 'text-[#FFD400] fill-[#FFD400]'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-black text-gray-700 ml-2">
                        {rating} out of 5 stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Your Honest Review *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share about food taste, hygiene, quantity, bhakri quality, cleanliness..."
                      className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F0442B] hover:bg-[#d93821] text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submittingReview ? 'Submitting...' : 'Post Student Review'}</span>
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                <h4 className="text-sm font-black text-gray-700 uppercase tracking-wider">
                  Recent Reviews:
                </h4>

                {mess.reviews && mess.reviews.length > 0 ? (
                  mess.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-black text-gray-900 text-sm block">
                            {rev.studentName}
                          </span>
                          <span className="text-xs text-gray-700 font-medium">{rev.college}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-[#FFF4E3] px-2 py-0.5 rounded border border-[#efd6ba]">
                          <Star className="w-3.5 h-3.5 fill-[#FFD400] text-[#FFD400]" />
                          <span className="text-xs font-black text-gray-900">{rev.rating}.0</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                        "{rev.comment}"
                      </p>

                      <div className="text-[10px] text-gray-600 pt-1">Posted on {rev.date}</div>

                      {/* Owner reply */}
                      {rev.ownerReply && (
                        <div className="mt-2.5 p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs">
                          <span className="font-extrabold text-[#F0442B] block mb-0.5">
                            Mess Owner Response:
                          </span>
                          <p className="text-gray-800 italic">"{rev.ownerReply}"</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-700 text-sm bg-white rounded-2xl">
                    No reviews yet. Be the first student to review {mess.name}!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT & TIMINGS */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border-2 border-[#e6dbc9] shadow-sm space-y-4">
                <h4 className="text-lg font-black text-[#191919]">About {mess.name}</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{mess.description}</p>

                <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold text-gray-700 uppercase block mb-1">
                      Mess Owner:
                    </span>
                    <span className="text-sm font-black text-gray-900">{mess.ownerName}</span>
                    <span className="text-xs text-gray-700 block">{mess.ownerEmail}</span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-gray-700 uppercase block mb-1">
                      Direct Phone:
                    </span>
                    <a
                      href={`tel:${mess.phone}`}
                      className="text-sm font-black text-[#F0442B] hover:underline flex items-center gap-1.5"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{mess.phone}</span>
                    </a>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-700 uppercase block mb-2">
                    Speciality Tags:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {mess.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold border border-gray-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Sticky Action Bar */}
        <div className="bg-white border-t border-[#e5d8c6] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a
              href={`tel:${mess.phone}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-bold transition-all border border-gray-300"
            >
              <PhoneCall className="w-4 h-4 text-[#F0442B]" />
              <span>Call Mess: {mess.phone}</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onBookTrial(mess);
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F0442B] hover:bg-[#d93821] text-white text-xs sm:text-sm font-black shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Free Trial Meal / Reserve Seat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

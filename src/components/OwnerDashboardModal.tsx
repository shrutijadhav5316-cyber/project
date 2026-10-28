import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Users, 
  IndianRupee, 
  Clock, 
  Save, 
  CheckCircle2, 
  MessageSquareQuote, 
  PhoneCall, 
  Sparkles, 
  Utensils, 
  LogOut,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { Mess, OwnerUser, Inquiry, DayMenu } from '../types.ts';

interface OwnerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  allMesses: Mess[];
  currentOwner: OwnerUser | null;
  onLoginSuccess: (user: OwnerUser) => void;
  onLogout: () => void;
  onMessUpdated: (mess: Mess) => void;
}

export const OwnerDashboardModal: React.FC<OwnerDashboardModalProps> = ({
  isOpen,
  onClose,
  allMesses,
  currentOwner,
  onLoginSuccess,
  onLogout,
  onMessUpdated,
}) => {
  if (!isOpen) return null;

  // Login form state
  const [selectedMessId, setSelectedMessId] = useState<string>(allMesses[0]?.id || '');
  const [loginEmail, setLoginEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard active tab
  const [dashboardTab, setDashboardTab] = useState<'seats' | 'menu' | 'profile' | 'inquiries' | 'reviews'>('seats');

  // Currently managed mess
  const managedMess = allMesses.find((m) => m.id === currentOwner?.messId) || allMesses[0];

  // Editable states for managed mess
  const [seats, setSeats] = useState<number>(managedMess?.availableSeats || 0);
  const [monthlyPrice, setMonthlyPrice] = useState<number>(managedMess?.monthlyPrice || 2800);
  const [dailyRate, setDailyRate] = useState<number>(managedMess?.dailyRate || 90);
  const [lunchTiming, setLunchTiming] = useState<string>(managedMess?.timings?.lunch || '');
  const [dinnerTiming, setDinnerTiming] = useState<string>(managedMess?.timings?.dinner || '');
  const [notice, setNotice] = useState<string>(managedMess?.notice || '');
  const [sundaySpecial, setSundaySpecial] = useState<string>(managedMess?.sundaySpecial || '');

  // Menu editor states
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [menuDay, setMenuDay] = useState<string>('Monday');
  const [dayLunch, setDayLunch] = useState<string>('');
  const [dayDinner, setDayDinner] = useState<string>('');
  const [dayBreakfast, setDayBreakfast] = useState<string>('');
  const [daySpecial, setDaySpecial] = useState<string>('');

  // Inquiries list
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // Status message
  const [saveSuccess, setSaveSuccess] = useState('');

  // Sync state when managed mess changes
  useEffect(() => {
    if (managedMess) {
      setSeats(managedMess.availableSeats);
      setMonthlyPrice(managedMess.monthlyPrice);
      setDailyRate(managedMess.dailyRate || 90);
      setLunchTiming(managedMess.timings.lunch);
      setDinnerTiming(managedMess.timings.dinner);
      setNotice(managedMess.notice || '');
      setSundaySpecial(managedMess.sundaySpecial || '');
      loadMenuDay(menuDay, managedMess);
      fetchInquiries(managedMess.id);
    }
  }, [managedMess]);

  const loadMenuDay = (day: string, targetMess: Mess) => {
    const item = targetMess.weeklyMenu?.[day] || { lunch: '', dinner: '' };
    setDayLunch(item.lunch || '');
    setDayDinner(item.dinner || '');
    setDayBreakfast(item.breakfast || '');
    setDaySpecial(item.specialItem || '');
  };

  const handleMenuDaySelect = (day: string) => {
    setMenuDay(day);
    if (managedMess) {
      loadMenuDay(day, managedMess);
    }
  };

  const fetchInquiries = async (messId: string) => {
    setLoadingInquiries(true);
    try {
      const res = await fetch(`/api/inquiries?messId=${messId}`);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messId: selectedMessId,
          email: loginEmail,
        }),
      });

      if (!res.ok) {
        throw new Error('Login failed');
      }

      const data = await res.json();
      onLoginSuccess(data.user);
    } catch (err: any) {
      setLoginError(err.message || 'Login error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSaveSeats = async () => {
    try {
      const res = await fetch(`/api/messes/${managedMess.id}/seats`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availableSeats: seats }),
      });
      if (res.ok) {
        const data = await res.json();
        onMessUpdated(data.mess);
        triggerSuccess('Available seats count updated successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`/api/messes/${managedMess.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyPrice: Number(monthlyPrice),
          dailyRate: Number(dailyRate),
          timings: {
            ...managedMess.timings,
            lunch: lunchTiming,
            dinner: dinnerTiming,
          },
          notice,
          sundaySpecial,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        onMessUpdated(data.mess);
        triggerSuccess('Mess details and timings updated!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveMenuDay = async () => {
    const updatedWeeklyMenu = {
      ...managedMess.weeklyMenu,
      [menuDay]: {
        lunch: dayLunch,
        dinner: dayDinner,
        breakfast: dayBreakfast || undefined,
        specialItem: daySpecial || undefined,
      },
    };

    try {
      const res = await fetch(`/api/messes/${managedMess.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeklyMenu: updatedWeeklyMenu }),
      });
      if (res.ok) {
        const data = await res.json();
        onMessUpdated(data.mess);
        triggerSuccess(`Updated ${menuDay}'s menu!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === inquiryId ? { ...i, status: newStatus as any } : i))
        );
        triggerSuccess(`Inquiry status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReplyReview = async (reviewId: string, replyText: string) => {
    if (!replyText.trim()) return;
    try {
      const res = await fetch(`/api/messes/${managedMess.id}/reviews/${reviewId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText }),
      });
      if (res.ok) {
        // Fetch updated mess
        const mRes = await fetch(`/api/messes/${managedMess.id}`);
        const updated = await mRes.json();
        onMessUpdated(updated);
        triggerSuccess('Owner reply posted!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const triggerSuccess = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#FFF4E3] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border-2 border-[#191919] flex flex-col my-auto">
        {/* Header */}
        <div className="bg-[#191919] text-white p-5 sm:p-6 relative border-b-2 border-[#FFD400] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD400] text-[#191919] flex items-center justify-center font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Mess Owner Management Portal
              </h2>
              <p className="text-xs text-[#FFD400] font-bold">
                {currentOwner
                  ? `Logged in as: ${currentOwner.name} (${currentOwner.messName})`
                  : 'Mess Owner Login & Live Seat Control'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success toast if triggered */}
        {saveSuccess && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* Content View: Not Logged In vs Logged In */}
        {!currentOwner ? (
          /* LOGIN SCREEN */
          <div className="p-6 sm:p-10 max-w-lg mx-auto w-full space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-gray-900">Owner Access</h3>
              <p className="text-sm text-gray-600">
                Manage your mess's available seats, daily menus, pricing, and student trial requests.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-100 text-red-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Select Your Mess to Manage *
                </label>
                <select
                  value={selectedMessId}
                  onChange={(e) => setSelectedMessId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B] font-bold"
                >
                  {allMesses.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.category} - {m.location.split(',')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Owner Email / Username
                </label>
                <input
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. annapurna.kasba@gmail.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B]"
                />
                <span className="text-[11px] text-gray-500 block mt-1">
                  💡 Tip for College Mini-Project Demo: Select your mess from dropdown above and click Login directly!
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 rounded-xl bg-[#191919] hover:bg-[#333333] text-[#FFD400] font-black text-sm tracking-wide shadow-md transition-all active:scale-98 cursor-pointer"
              >
                {isLoggingIn ? 'Logging in...' : 'Sign In as Mess Owner'}
              </button>
            </form>
          </div>
        ) : (
          /* DASHBOARD VIEW */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top Navigation Tabs */}
            <div className="bg-white border-b border-[#e5d8c6] px-4 sm:px-6 flex items-center justify-between overflow-x-auto">
              <div className="flex gap-1 sm:gap-2">
                {[
                  { id: 'seats', label: 'Live Seats', icon: Users },
                  { id: 'menu', label: 'Weekly Menu', icon: Utensils },
                  { id: 'profile', label: 'Prices & Timings', icon: IndianRupee },
                  { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: Calendar },
                  { id: 'reviews', label: `Reviews (${managedMess.reviews.length})`, icon: MessageSquareQuote },
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = dashboardTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setDashboardTab(t.id as any)}
                      className={`py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                        isActive
                          ? 'border-[#F0442B] text-[#F0442B]'
                          : 'border-transparent text-gray-600 hover:text-black'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={onLogout}
                className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 py-1.5 px-2.5 rounded-lg hover:bg-red-50 transition-colors shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch / Logout</span>
              </button>
            </div>

            {/* Dashboard Content Body */}
            <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
              {/* TAB 1: LIVE SEATS */}
              {dashboardTab === 'seats' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="bg-white rounded-2xl p-6 border-2 border-[#e6dbc9] shadow-sm space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-[#191919]">
                        Live Seat Availability Control
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        When students search for messes, they see your live seat count. Update this whenever new students enroll or seats fill up!
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-[#FFF4E3] rounded-2xl border border-[#ecdac2]">
                      <div>
                        <span className="text-xs font-bold uppercase text-gray-500 block">
                          Current Available Seats
                        </span>
                        <div className="text-5xl font-black text-[#F0442B] mt-1">
                          {seats}{' '}
                          <span className="text-sm font-bold text-gray-500">
                            / {managedMess.totalSeats} total
                          </span>
                        </div>
                      </div>

                      {/* Seat increment / decrement controls */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setSeats((prev) => Math.max(0, prev - 1))}
                          className="w-12 h-12 rounded-2xl bg-white border-2 border-gray-300 hover:border-gray-500 text-xl font-black flex items-center justify-center text-gray-800 shadow-xs active:scale-95 transition-all"
                        >
                          -
                        </button>

                        <input
                          type="number"
                          min="0"
                          max={managedMess.totalSeats || 50}
                          value={seats}
                          onChange={(e) => setSeats(Math.max(0, Number(e.target.value)))}
                          className="w-20 py-2.5 text-center text-xl font-black bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B]"
                        />

                        <button
                          type="button"
                          onClick={() => setSeats((prev) => Math.min(managedMess.totalSeats || 50, prev + 1))}
                          className="w-12 h-12 rounded-2xl bg-white border-2 border-gray-300 hover:border-gray-500 text-xl font-black flex items-center justify-center text-gray-800 shadow-xs active:scale-95 transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Quick presets */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSeats(0)}
                        className="flex-1 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold transition-colors"
                      >
                        Mark Mess Full (0 Seats)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSeats(10)}
                        className="flex-1 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold transition-colors"
                      >
                        Set to 10 Seats
                      </button>
                      <button
                        type="button"
                        onClick={() => setSeats(managedMess.totalSeats || 25)}
                        className="flex-1 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold transition-colors"
                      >
                        Reset to Full Capacity ({managedMess.totalSeats})
                      </button>
                    </div>

                    <button
                      onClick={handleSaveSeats}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F0442B] hover:bg-[#d93821] text-white font-black text-sm tracking-wide shadow-md transition-all active:scale-98 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Live Seat Count</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: WEEKLY MENU EDITOR */}
              {dashboardTab === 'menu' && (
                <div className="space-y-6">
                  {/* Day Selector */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day}
                        onClick={() => handleMenuDaySelect(day)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                          menuDay === day
                            ? 'bg-[#191919] text-[#FFD400] border-[#191919] shadow-sm scale-105'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  <div className="bg-white rounded-2xl p-6 border-2 border-[#e6dbc9] shadow-sm space-y-4">
                    <h3 className="text-lg font-black text-gray-900">
                      Editing Menu for {menuDay}
                    </h3>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Lunch Items ({lunchTiming}) *
                      </label>
                      <textarea
                        rows={2}
                        value={dayLunch}
                        onChange={(e) => setDayLunch(e.target.value)}
                        placeholder="e.g. Bhakri / Chapati, Pithla, Thecha, Varan Bhaat, Solkadhi"
                        className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Dinner Items ({dinnerTiming}) *
                      </label>
                      <textarea
                        rows={2}
                        value={dayDinner}
                        onChange={(e) => setDayDinner(e.target.value)}
                        placeholder="e.g. Poli, Matki Usal, Dal Fry, Steam Rice"
                        className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                          Breakfast Items (Optional)
                        </label>
                        <input
                          type="text"
                          value={dayBreakfast}
                          onChange={(e) => setDayBreakfast(e.target.value)}
                          placeholder="e.g. Pohe / Thalipeeth with chai"
                          className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                          Special Highlight Item
                        </label>
                        <input
                          type="text"
                          value={daySpecial}
                          onChange={(e) => setDaySpecial(e.target.value)}
                          placeholder="e.g. Kolhapuri Bharli Vangi"
                          className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B]"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleSaveMenuDay}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#F0442B] hover:bg-[#d93821] text-white font-black text-sm tracking-wide shadow-md transition-all active:scale-98 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save {menuDay} Menu</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PRICING & TIMINGS */}
              {dashboardTab === 'profile' && (
                <div className="bg-white rounded-2xl p-6 border-2 border-[#e6dbc9] shadow-sm space-y-5 max-w-2xl mx-auto">
                  <h3 className="text-lg font-black text-gray-900">
                    Pricing, Timings & Notice Board
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Monthly Subscription (₹) *
                      </label>
                      <input
                        type="number"
                        value={monthlyPrice}
                        onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                        className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B] font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Single Meal / Daily Rate (₹)
                      </label>
                      <input
                        type="number"
                        value={dailyRate}
                        onChange={(e) => setDailyRate(Number(e.target.value))}
                        className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B] font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Lunch Timings *
                      </label>
                      <input
                        type="text"
                        value={lunchTiming}
                        onChange={(e) => setLunchTiming(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Dinner Timings *
                      </label>
                      <input
                        type="text"
                        value={dinnerTiming}
                        onChange={(e) => setDinnerTiming(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Sunday Feast Special Item
                    </label>
                    <input
                      type="text"
                      value={sundaySpecial}
                      onChange={(e) => setSundaySpecial(e.target.value)}
                      placeholder="e.g. Puran Poli & Katachi Amti"
                      className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Today's Student Notice Banner
                    </label>
                    <textarea
                      rows={2}
                      value={notice}
                      onChange={(e) => setNotice(e.target.value)}
                      placeholder="Announcement shown in orange banner to students..."
                      className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B]"
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F0442B] hover:bg-[#d93821] text-white font-black text-sm tracking-wide shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Pricing & Timings</span>
                  </button>
                </div>
              )}

              {/* TAB 4: INQUIRIES & TRIAL BOOKINGS */}
              {dashboardTab === 'inquiries' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-gray-900">
                      Student Trial Requests & Seat Inquiries
                    </h3>
                    <span className="text-xs font-bold text-gray-500">
                      {inquiries.length} total inquiries
                    </span>
                  </div>

                  {loadingInquiries ? (
                    <div className="p-8 text-center text-gray-500 text-sm">Loading inquiries...</div>
                  ) : inquiries.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl text-center text-gray-500 border border-gray-200">
                      No student trial requests yet for {managedMess.name}.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {inquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-base font-black text-gray-900">
                                {inq.studentName}
                              </span>
                              <span
                                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  inq.status === 'Pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : inq.status === 'Contacted'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {inq.status}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                              <span className="flex items-center gap-1 font-bold text-[#F0442B]">
                                <PhoneCall className="w-3.5 h-3.5" />
                                <a href={`tel:${inq.phone}`} className="hover:underline">
                                  {inq.phone}
                                </a>
                              </span>
                              <span>• Plan: <strong>{inq.preferredPlan}</strong></span>
                              <span>• Date: {inq.preferredDate}</span>
                            </div>

                            {inq.notes && (
                              <p className="text-xs text-gray-500 italic mt-1">
                                Notes: "{inq.notes}"
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                              className="text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Admitted">Admitted</option>
                            </select>

                            <a
                              href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                            >
                              WhatsApp
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: STUDENT REVIEWS & OWNER REPLIES */}
              {dashboardTab === 'reviews' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-gray-900">
                    Student Reviews & Official Replies
                  </h3>

                  <div className="space-y-4">
                    {managedMess.reviews.map((rev) => (
                      <OwnerReviewItem
                        key={rev.id}
                        review={rev}
                        onSaveReply={(reply) => handleReplyReview(rev.id, reply)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface OwnerReviewItemProps {
  review: {
    id: string;
    studentName: string;
    college: string;
    rating: number;
    comment: string;
    date: string;
    ownerReply?: string;
  };
  onSaveReply: (reply: string) => void;
}

const OwnerReviewItem: React.FC<OwnerReviewItemProps> = ({ review, onSaveReply }) => {
  const [replyText, setReplyText] = useState(review.ownerReply || '');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <span className="font-black text-gray-900 text-sm">{review.studentName}</span>
          <span className="text-xs text-gray-500 block">{review.college} • {review.date}</span>
        </div>
        <div className="text-xs font-black bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200">
          ★ {review.rating}.0
        </div>
      </div>

      <p className="text-sm text-gray-700">"{review.comment}"</p>

      {/* Reply box */}
      <div className="pt-2 border-t border-gray-100">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your polite owner response..."
              className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F0442B]"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onSaveReply(replyText);
                  setIsEditing(false);
                }}
                className="px-3 py-1 rounded-lg bg-[#F0442B] text-white text-xs font-bold"
              >
                Post Reply
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : review.ownerReply ? (
          <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs flex items-start justify-between gap-2">
            <div>
              <span className="font-extrabold text-[#F0442B] block mb-0.5">Your Response:</span>
              <p className="text-gray-800 italic">"{review.ownerReply}"</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-[#F0442B] underline font-bold"
            >
              Edit
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-[#304FFE] font-bold hover:underline"
          >
            + Add Owner Response to this review
          </button>
        )}
      </div>
    </div>
  );
};

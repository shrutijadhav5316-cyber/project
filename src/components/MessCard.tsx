import React from 'react';
import { 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  IndianRupee, 
  ArrowRight, 
  Scale, 
  PhoneCall, 
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { Mess } from '../types.ts';

interface MessCardProps {
  mess: Mess;
  onViewDetails: (mess: Mess) => void;
  onBookTrial: (mess: Mess) => void;
  isCompared: boolean;
  onToggleCompare: (mess: Mess) => void;
}

export const MessCard: React.FC<MessCardProps> = ({
  mess,
  onViewDetails,
  onBookTrial,
  isCompared,
  onToggleCompare,
}) => {
  // Determine category badge colors
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'POPULAR':
        return 'bg-[#F0442B] text-white';
      case 'BEST RATED':
        return 'bg-[#7C3AED] text-white';
      case 'CAMPUS FAV':
        return 'bg-[#F97316] text-white';
      case 'TOP RATED':
        return 'bg-[#EA580C] text-white';
      case 'MAIN ROAD':
        return 'bg-[#304FFE] text-white';
      case 'BUDGET FRIENDLY':
        return 'bg-[#19B783] text-white';
      case 'POPULAR CHOICE':
        return 'bg-[#2563EB] text-white';
      case 'NON-VEG SPECIAL':
        return 'bg-[#DC2626] text-white';
      case 'STUDENT CHOICE':
        return 'bg-[#059669] text-white';
      case 'VALUE PACK':
        return 'bg-[#D97706] text-white';
      default:
        return 'bg-gray-900 text-white';
    }
  };

  const seatsLeft = mess.availableSeats;
  const isDistanceUnavailable = mess.distanceMeters === null;

  return (
    <div className="bg-white rounded-2xl border-2 border-[#e6dbc9] hover:border-[#F0442B]/70 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group relative">
      {/* Top Banner & Header info */}
      <div>
        <div className="p-5 pb-3">
          {/* Top row: Badges, Diet, and Compare checkbox */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs ${getCategoryBadgeClass(
                  mess.category
                )}`}
              >
                {mess.category}
              </span>

              {mess.dietType === 'Veg & Non-Veg' ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                  Non-Veg & Veg
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Pure Veg
                </span>
              )}
            </div>

            {/* Compare toggle button */}
            <button
              onClick={() => onToggleCompare(mess)}
              className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                isCompared
                  ? 'bg-[#304FFE] text-white border-[#304FFE] shadow-xs'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200'
              }`}
              title="Add to side-by-side comparison"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? 'Compared' : 'Compare'}</span>
            </button>
          </div>

          {/* Mess Title & Rating */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 
              onClick={() => onViewDetails(mess)}
              className="text-xl sm:text-2xl font-black text-[#191919] group-hover:text-[#F0442B] transition-colors cursor-pointer"
            >
              {mess.name}
            </h3>

            {/* Star Rating Badge */}
            <div className="flex items-center gap-1 bg-[#FFF4E3] border border-[#f3d9b8] px-2 py-1 rounded-lg shrink-0">
              <Star className="w-4 h-4 fill-[#FFD400] text-[#FFD400]" />
              <span className="font-black text-sm text-[#191919]">{mess.rating}</span>
              <span className="text-[11px] text-gray-600">({mess.reviewsCount})</span>
            </div>
          </div>

          {/* Price & Seats status bar */}
          <div className="flex items-baseline justify-between py-2 my-1 border-y border-dashed border-gray-200">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#191919] tracking-tight">
                  ₹{mess.monthlyPrice.toLocaleString()}
                </span>
                <span className="text-xs text-gray-700 font-bold">/ month</span>
              </div>
              {mess.dailyRate && (
                <span className="text-[11px] text-gray-600 block">
                  or ~₹{mess.dailyRate} / single meal
                </span>
              )}
            </div>

            {/* Seats status badge */}
            <div className="text-right">
              {seatsLeft > 10 ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{seatsLeft} seats left</span>
                </div>
              ) : seatsLeft > 0 ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Only {seatsLeft} seats!</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span>Full for this month</span>
                </div>
              )}
            </div>
          </div>

          {/* Location & Proximity */}
          <div className="mt-2.5 space-y-1.5 text-xs text-gray-600">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#F0442B] shrink-0 mt-0.5" />
              <span className="line-clamp-1 text-gray-800 font-medium">{mess.location}</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px]">
              {isDistanceUnavailable ? (
                <span className="inline-flex items-center gap-1 text-gray-700 font-semibold bg-gray-100 px-2 py-0.5 rounded">
                  <Info className="w-3 h-3 text-gray-700" />
                  Distance unavailable
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[#304FFE] font-bold bg-blue-50 px-2 py-0.5 rounded">
                  <span>📍</span>
                  {mess.distanceText}
                </span>
              )}
            </div>
          </div>

          {/* Specialities / Food highlights */}
          <div className="mt-3">
            <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide block mb-1.5">
              Speciality Dishes:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {mess.speciality.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-[#FFF4E3] text-[#191919] font-medium text-xs border border-[#ecdac2]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Timings */}
          <div className="mt-3 pt-2.5 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Clock className="w-3.5 h-3.5 text-[#F0442B] shrink-0" />
              <div>
                <span className="text-[10px] text-gray-700 font-bold block uppercase">Lunch:</span>
                <span className="font-bold text-gray-800 text-[11px]">{mess.timings.lunch}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-gray-600">
              <Clock className="w-3.5 h-3.5 text-[#304FFE] shrink-0" />
              <div>
                <span className="text-[10px] text-gray-700 font-bold block uppercase">Dinner:</span>
                <span className="font-bold text-gray-800 text-[11px]">{mess.timings.dinner}</span>
              </div>
            </div>
          </div>

          {/* Sunday special teaser */}
          {mess.sundaySpecial && (
            <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs flex items-center gap-1.5 text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">
                <strong>Sunday Feast:</strong> {mess.sundaySpecial}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Buttons footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
        {/* Main "View Menu & Details" with specified button colour */}
        <button
          onClick={() => onViewDetails(mess)}
          style={{ backgroundColor: mess.buttonColor }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md hover:brightness-110 active:scale-98 transition-all cursor-pointer"
        >
          <span>View Menu & Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Quick Trial Booking Button */}
        <button
          onClick={() => onBookTrial(mess)}
          className="py-2.5 px-3 rounded-xl bg-white hover:bg-gray-100 text-[#191919] border border-gray-300 font-bold text-xs sm:text-sm flex items-center gap-1 shadow-xs active:scale-98 transition-all cursor-pointer shrink-0"
          title="Book a free trial meal or reserve seat"
        >
          <Calendar className="w-3.5 h-3.5 text-[#F0442B]" />
          <span className="hidden sm:inline">Book Trial</span>
        </button>
      </div>
    </div>
  );
};

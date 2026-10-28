import React from 'react';
import { X, Scale, Star, CheckCircle, Clock, MapPin, IndianRupee, Users, Sparkles } from 'lucide-react';
import { Mess } from '../types.ts';

interface CompareModalProps {
  comparedMesses: Mess[];
  onClose: () => void;
  onRemoveFromCompare: (messId: string) => void;
  onSelectMessForDetails: (mess: Mess) => void;
  onBookTrial: (mess: Mess) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  comparedMesses,
  onClose,
  onRemoveFromCompare,
  onSelectMessForDetails,
  onBookTrial,
}) => {
  if (comparedMesses.length === 0) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 border-2 border-[#191919]">
          <Scale className="w-12 h-12 text-[#304FFE] mx-auto" />
          <h3 className="text-xl font-black text-gray-900">No Messes Selected for Comparison</h3>
          <p className="text-gray-600 text-sm">
            Select "Compare" on 2 or more mess cards to view their prices, weekly menus, timings, and ratings side-by-side.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#F0442B] text-white font-bold text-sm shadow-md"
          >
            Back to Messes
          </button>
        </div>
      </div>
    );
  }

  // Find best values for visual highlighting
  const lowestPrice = Math.min(...comparedMesses.map((m) => m.monthlyPrice));
  const highestRating = Math.max(...comparedMesses.map((m) => m.rating));
  const maxSeats = Math.max(...comparedMesses.map((m) => m.availableSeats));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#FFF4E3] rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl border-2 border-[#191919] flex flex-col my-auto">
        {/* Header */}
        <div className="bg-[#191919] text-white p-5 sm:p-6 relative border-b-2 border-[#304FFE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#304FFE] text-white">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Side-by-Side Mess Comparison
              </h2>
              <p className="text-xs text-[#FFD400] font-bold">
                Comparing {comparedMesses.length} messes in Kasba Bawda, Kolhapur
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

        {/* Comparison Table Grid */}
        <div className="p-4 sm:p-6 overflow-x-auto overflow-y-auto flex-1">
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${comparedMesses.length}, minmax(260px, 1fr))`,
            }}
          >
            {comparedMesses.map((mess) => {
              const isBestPrice = mess.monthlyPrice === lowestPrice;
              const isBestRating = mess.rating === highestRating;

              return (
                <div
                  key={mess.id}
                  className="bg-white rounded-2xl border-2 border-[#e6dbc9] p-5 flex flex-col justify-between shadow-md relative"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => onRemoveFromCompare(mess.id)}
                    className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 transition-colors"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="space-y-4">
                    {/* Header info */}
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                        {mess.category}
                      </span>
                      <h3 className="text-lg font-black text-[#191919] mt-1 pr-6">{mess.name}</h3>
                      <p className="text-xs text-gray-500 line-clamp-1">{mess.location}</p>
                    </div>

                    {/* Monthly Price with best value highlight */}
                    <div
                      className={`p-3 rounded-xl border ${
                        isBestPrice
                          ? 'bg-emerald-50 border-emerald-300'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-bold">Monthly Price:</span>
                        {isBestPrice && (
                          <span className="text-[10px] font-black uppercase bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                            Lowest Price!
                          </span>
                        )}
                      </div>
                      <div className="text-2xl font-black text-[#191919] mt-0.5">
                        ₹{mess.monthlyPrice.toLocaleString()}
                      </div>
                      <span className="text-[11px] text-gray-500">
                        {mess.dailyRate ? `approx ₹${mess.dailyRate}/thali` : 'Per month'}
                      </span>
                    </div>

                    {/* Rating */}
                    <div
                      className={`p-3 rounded-xl border ${
                        isBestRating
                          ? 'bg-amber-50 border-amber-300'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-bold">Student Rating:</span>
                        {isBestRating && (
                          <span className="text-[10px] font-black uppercase bg-amber-500 text-white px-1.5 py-0.5 rounded">
                            Top Rated!
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Star className="w-5 h-5 fill-[#FFD400] text-[#FFD400]" />
                        <span className="text-xl font-black text-gray-900">{mess.rating}</span>
                        <span className="text-xs text-gray-500">({mess.reviewsCount} reviews)</span>
                      </div>
                    </div>

                    {/* Available Seats */}
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                      <span className="text-xs text-gray-500 font-bold block mb-1">
                        Seat Availability:
                      </span>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#19B783]" />
                        <span className="text-sm font-black text-gray-800">
                          {mess.availableSeats} seats left
                        </span>
                        <span className="text-xs text-gray-500">(Total {mess.totalSeats})</span>
                      </div>
                    </div>

                    {/* Distance from Campus */}
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                      <span className="text-xs text-gray-500 font-bold block mb-1">
                        Distance from Campus:
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
                        <MapPin className="w-3.5 h-3.5 text-[#F0442B]" />
                        <span>{mess.distanceText}</span>
                      </div>
                    </div>

                    {/* Diet & Specialities */}
                    <div className="space-y-1.5 text-xs">
                      <span className="text-gray-500 font-bold block">Diet & Cuisine:</span>
                      <div className="font-bold text-gray-800">
                        {mess.dietType} • {mess.cuisine}
                      </div>

                      <span className="text-gray-500 font-bold block pt-1">Speciality Dishes:</span>
                      <div className="flex flex-wrap gap-1">
                        {mess.speciality.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-[#FFF4E3] border border-[#e8d7be] rounded text-[11px] text-gray-800"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Timings */}
                    <div className="space-y-1 text-xs">
                      <span className="text-gray-500 font-bold block">Meal Timings:</span>
                      <div className="flex items-center justify-between text-gray-700">
                        <span>Lunch:</span>
                        <span className="font-bold">{mess.timings.lunch}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-700">
                        <span>Dinner:</span>
                        <span className="font-bold">{mess.timings.dinner}</span>
                      </div>
                    </div>

                    {/* Sunday Special */}
                    {mess.sundaySpecial && (
                      <div className="p-2.5 rounded-lg bg-[#FFD400]/20 border border-[#FFD400] text-xs">
                        <span className="font-extrabold text-[#191919] block mb-0.5">
                          Sunday Feast:
                        </span>
                        <span className="text-gray-800 font-medium">{mess.sundaySpecial}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectMessForDetails(mess);
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#191919] hover:bg-[#333333] text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      View Weekly Menu
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onBookTrial(mess);
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#F0442B] hover:bg-[#d93821] text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      Book Free Trial
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-[#e5d8c6] p-4 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs sm:text-sm"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

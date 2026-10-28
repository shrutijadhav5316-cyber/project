import React from 'react';
import { SlidersHorizontal, ArrowUpDown, IndianRupee, Users, RotateCcw, Check } from 'lucide-react';

interface FilterBarProps {
  sortBy: 'rating' | 'price' | 'distance' | 'none';
  onSortChange: (sort: 'rating' | 'price' | 'distance' | 'none') => void;
  maxBudget: number;
  onBudgetChange: (budget: number) => void;
  cuisineFilter: 'All' | 'Maharashtrian';
  onCuisineChange: (cuisine: 'All' | 'Maharashtrian') => void;
  dietFilter: 'All' | 'Veg' | 'Veg & Non-Veg';
  onDietChange: (diet: 'All' | 'Veg' | 'Veg & Non-Veg') => void;
  seatsOnly: boolean;
  onSeatsOnlyChange: (seatsOnly: boolean) => void;
  resultsCount: number;
  totalMesses: number;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  sortBy,
  onSortChange,
  maxBudget,
  onBudgetChange,
  cuisineFilter,
  onCuisineChange,
  dietFilter,
  onDietChange,
  seatsOnly,
  onSeatsOnlyChange,
  resultsCount,
  totalMesses,
  onReset,
}) => {
  return (
    <div className="bg-white border-y border-[#e2d5c3] shadow-md sticky top-20 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Top/Left Row: Sort Controls & Cuisines */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#F0442B]" />
              <span>Sort:</span>
            </span>

            {/* Sort by Rating */}
            <button
              onClick={() => onSortChange(sortBy === 'rating' ? 'none' : 'rating')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                sortBy === 'rating'
                  ? 'bg-[#19B783] text-white border-[#19B783] shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <span>★ Rating</span>
              {sortBy === 'rating' && <Check className="w-3.5 h-3.5" />}
            </button>

            {/* Sort by Price */}
            <button
              onClick={() => onSortChange(sortBy === 'price' ? 'none' : 'price')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                sortBy === 'price'
                  ? 'bg-[#304FFE] text-white border-[#304FFE] shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <span>₹ Price (Low to High)</span>
              {sortBy === 'price' && <Check className="w-3.5 h-3.5" />}
            </button>

            {/* Sort by Distance */}
            <button
              onClick={() => onSortChange(sortBy === 'distance' ? 'none' : 'distance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                sortBy === 'distance'
                  ? 'bg-[#F0442B] text-white border-[#F0442B] shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
              title="Sorts by proximity to college campus (excludes messes with distance unavailable)"
            >
              <span>📍 Distance (Nearest)</span>
              {sortBy === 'distance' && <Check className="w-3.5 h-3.5" />}
            </button>

            <div className="hidden sm:block h-5 w-[1px] bg-gray-300 mx-1" />

            {/* Cuisine Filter */}
            <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
              <button
                onClick={() => onCuisineChange('All')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  cuisineFilter === 'All'
                    ? 'bg-[#191919] text-white shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                All
              </button>
              <button
                onClick={() => onCuisineChange('Maharashtrian')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  cuisineFilter === 'Maharashtrian'
                    ? 'bg-[#F0442B] text-white shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Maharashtrian
              </button>
            </div>

            {/* Diet Filter Chips */}
            <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
              <button
                onClick={() => onDietChange('All')}
                className={`px-2 py-1 rounded-md text-xs font-semibold ${
                  dietFilter === 'All' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
                }`}
              >
                All Diets
              </button>
              <button
                onClick={() => onDietChange('Veg')}
                className={`px-2 py-1 rounded-md text-xs font-semibold ${
                  dietFilter === 'Veg' ? 'bg-[#19B783] text-white shadow-xs' : 'text-gray-500'
                }`}
              >
                Pure Veg
              </button>
              <button
                onClick={() => onDietChange('Veg & Non-Veg')}
                className={`px-2 py-1 rounded-md text-xs font-semibold ${
                  dietFilter === 'Veg & Non-Veg' ? 'bg-[#7C3AED] text-white shadow-xs' : 'text-gray-500'
                }`}
              >
                Non-Veg
              </button>
            </div>
          </div>

          {/* Right Section: Budget Slider, Seats Toggle & Count */}
          <div className="flex flex-wrap items-center gap-4 lg:gap-6 justify-between lg:justify-end">
            {/* Monthly Budget Slider */}
            <div className="flex items-center gap-3 bg-[#FFF4E3] px-3.5 py-1.5 rounded-xl border border-[#e2d5c3]">
              <div className="text-xs">
                <span className="text-gray-500 font-medium block">Monthly Budget:</span>
                <span className="font-extrabold text-[#F0442B] text-sm">
                  Max ₹{maxBudget.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max="5000"
                step="100"
                value={maxBudget}
                onChange={(e) => onBudgetChange(Number(e.target.value))}
                className="w-24 sm:w-32 accent-[#F0442B] cursor-pointer"
                title={`Budget limit: ₹${maxBudget}`}
              />
            </div>

            {/* Seats Available Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200 transition-colors">
              <input
                type="checkbox"
                checked={seatsOnly}
                onChange={(e) => onSeatsOnlyChange(e.target.checked)}
                className="w-4 h-4 rounded text-[#19B783] accent-[#19B783] cursor-pointer"
              />
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#19B783]" />
                <span>Seats Available</span>
              </span>
            </label>

            {/* Results Count & Reset */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-1 rounded-md bg-[#191919] text-[#FFF4E3]">
                {resultsCount} of {totalMesses} Messes
              </span>

              {(sortBy !== 'none' ||
                maxBudget < 5000 ||
                cuisineFilter !== 'All' ||
                dietFilter !== 'All' ||
                seatsOnly) && (
                <button
                  onClick={onReset}
                  className="p-1.5 rounded-md hover:bg-gray-200 text-gray-500 hover:text-black transition-colors"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

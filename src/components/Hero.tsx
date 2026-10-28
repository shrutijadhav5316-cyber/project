import React from 'react';
import { Search, Utensils, IndianRupee, Star, Scale, Sparkles, MapPin } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  onQuickFilter: (keyword: string) => void;
  totalMesses: number;
  minPrice: number;
  avgRating: number;
  onCompareCardClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onQuickFilter,
  totalMesses,
  minPrice,
  avgRating,
  onCompareCardClick,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <section className="bg-[#191919] text-[#FFF4E3] pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#2d2d2d] relative overflow-hidden">
      {/* Background ambient lighting accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#F0442B]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-[#304FFE]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
        {/* Left Content Area */}
        <div className="lg:col-span-7 space-y-6">
          {/* Yellow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFD400] text-[#191919] text-xs font-black tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#191919]" />
            <span>FOR COLLEGE STUDENTS</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FFF4E3] leading-[1.12]">
            Find a mess that{' '}
            <span className="italic text-[#F0442B] underline decoration-[#FFD400]/40 decoration-wavy underline-offset-4">
              feels like home.
            </span>
          </h1>

          {/* Description */}
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Discover nearby messes with full menu, pricing, timings, and honest student reviews — all in one place. Stop eating bad food.
          </p>

          {/* Search Bar Form */}
          <form onSubmit={handleSubmit} className="pt-2">
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5 p-2 bg-[#252525] border-2 border-[#333333] focus-within:border-[#F0442B] rounded-2xl shadow-xl transition-all">
              <div className="flex-1 flex items-center px-3 gap-3">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search by name, area, or cuisine..."
                  className="w-full bg-transparent text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none py-2"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#F0442B] hover:bg-[#d93821] text-white font-black text-sm sm:text-base tracking-wide transition-all shadow-md active:scale-98 shrink-0 cursor-pointer"
              >
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-gray-300">
            <span className="text-gray-400 font-medium">Quick find:</span>
            {[
              'Bhakri & Pithla',
              'Gavran Thali',
              'Near Campus (<200m)',
              'Bharli Vangi',
              'Pure Veg',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => onQuickFilter(chip)}
                className="px-2.5 py-1 rounded-lg bg-[#282828] hover:bg-[#333333] hover:text-[#FFD400] text-gray-300 border border-gray-700 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Location context */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <MapPin className="w-3.5 h-3.5 text-[#F0442B]" />
            <span>Targeting Kasba Bawda campus area, Kolhapur</span>
          </div>
        </div>

        {/* Right Side: 2x2 Statistic Cards */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          {/* Card 1: Food Icon - Orange */}
          <div className="bg-[#F0442B] rounded-2xl p-5 text-white shadow-lg flex flex-col justify-between h-44 hover:-translate-y-1 transition-transform group cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs group-hover:scale-110 transition-transform">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-3xl font-black tracking-tight">{totalMesses} Messes</div>
              <p className="text-white/90 text-xs font-semibold mt-1">Maharashtrian near campus</p>
            </div>
          </div>

          {/* Card 2: Money Icon - Blue */}
          <div className="bg-[#304FFE] rounded-2xl p-5 text-white shadow-lg flex flex-col justify-between h-44 hover:-translate-y-1 transition-transform group cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs group-hover:scale-110 transition-transform">
              <IndianRupee className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-3xl font-black tracking-tight">₹{minPrice.toLocaleString()}+</div>
              <p className="text-white/90 text-xs font-semibold mt-1">Starting monthly</p>
            </div>
          </div>

          {/* Card 3: Star Icon - Green */}
          <div className="bg-[#19B783] rounded-2xl p-5 text-white shadow-lg flex flex-col justify-between h-44 hover:-translate-y-1 transition-transform group cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <div className="text-3xl font-black tracking-tight">{avgRating} Avg</div>
              <p className="text-white/90 text-xs font-semibold mt-1">Student rating</p>
            </div>
          </div>

          {/* Card 4: Compare Icon - Yellow */}
          <div 
            onClick={onCompareCardClick}
            className="bg-[#FFD400] rounded-2xl p-5 text-[#191919] shadow-lg flex flex-col justify-between h-44 hover:-translate-y-1 transition-transform group cursor-pointer border-2 border-transparent hover:border-[#191919]"
            title="Click to compare messes"
          >
            <div className="w-11 h-11 rounded-xl bg-black/10 flex items-center justify-center backdrop-blur-xs group-hover:scale-110 transition-transform">
              <Scale className="w-6 h-6 text-[#191919]" />
            </div>
            <div>
              <div className="text-3xl font-black tracking-tight">Compare</div>
              <p className="text-[#191919]/90 text-xs font-bold mt-1">Side-by-side messes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

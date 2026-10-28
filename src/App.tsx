/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  UtensilsCrossed, 
  MapPin, 
  PhoneCall, 
  Scale, 
  Sparkles, 
  Info, 
  AlertCircle,
  GraduationCap,
  ShieldCheck,
  ChevronUp
} from 'lucide-react';
import { Mess, OwnerUser } from './types.ts';
import { INITIAL_MESSES } from './data/initialMesses.ts';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { FilterBar } from './components/FilterBar.tsx';
import { MessCard } from './components/MessCard.tsx';
import { MessDetailModal } from './components/MessDetailModal.tsx';
import { CompareModal } from './components/CompareModal.tsx';
import { BookTrialModal } from './components/BookTrialModal.tsx';
import { OwnerDashboardModal } from './components/OwnerDashboardModal.tsx';

export default function App() {
  const [messes, setMesses] = useState<Mess[]>(INITIAL_MESSES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filters & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'distance' | 'none'>('none');
  const [maxBudget, setMaxBudget] = useState<number>(5000);
  const [cuisineFilter, setCuisineFilter] = useState<'All' | 'Maharashtrian'>('All');
  const [dietFilter, setDietFilter] = useState<'All' | 'Veg' | 'Veg & Non-Veg'>('All');
  const [seatsOnly, setSeatsOnly] = useState<boolean>(false);

  // Compare state
  const [comparedMessIds, setComparedMessIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Modals state
  const [selectedMessForDetails, setSelectedMessForDetails] = useState<Mess | null>(null);
  const [selectedMessForTrial, setSelectedMessForTrial] = useState<Mess | null>(null);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);

  // Current logged in owner
  const [currentOwner, setCurrentOwner] = useState<OwnerUser | null>(null);

  // Reference for scrolling to mess listings
  const messesSectionRef = useRef<HTMLDivElement>(null);

  // Fetch messes from backend API
  const fetchMesses = async () => {
    try {
      const res = await fetch('/api/messes');
      if (res.ok) {
        const data = await res.json();
        if (data.messes && data.messes.length > 0) {
          setMesses(data.messes);
        }
      }
    } catch (err) {
      console.warn('Backend not responding yet, using local dataset', err);
    }
  };

  useEffect(() => {
    fetchMesses();
  }, []);

  // Filter & Sort calculation
  const filteredMesses = useMemo(() => {
    let list = [...messes];

    // Search query: name, area/location, speciality, tags, cuisine
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.location.toLowerCase().includes(q) ||
          m.cuisine.toLowerCase().includes(q) ||
          m.speciality.some((s) => s.toLowerCase().includes(q)) ||
          m.tags.some((t) => t.toLowerCase().includes(q)) ||
          (m.sundaySpecial && m.sundaySpecial.toLowerCase().includes(q))
      );
    }

    // Monthly budget filter
    list = list.filter((m) => m.monthlyPrice <= maxBudget);

    // Cuisine filter
    if (cuisineFilter !== 'All') {
      list = list.filter(
        (m) => m.cuisine.toLowerCase() === cuisineFilter.toLowerCase()
      );
    }

    // Diet filter
    if (dietFilter !== 'All') {
      list = list.filter((m) => m.dietType === dietFilter);
    }

    // Available seats filter
    if (seatsOnly) {
      list = list.filter((m) => m.availableSeats > 0);
    }

    // Sorting
    if (sortBy === 'rating') {
      // Highest to lowest
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price') {
      // Lowest to highest
      list.sort((a, b) => a.monthlyPrice - b.monthlyPrice);
    } else if (sortBy === 'distance') {
      // Nearest to farthest when valid distances are available.
      // If a distance is unavailable, display "Distance unavailable" and exclude that listing from distance-based sorting.
      list = list.filter((m) => m.distanceMeters !== null);
      list.sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity));
    }

    return list;
  }, [messes, searchQuery, maxBudget, cuisineFilter, dietFilter, seatsOnly, sortBy]);

  // Derived stats for Hero section
  const totalMessesCount = messes.length;
  const minPrice = useMemo(() => {
    if (messes.length === 0) return 2300;
    return Math.min(...messes.map((m) => m.monthlyPrice));
  }, [messes]);

  const avgRating = useMemo(() => {
    if (messes.length === 0) return 4.2;
    const sum = messes.reduce((acc, m) => acc + m.rating, 0);
    return Number((sum / messes.length).toFixed(1));
  }, [messes]);

  // Scroll to Discover
  const handleDiscoverClick = () => {
    messesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Quick filter chips from Hero
  const handleQuickFilter = (keyword: string) => {
    if (keyword === 'Pure Veg') {
      setDietFilter('Veg');
    } else if (keyword === 'Near Campus (<200m)') {
      setSortBy('distance');
    } else {
      setSearchQuery(keyword);
    }
    messesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSortBy('none');
    setMaxBudget(5000);
    setCuisineFilter('All');
    setDietFilter('All');
    setSeatsOnly(false);
  };

  // Toggle compare selection
  const handleToggleCompare = (mess: Mess) => {
    setComparedMessIds((prev) => {
      if (prev.includes(mess.id)) {
        return prev.filter((id) => id !== mess.id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 messes simultaneously.');
        return prev;
      }
      return [...prev, mess.id];
    });
  };

  const comparedMesses = useMemo(() => {
    return messes.filter((m) => comparedMessIds.includes(m.id));
  }, [messes, comparedMessIds]);

  // Update mess in state when updated via modal / review / owner
  const handleMessUpdated = (updatedMess: Mess) => {
    setMesses((prev) =>
      prev.map((m) => (m.id === updatedMess.id ? updatedMess : m))
    );
    if (selectedMessForDetails?.id === updatedMess.id) {
      setSelectedMessForDetails(updatedMess);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF4E3] text-[#191919] flex flex-col font-sans selection:bg-[#F0442B] selection:text-white">
      {/* 1. Header / Navbar */}
      <Navbar
        onDiscoverClick={handleDiscoverClick}
        onOwnerLoginClick={() => setIsOwnerModalOpen(true)}
        compareCount={comparedMessIds.length}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        currentOwner={currentOwner}
        onOwnerLogout={() => setCurrentOwner(null)}
      />

      {/* 2. Hero Section */}
      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleDiscoverClick}
        onQuickFilter={handleQuickFilter}
        totalMesses={totalMessesCount}
        minPrice={minPrice}
        avgRating={avgRating}
        onCompareCardClick={() => {
          if (comparedMessIds.length === 0) {
            // Pre-select first 2 messes for comparison preview
            setComparedMessIds([messes[0]?.id, messes[1]?.id].filter(Boolean));
          }
          setIsCompareModalOpen(true);
        }}
      />

      {/* 3. Search and Filter Bar */}
      <FilterBar
        sortBy={sortBy}
        onSortChange={setSortBy}
        maxBudget={maxBudget}
        onBudgetChange={setMaxBudget}
        cuisineFilter={cuisineFilter}
        onCuisineChange={setCuisineFilter}
        dietFilter={dietFilter}
        onDietChange={setDietFilter}
        seatsOnly={seatsOnly}
        onSeatsOnlyChange={setSeatsOnly}
        resultsCount={filteredMesses.length}
        totalMesses={messes.length}
        onReset={handleResetFilters}
      />

      {/* 4. Mess Listings Section */}
      <main ref={messesSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Section Heading & context */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F0442B]" />
              <h2 className="text-2xl sm:text-3xl font-black text-[#191919] tracking-tight">
                Verified Kasba Bawda Messes
              </h2>
            </div>
            <p className="text-sm text-gray-700 mt-1 font-medium">
              Compare Maharashtrian bhojanalayas, check daily menus, and see real-time seat availability.
            </p>
          </div>

          {sortBy === 'distance' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-100 text-orange-900 text-xs font-bold border border-orange-200">
              <Info className="w-4 h-4 text-[#F0442B] shrink-0" />
              <span>Sorting by distance to college campus (listings without distance excluded)</span>
            </div>
          )}
        </div>

        {/* Mess Cards Grid */}
        {filteredMesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredMesses.map((mess) => (
              <MessCard
                key={mess.id}
                mess={mess}
                onViewDetails={(m) => setSelectedMessForDetails(m)}
                onBookTrial={(m) => setSelectedMessForTrial(m)}
                isCompared={comparedMessIds.includes(mess.id)}
                onToggleCompare={handleToggleCompare}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-[#d8c7b3] max-w-xl mx-auto my-12 space-y-4">
            <UtensilsCrossed className="w-12 h-12 text-[#F0442B] mx-auto opacity-70" />
            <h3 className="text-xl font-black text-gray-900">No Messes Matched Your Search</h3>
            <p className="text-sm text-gray-700 font-medium leading-relaxed">
              We couldn't find any mess matching your current budget or filters. Try adjusting your budget slider or clearing search terms.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-xl bg-[#F0442B] hover:bg-[#d93821] text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* Floating Bottom Comparison Bar */}
      {comparedMessIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#191919] text-white px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-[#304FFE] flex items-center gap-4 animate-slideUp">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-[#FFD400]" />
            <span className="text-sm font-black">
              {comparedMessIds.length} {comparedMessIds.length === 1 ? 'Mess' : 'Messes'} selected
            </span>
          </div>

          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-[#304FFE] hover:bg-[#253ec9] text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Compare Side-by-Side
          </button>

          <button
            onClick={() => setComparedMessIds([])}
            className="text-xs text-gray-400 hover:text-white font-semibold underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* 5. Mess Detail & Weekly Menu Modal */}
      {selectedMessForDetails && (
        <MessDetailModal
          mess={selectedMessForDetails}
          onClose={() => setSelectedMessForDetails(null)}
          onBookTrial={(mess) => {
            setSelectedMessForTrial(mess);
          }}
          onReviewSubmitted={(updated) => {
            handleMessUpdated(updated);
          }}
        />
      )}

      {/* 6. Side-by-Side Comparison Modal */}
      {isCompareModalOpen && (
        <CompareModal
          comparedMesses={comparedMesses}
          onClose={() => setIsCompareModalOpen(false)}
          onRemoveFromCompare={(id) => {
            setComparedMessIds((prev) => prev.filter((mId) => mId !== id));
          }}
          onSelectMessForDetails={(mess) => {
            setSelectedMessForDetails(mess);
          }}
          onBookTrial={(mess) => {
            setSelectedMessForTrial(mess);
          }}
        />
      )}

      {/* 7. Book Free Trial / Reserve Seat Modal */}
      {selectedMessForTrial && (
        <BookTrialModal
          mess={selectedMessForTrial}
          onClose={() => setSelectedMessForTrial(null)}
          onInquirySubmitted={() => {
            fetchMesses();
          }}
        />
      )}

      {/* 8. Mess Owner Portal & Live Seat Dashboard Modal */}
      <OwnerDashboardModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        allMesses={messes}
        currentOwner={currentOwner}
        onLoginSuccess={(user) => {
          setCurrentOwner(user);
        }}
        onLogout={() => {
          setCurrentOwner(null);
        }}
        onMessUpdated={(updated) => {
          handleMessUpdated(updated);
        }}
      />

      {/* 9. Footer */}
      <footer className="bg-[#191919] text-[#FFF4E3] border-t-2 border-[#F0442B] mt-16 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0442B] flex items-center justify-center text-white">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white">Mess Finding System</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Find your daily meal, sorted. A college mini-project built to help students discover, compare, and connect with authentic Maharashtrian messes in Kasba Bawda, Kolhapur.
            </p>
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#FFD400] block mb-3">
              Popular Kasba Bawda Messes
            </span>
            <ul className="text-xs text-gray-400 space-y-1.5">
              <li>• Annapurna Mess — Kawde Galli (Bhakri & Pithla)</li>
              <li>• Randive Mess — Backside of College (Gavran Chicken Thali)</li>
              <li>• Pingale Mess — Dhangar Galli (Misal & Thalipeeth)</li>
              <li>• Potoba Mess — Near Datta Mandir (Varan Bhaat & Poli)</li>
              <li>• Patil Mess — Opp. Sports Ground (Kolhapuri Rassa)</li>
            </ul>
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#FFD400] block mb-3">
              College Mini-Project
            </span>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Engineered with React, TypeScript, Express, and Tailwind CSS. Features full live seat updater, 7-day menus, trial bookings, and student rating aggregation.
            </p>
            <button
              onClick={() => setIsOwnerModalOpen(true)}
              className="text-xs font-bold text-[#FFD400] hover:underline flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Mess Owner Access Portal</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
          <span>© 2026 Mess Finding System • Kasba Bawda, Kolhapur</span>
          <span>Made for College Students • Stop Eating Bad Food</span>
        </div>
      </footer>
    </div>
  );
}

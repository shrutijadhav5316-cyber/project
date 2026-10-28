import React from 'react';
import { UtensilsCrossed, Sparkles, Scale, ShieldCheck, LogOut } from 'lucide-react';
import { OwnerUser } from '../types.ts';

interface NavbarProps {
  onDiscoverClick: () => void;
  onOwnerLoginClick: () => void;
  compareCount: number;
  onOpenCompare: () => void;
  currentOwner: OwnerUser | null;
  onOwnerLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onDiscoverClick,
  onOwnerLoginClick,
  compareCount,
  onOpenCompare,
  currentOwner,
  onOwnerLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#191919] text-white border-b-2 border-[#F0442B] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div 
          onClick={onDiscoverClick}
          className="flex items-center gap-3.5 cursor-pointer group select-none"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F0442B] via-[#FFD400] to-[#19B783] p-0.5 shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#191919] rounded-[10px] flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-[#FFD400]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-[#FFD400] transition-colors">
                Mess Finding System
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#F0442B] text-white uppercase tracking-wider">
                Kolhapur
              </span>
            </div>
            <p className="text-[11px] font-bold tracking-widest text-[#FFD400] uppercase">
              FIND YOUR DAILY MEAL, SORTED
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Compare Button */}
          {compareCount > 0 && (
            <button
              onClick={onOpenCompare}
              className="relative flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg bg-[#304FFE] hover:bg-[#253ec9] text-white text-xs sm:text-sm font-bold transition-all shadow-md animate-pulse"
              title="Compare selected messes side-by-side"
            >
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">Compare</span>
              <span className="bg-white text-[#304FFE] w-5 h-5 rounded-full flex items-center justify-center text-xs font-black">
                {compareCount}
              </span>
            </button>
          )}

          {/* Discover Button */}
          <button
            onClick={onDiscoverClick}
            className="flex items-center gap-1.5 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-[#F0442B] hover:bg-[#d93821] text-white text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Discover</span>
          </button>

          {/* Owner Portal / Login Button */}
          {currentOwner ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOwnerLoginClick}
                className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-[#19B783] hover:bg-[#149a6d] text-white text-xs sm:text-sm font-bold transition-all shadow-md"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden md:inline">Dashboard:</span>
                <span className="max-w-[120px] truncate">{currentOwner.messName}</span>
              </button>
              <button
                onClick={onOwnerLogout}
                className="p-2 rounded-lg bg-[#2a2a2a] hover:bg-[#383838] text-gray-300 hover:text-white transition-colors"
                title="Log out of Mess Owner Portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOwnerLoginClick}
              className="flex items-center gap-1.5 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-[#FFD400] hover:bg-[#e6bf00] text-[#191919] text-xs sm:text-sm font-black transition-all shadow-md active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-[#191919]" />
              <span>Owner Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

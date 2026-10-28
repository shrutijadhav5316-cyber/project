export interface Review {
  id: string;
  studentName: string;
  college: string;
  rating: number;
  comment: string;
  date: string;
  ownerReply?: string;
}

export interface DayMenu {
  breakfast?: string;
  lunch: string;
  dinner: string;
  specialItem?: string;
}

export interface Mess {
  id: string;
  name: string;
  category: string;
  monthlyPrice: number;
  dailyRate?: number;
  rating: number;
  reviewsCount: number;
  availableSeats: number;
  totalSeats: number;
  location: string;
  distanceMeters: number | null;
  distanceText: string;
  speciality: string[];
  tags: string[];
  cuisine: string;
  dietType: 'Veg' | 'Veg & Non-Veg';
  timings: {
    breakfast?: string;
    lunch: string;
    dinner: string;
  };
  buttonColor: string; // e.g. '#F0442B', '#7C3AED', etc.
  phone: string;
  ownerName: string;
  ownerEmail: string;
  description: string;
  sundaySpecial: string;
  notice?: string;
  weeklyMenu: Record<string, DayMenu>;
  reviews: Review[];
}

export interface Inquiry {
  id: string;
  messId: string;
  messName: string;
  studentName: string;
  phone: string;
  email?: string;
  preferredPlan: 'Monthly Mess' | 'Trial Meal' | 'Tiffin Service';
  preferredDate: string;
  status: 'Pending' | 'Contacted' | 'Admitted';
  createdAt: string;
  notes?: string;
}

export interface OwnerUser {
  id: string;
  email: string;
  messId: string;
  name: string;
  messName: string;
}

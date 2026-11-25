export interface Coach {
  _id: string;
  name: string;
  experience: number;
  expertise: string;
  charge: number;
  bio?: string;
  certifications?: string[];
  specialties?: string[];
  imageUrl?: string;
  rating?: number;
  clients?: number;
  status?: string;
}

export interface CoachSelectModalProps {
  open: boolean;
  eliteBasePrice: number;
  onClose: () => void;
  onProceedToPayment: (coach: Coach, totalAmount: number) => void;
}

export const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

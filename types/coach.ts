type Coach = {
  _id: string;
  fullName: string;
  profileImage: string;
  location: string;
  experienceYears: number;
  specialties: string; 
  trainingTypes: string[];
  pricing: {
    monthly: number;
  };
};

"use client";
import { useRouter } from "next/navigation";

interface RoleSelectionProps {
  email: string;
}
// RoleSelectionModal.tsx
export default function RoleSelectionModal({ email }: RoleSelectionProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-white/10 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
        <h2 className="mb-2 text-2xl font-bold text-white">Welcome to Flexify!</h2>
        <p className="mb-8 text-gray-400">How would you like to join us?</p>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => router.push(`/user-form?email=${email}`)}
            className="p-6 border border-orange-500 rounded-xl hover:bg-orange-500 transition-all group"
          >
            <span className="block mb-2 text-3xl">🏋️‍♂️</span>
            <span className="font-bold text-white">As a User</span>
          </button>

          <button 
            onClick={() => router.push(`/apply-coach?email=${email}`)}
            className="p-6 border border-blue-500 rounded-xl hover:bg-blue-500 transition-all group"
          >
            <span className="block mb-2 text-3xl">📋</span>
            <span className="font-bold text-white">As a Coach</span>
          </button>
        </div>
      </div>
    </div>
  );
}
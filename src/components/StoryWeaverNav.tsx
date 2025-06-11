import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';

export default function StoryWeaverNav() {
  const { user } = useAuth();

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav className="w-full bg-[#0F1A24] flex justify-between items-center px-[40px] py-[12px] border-b-[0.5px] border-[#E5E8EB] font-[var(--font-geist-sans)]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {/* Placeholder for logo icon */}
          <div className="w-4 h-4 bg-white rounded mr-1" />
          <span className="font-bold text-[18px] text-white tracking-wide">StoryWeaver</span>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-9 h-10">
          <Link href="/" className="font-medium text-[14px] text-white px-2 rounded-md transition-colors leading-10 hover:bg-white/10">Home</Link>
          <Link href="/stories" className="font-medium text-[14px] text-white px-2 rounded-md transition-colors leading-10 hover:bg-white/10">My Stories</Link>
          {user && (
            <button 
              onClick={handleLogout}
              className="font-medium text-[14px] text-white px-2 rounded-md transition-colors leading-10 hover:bg-white/10"
            >
              Logout
            </button>
          )}
        </div>
        <div className="bg-white rounded-[12px] w-10 h-10 flex items-center justify-center overflow-hidden">
          {/* Placeholder for avatar */}
          <div className="w-5 h-5 rounded-full bg-[#E5E8EB]" />
        </div>
      </div>
    </nav>
  );
}

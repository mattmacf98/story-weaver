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
          <img src="/icon.png" alt="StoryWeaver Logo" className="w-12 h-12 mr-1 rounded-md" />
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
      </div>
    </nav>
  );
}

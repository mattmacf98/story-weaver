"use client";

import StoryWeaverNav from "@/components/StoryWeaverNav";
import StoryTable from "@/components/stories/StoryTable";
import ToastMessageBar from "@/components/toastMessages/ToastMessageBar";
import { useAuth } from "@/contexts/AuthContext";
import { useStoryWeaver } from "@/contexts/StoryWeaverContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Stories() {
  const { getStories } = useStoryWeaver();
  const [stories, setStories] = useState<any[]>([]);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchStories = async () => {
      const authToken = await user?.getIdToken();
      const stories = await getStories(authToken);
      setStories(stories);
    };
    if (user) {
      fetchStories();
    }
  }, [user]);
  
  return (
    <div className="min-h-screen bg-[#0F1A24]">
      <StoryWeaverNav />
      <ToastMessageBar />
      <main className="flex flex-col items-center px-4 py-10">
        <div className="pb-10 w-full max-w-5xl">
          <h1 className="text-3xl font-bold text-white">My Stories</h1>
        </div>
        <StoryTable stories={stories} />
      </main>
    </div>
  );
}   
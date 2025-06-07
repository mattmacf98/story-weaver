"use client";

import StoryWeaverNav from "@/components/StoryWeaverNav";
import StoryTable from "@/components/stories/StoryTable";
import { useStoryWeaver } from "@/contexts/StoryWeaverContext";
import { useEffect, useState } from "react";

export default function Stories() {
  const { getStories } = useStoryWeaver();
  const [stories, setStories] = useState<any[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      const stories = await getStories();
      setStories(stories.filter((story: any) => story.prevStoryId == null));
    };
    fetchStories();
  }, []);

  return (
    <div className="min-h-screen bg-[#0F1A24]">
      <StoryWeaverNav />
      <main className="flex flex-col items-center px-4 py-10">
        <div className="pb-10 w-full max-w-5xl">
          <h1 className="text-3xl font-bold text-white">My Stories</h1>
        </div>
        <StoryTable stories={stories} />
      </main>
    </div>
  );
}   
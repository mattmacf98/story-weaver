"use client";

import { useAuth } from "@/contexts/AuthContext";
import StoryWeaverNav from "../components/StoryWeaverNav";
import { Audience, Genre, POV, StoryConfig, useStoryWeaver } from "@/contexts/StoryWeaverContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ToastMessageBar from "../components/toastMessages/ToastMessageBar";
import { useToastMessage } from "@/contexts/ToastMessageContext";

const defaultConfig: StoryConfig = {
  audience: Audience.Children,
  genre: Genre.Fantasy,
  pov: POV.ThirdPerson,
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const { addToastMessage } = useToastMessage();
  const [storyCreating, setStoryCreating] = useState(false);
  const { startStory, getStories } = useStoryWeaver();
  const { user, loading } = useAuth();
  const [config, setConfig] = useState<StoryConfig>(defaultConfig);
  const [stories, setStories] = useState<any[]>([]);
  const router = useRouter();

  const handleStartStory = async () => {
    setStoryCreating(true);
    const authToken = await user?.getIdToken();
    const { success, message } = await startStory(prompt, config, undefined, authToken);
    setStoryCreating(false);
    if (success) {
      addToastMessage(message, "success");
    } else {
      addToastMessage(message, "error");
    }
  }

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchStories = async () => {
      const authToken = await user?.getIdToken();
      const stories = await getStories(authToken);
      console.log(stories);
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
        {/* Hero Section */}
        <section className="w-full max-w-7xl rounded-xl shadow-lg py-48 px-12 flex flex-col items-center mb-10 bg-[url('/hero-backdrop.png')] bg-cover bg-center">
          <h1 className="text-4xl font-bold text-center text-white mb-4" style={{letterSpacing: '-0.04em'}}>Bring Your Story to Life</h1>
          <p className="text-lg text-center text-white mb-8">Start an AI-generated story and watch it evolve into a video.</p>
          {/* Prompt Input Area */}
          <div className="w-full max-w-2xl mx-auto relative">
            <div className="flex items-center bg-[#172633] rounded-xl overflow-hidden mb-4 p-2">
              {/* Placeholder for input (not interactive) */}
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-transparent text-white px-4 py-3 outline-none placeholder:text-[#8FADCC] pr-[120px]"
                placeholder="Type your story prompt..."
              />
              <button disabled={storyCreating} className="bg-[#0D80F2] text-white font-bold w-48 p-2 rounded-lg hover:bg-[#106ad6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleStartStory}>Start Story</button>
            </div>
          </div>

          <div className="flex flex-row gap-8 mt-6 bg-[#172633] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <label className="text-white font-medium">Audience:</label>
              <select 
                className="bg-[#172633] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-[#0D80F2]"
                value={config.audience}
                onChange={(e) => setConfig({...config, audience: e.target.value as Audience})}
              >
                {Object.values(Audience).map((audience) => (
                  <option key={audience} value={audience}>{audience}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-white font-medium">Genre:</label>
              <select
                className="bg-[#172633] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-[#0D80F2]"
                value={config.genre}
                onChange={(e) => setConfig({...config, genre: e.target.value as Genre})}
              >
                {Object.values(Genre).map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-white font-medium">POV:</label>
              <select
                className="bg-[#172633] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-[#0D80F2]"
                value={config.pov}
                onChange={(e) => setConfig({...config, pov: e.target.value as POV})}
              >
                {Object.values(POV).map((pov) => (
                  <option key={pov} value={pov}>{pov}</option>
                ))}
              </select>
            </div>
          </div>

        </section>
        {/* Continue Your Story Section */}
        <section className="w-full max-w-7xl flex flex-col mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Continue Your Story</h2>
          <div className="flex flex-row gap-6">
            {/* Story Card 1 */}
            {stories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3).map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const StoryCard = ({story}: {story: any}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { getImageUrl } = useStoryWeaver();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchImageUrl = async () => {
      const authToken = await user?.getIdToken();
      console.log(story);
      const imageUrl = await getImageUrl(story.images.images[0].key, authToken);
      setImageUrl(imageUrl);
    }
    fetchImageUrl();
  }, [story]);

  return (
    <div key={story.id} className="bg-white rounded-lg shadow-md p-4 flex-col w-xl h-[400px]" onClick={() => router.push(`/stories/${story.id}`)}>
      <h3 className="text-lg font-semibold text-[#21364A] mb-1">{story.title}</h3>
      <div className="w-full h-80 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={story.title} className="w-full h-full object-contain rounded-lg" />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>
    </div>
  )
}

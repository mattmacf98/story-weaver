import StoryWeaverNav from "../components/StoryWeaverNav";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F1A24]">
      <StoryWeaverNav />
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
                className="w-full bg-transparent text-white px-4 py-3 outline-none placeholder:text-[#8FADCC] pr-[120px]"
                placeholder="Type your story prompt..."
              />
              <button className=" bg-[#0D80F2] text-white font-bold w-48 p-2 rounded-lg hover:bg-[#106ad6] transition-colors">Start Story</button>
            </div>
          </div>
        </section>
        {/* Continue Your Story Section */}
        <section className="w-full max-w-7xl flex flex-col mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Continue Your Story</h2>
          <div className="flex flex-row gap-6">
            {/* Story Card 1 */}
            <div className="bg-white rounded-lg shadow-md p-4 flex-1 min-w-[220px]">
              <div className="w-full h-40 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                {/* Placeholder for story image */}
                <span className="text-gray-400">Image</span>
              </div>
              <h3 className="text-lg font-semibold text-[#21364A] mb-1">The Enchanted Forest</h3>
              <p className="text-sm text-[#8FADCC]">In a mystical forest, a young adventurer discovers a hidden path.</p>
            </div>
            {/* Story Card 2 */}
            <div className="bg-white rounded-lg shadow-md p-4 flex-1 min-w-[220px]">
              <div className="w-full h-40 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-gray-400">Image</span>
              </div>
              <h3 className="text-lg font-semibold text-[#21364A] mb-1">The Lost Princess</h3>
              <p className="text-sm text-[#8FADCC]">A princess, lost in a magical realm, seeks her way back home.</p>
            </div>
            {/* Story Card 3 */}
            <div className="bg-white rounded-lg shadow-md p-4 flex-1 min-w-[220px]">
              <div className="w-full h-40 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-gray-400">Image</span>
              </div>
              <h3 className="text-lg font-semibold text-[#21364A] mb-1">The Dragon's Lair</h3>
              <p className="text-sm text-[#8FADCC]">A brave knight confronts a dragon to protect his kingdom.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

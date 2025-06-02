import StoryWeaverNav from "@/components/StoryWeaverNav";


export default function PublishStoryPage({ params }: { params: { id: string } }) {
    return (
      <div className="min-h-screen bg-[#0F1A24]">
        <StoryWeaverNav />
        <main className="flex flex-col items-center px-4 py-10">
            <div className="pb-10 w-full max-w-5xl">
                <h1 className="text-3xl font-bold text-white">Publish Your Story</h1>
                <div className="mt-8 bg-[#172633] rounded-lg p-6">
                    <video 
                        className="w-full rounded-lg"
                        controls
                        poster="/video-placeholder.png"
                    >
                        <source src="/placeholder-video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </main>
      </div>
    );
  }
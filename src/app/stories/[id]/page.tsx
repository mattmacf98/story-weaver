import StoryWeaverNav from "@/components/StoryWeaverNav";
import Link from "next/link";

const story: Story = {
  id: "1",
  title: "The Enchanted Forest",
  createdAt: "2024-01-15",
  storyText: {
    createdAt: "2024-01-15",
    text: "Once upon a time, in a land of enchantment, there was a forest that was filled with magic and wonder. The trees were tall and the plants were lush and green. The animals were friendly and the birds were chirping. The sun was shining and the sky was blue. The Enchanted Forest was a place of magic and wonder.",
  },
  chunks: [
    {
      createdAt: "2024-01-15",
      text: "The Enchanted Forest is a place of magic and wonder.",
    },
  ],
  imagePrompts: [
    {
      createdAt: "2024-01-15",
      text: "The Enchanted Forest is a place of magic and wonder.",
    },
  ],
  summary: {
    createdAt: "2024-01-15",
    text: "The Enchanted Forest is a place of magic and wonder.",
  },
  nextOptions: [
    {
      createdAt: "2024-01-15",
      text: "The Enchanted Forest is a place of magic and wonder.",
    },
  ],
  images: [
    {
      createdAt: "2024-01-15",
      key: "jsadasduasf",
      mimeType: "image/png",
    },
  ],
  audio: [
    {
      createdAt: "2024-01-15",
      key: "jsadasduasf",
      mimeType: "audio/mpeg",
    },
  ],
  video: [
    {
      createdAt: "2024-01-15",
      key: "jsadasduasf",
      mimeType: "video/mp4",
    },
  ],
  finalVideo: {
    createdAt: "2024-01-15",
    key: "jsadasduasf",
    mimeType: "video/mp4",
  },
}

export default function StoryPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-[#0F1A24]">
      <StoryWeaverNav />
      <main className="flex flex-col items-center px-4 py-10">
        <div className="pb-10 w-full max-w-5xl">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-white">{story.title}</h1>
            <Link href={`/stories/publish/${story.id}`} className="px-4 py-2 bg-[#0D80F2] text-white font-bold rounded-lg hover:bg-[#106ad6] transition-colors">
              Publish
            </Link>
          </div>
          <p className="text-slate-400">Story ID: {story.id}</p>
        </div>

        <div className="pb-10 w-full max-w-5xl">
          <h3 className="text-xl font-bold mb-8 text-white">Pipeline Stages</h3>
          <div className="flex flex-col gap-4">
            <PipelineItem stage="Story Generation" completedAt="2024-01-15" />
            <PipelineItem stage="Chunking" completedAt="2024-01-15" />
            <PipelineItem stage="Image Prompts" completedAt="2024-01-15" />
            <PipelineItem stage="Summary" completedAt="2024-01-15" />
            <PipelineItem stage="Next Options" completedAt="2024-01-15" />
            <PipelineItem stage="Image Generation" completedAt="2024-01-15" />
            <PipelineItem stage="Audio Generation" completedAt="2024-01-15" />
            <PipelineItem stage="Video Generation" completedAt="2024-01-15" />
            <PipelineItem stage="Final Video Generation" completedAt="2024-01-15" />
          </div>
        </div>

        <ResourcesSection />
      </main>
    </div>
  );
}

const PipelineItem = ({stage, completedAt}: {stage: string, completedAt: string}) => {
  return (
    <div className="flex flex-row gap-10">
      <div className="flex flex-col items-center">
        <div className="w-[2px] h-8 bg-slate-700"></div>
        <div className="w-2 h-2 bg-white rounded-full"></div>
        <div className="w-[2px] h-8 bg-slate-700"></div>
      </div>
      <div className="flex flex-col">
        <p className="text-white font-bold">{stage}</p>
        <p className="text-slate-400">Completed at {completedAt}</p>
      </div>
    </div>
  )
}

const ResourcesSection = () => {
    return (
        <div className="pb-10 w-full max-w-5xl">
            <h3 className="text-xl font-bold mb-8 text-white">Resources Viewer</h3>
            <div className="flex flex-row gap-4 mb-6">
                <button className="px-4 py-2 text-white bg-[#172633] rounded-lg hover:bg-[#21364A] transition-colors">
                    Story Text
                </button>
                <button className="px-4 py-2 text-white bg-[#172633] rounded-lg hover:bg-[#21364A] transition-colors">
                    Chunks
                </button>
                <button className="px-4 py-2 text-white bg-[#172633] rounded-lg hover:bg-[#21364A] transition-colors">
                    Image Prompts
                </button>
                <button className="px-4 py-2 text-white bg-[#172633] rounded-lg hover:bg-[#21364A] transition-colors">
                    Summary
                </button>
                <button className="px-4 py-2 text-white bg-[#172633] rounded-lg hover:bg-[#21364A] transition-colors">
                    Next Options
                </button>
                <button className="px-4 py-2 text-white bg-[#172633] rounded-lg hover:bg-[#21364A] transition-colors">
                    Images
                </button>
                <button className="px-4 py-2 text-white bg-[#172633] rounded-lg hover:bg-[#21364A] transition-colors">
                    Audio
                </button>
                <button className="px-4 py-2 text-white bg-[#172633] rounded-lg hover:bg-[#21364A] transition-colors">
                    Video
                </button>
            </div>

            <div className="bg-[#172633] rounded-lg p-6">
                {/* Content will change based on selected tab */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#21364A] rounded-lg p-4">
                        <TextResource text="Sample story text or other content..." />
                    </div>
                    <div className="bg-[#21364A] rounded-lg p-4">
                        <TextResource text="More sample content..." />
                    </div>
                </div>
            </div>
        </div>
    )
}


const TextResource = ({text}: {text: string}) => {
    return (
        <div className="flex flex-col">
            <p className="text-slate-400">{text}</p>
        </div>
    )
}

const ImageResource = ({image}: {image: string}) => {
    return (
        <div className="flex flex-col">
            <img src={image} className="w-full h-full object-cover" />
        </div>
    )
}

const AudioResource = ({audio}: {audio: string}) => {
    return (
        <div className="flex flex-col">
            <audio src={audio} controls />
        </div>
    )
}

const VideoResource = ({video}: {video: string}) => {
    return (
        <div className="flex flex-col">
            <video src={video} controls />
        </div>
    )
}
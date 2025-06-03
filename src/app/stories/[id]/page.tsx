"use client";

import StoryWeaverNav from "@/components/StoryWeaverNav";
import { useStoryWeaver } from "@/contexts/StoryWeaverContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

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

export default function StoryPage() {
  const { getStory } = useStoryWeaver();
  const params = useParams();
  const [story, setStory] = useState<any>(null);

  useEffect(() => {
    const fetchStory = async () => {
      const story = await getStory(params.id as string);
      console.log(story);
      setStory(story);
    }
    fetchStory();
  }, [params.id]);

  if (!story) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0F1A24]">
      <StoryWeaverNav />
      <main className="flex flex-col items-center px-4 py-10">
        <div className="pb-10 w-full max-w-5xl">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-white">{story?.title}</h1>
            <Link href={`/stories/publish/${params.id}`} className="px-4 py-2 bg-[#0D80F2] text-white font-bold rounded-lg hover:bg-[#106ad6] transition-colors">
              Publish
            </Link>
          </div>
          <p className="text-slate-400">Story ID: {params.id}</p>
        </div>

        <div className="pb-10 w-full max-w-5xl">
          <h3 className="text-xl font-bold mb-8 text-white">Pipeline Stages</h3>
          <div className="flex flex-col gap-4">
            {story.storyText && 
                <PipelineItem stage="Story Generation" completedAt={story.storyText.last_updated} />
            }
            {story.chunkTexts && 
                <PipelineItem stage="Chunking" completedAt={story.chunkTexts.last_updated} />
            }
            {story.imagePrompts && 
                <PipelineItem stage="Image Prompts" completedAt={story.imagePrompts.last_updated} />
            }
            {story.summary && 
                <PipelineItem stage="Summary" completedAt={story.summary.last_updated} />
            }
            {story.nextOptions && 
                <PipelineItem stage="Next Options" completedAt={story.nextOptions.last_updated} />
            }
            {story.images && 
                <PipelineItem stage="Image Generation" completedAt={story.images.last_updated} />
            }
            {story.audio && 
                <PipelineItem stage="Audio Generation" completedAt={story.audio.last_updated} />
            }
            {story.video && 
                <PipelineItem stage="Video Generation" completedAt={story.video.last_updated} />
            }
            {story.finalVideo && 
                <PipelineItem stage="Final Video Generation" completedAt={story.finalVideo.last_updated} />
            }
          </div>
        </div>

        <ResourcesSection story={story} />
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

const ResourcesSection = ({story}: {story: any}) => {
    const [selectedResource, setSelectedResource] = useState<string | null>(null);

    if (!story) {
        return <div>Loading...</div>;
    }
    return (
        <div className="pb-10 w-full max-w-5xl">
            <h3 className="text-xl font-bold mb-8 text-white">Resources Viewer</h3>
            <div className="flex flex-row gap-4 mb-6">
                {story.storyText && 
                    <button className={`px-4 py-2 text-white rounded-lg hover:bg-[#21364A] transition-colors ${selectedResource === 'storyText' ? 'bg-[#21364A]' : 'bg-[#172633]'}`} onClick={() => setSelectedResource('storyText')}>
                        Story Text
                    </button>
                }
                {story.chunkTexts && 
                    <button className={`px-4 py-2 text-white rounded-lg hover:bg-[#21364A] transition-colors ${selectedResource === 'chunkTexts' ? 'bg-[#21364A]' : 'bg-[#172633]'}`} onClick={() => setSelectedResource('chunkTexts')}>
                        Chunks
                    </button>
                }
                {story.imagePrompts && 
                    <button className={`px-4 py-2 text-white rounded-lg hover:bg-[#21364A] transition-colors ${selectedResource === 'imagePrompts' ? 'bg-[#21364A]' : 'bg-[#172633]'}`} onClick={() => setSelectedResource('imagePrompts')}>
                        Image Prompts
                    </button>
                }
                {story.summary && 
                    <button className={`px-4 py-2 text-white rounded-lg hover:bg-[#21364A] transition-colors ${selectedResource === 'summary' ? 'bg-[#21364A]' : 'bg-[#172633]'}`} onClick={() => setSelectedResource('summary')}>
                        Summary
                    </button>
                }
                {story.nextOptions && 
                    <button className={`px-4 py-2 text-white rounded-lg hover:bg-[#21364A] transition-colors ${selectedResource === 'nextOptions' ? 'bg-[#21364A]' : 'bg-[#172633]'}`} onClick={() => setSelectedResource('nextOptions')}>
                        Next Options
                    </button>
                }
                {story.images && 
                    <button className={`px-4 py-2 text-white rounded-lg hover:bg-[#21364A] transition-colors ${selectedResource === 'images' ? 'bg-[#21364A]' : 'bg-[#172633]'}`} onClick={() => setSelectedResource('images')}>
                        Images
                    </button>
                }
                {story.audio && 
                    <button className={`px-4 py-2 text-white rounded-lg hover:bg-[#21364A] transition-colors ${selectedResource === 'audio' ? 'bg-[#21364A]' : 'bg-[#172633]'}`} onClick={() => setSelectedResource('audio')}>
                        Audio
                    </button>
                }
                {story.video && 
                    <button className={`px-4 py-2 text-white rounded-lg hover:bg-[#21364A] transition-colors ${selectedResource === 'video' ? 'bg-[#21364A]' : 'bg-[#172633]'}`} onClick={() => setSelectedResource('video')}>
                        Video
                    </button>
                }
                {story.finalVideo && 
                    <button className={`px-4 py-2 text-white rounded-lg hover:bg-[#21364A] transition-colors ${selectedResource === 'finalVideo' ? 'bg-[#21364A]' : 'bg-[#172633]'}`} onClick={() => setSelectedResource('finalVideo')}>
                        Final Video
                    </button>
                }
            </div>

            {selectedResource === 'chunkTexts' && 
                <div className="bg-[#172633] rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-4">
                        {story.chunkTexts.chunks.map((chunk: any) => (
                            <div className="bg-[#21364A] rounded-lg p-4">
                                <TextResource text={chunk} />
                            </div>
                        ))}
                    </div>
                </div>
            }

            {selectedResource === "imagePrompts" && 
                <div className="bg-[#172633] rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-4">
                        {story.imagePrompts.prompts.map((prompt: any) => (
                            <div className="bg-[#21364A] rounded-lg p-4">
                                <TextResource text={prompt} />
                            </div>
                        ))}
                    </div>
                </div>
            }

            {selectedResource === "nextOptions" && 
                <div className="bg-[#172633] rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-4">
                        {story.nextOptions.options.map((option: any) => (
                            <div className="bg-[#21364A] rounded-lg p-4">
                                <TextResource text={option} />
                            </div>
                        ))}
                    </div>
                </div>
            }

            {selectedResource === "summary" && 
                <div className="bg-[#172633] rounded-lg p-6">
                    <TextResource text={story.summary.text} />
                </div>
            }
            
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
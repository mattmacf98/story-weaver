"use client";

import StoryWeaverNav from "@/components/StoryWeaverNav";
import { useEffect } from "react";
import { useStoryWeaver } from "@/contexts/StoryWeaverContext";
import { useState } from "react";
import { useParams } from "next/navigation";


export default function PublishStoryPage() {
    const { getStory, getVideoUrl } = useStoryWeaver();
    const [story, setStory] = useState<any>(null);
    const params = useParams();
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchStory = async () => {
            const story = await getStory(params.id as string);
            setStory(story);
            console.log(story);
        }
        fetchStory();
    }, [params.id]);

    useEffect(() => {
        const fetchVideoUrl = async () => {
            if (story && story.videos && story.videos.videos.length > 0) {
                const numVideos = story.videos.videos.length;
                const videoUrl = await getVideoUrl(story.videos.videos[numVideos - 1].key);
                console.log(videoUrl);
                setVideoUrl(videoUrl);
            }
        }
        fetchVideoUrl();
    }, [story]);

    if (!story || !videoUrl) {
        return <div>Loading...</div>;
    }

    return (
      <div className="min-h-screen bg-[#0F1A24]">
        <StoryWeaverNav />
        <main className="flex flex-col items-center px-4 py-10">
            <div className="pb-10 w-full flex flex-col items-center">
                <h1 className="text-3xl font-bold text-white">Publish Your Story</h1>
                <div className="flex flex-row items-center gap-10">
                    <div className="mt-8 bg-[#172633] rounded-lg p-6 w-1/2">
                        <video 
                            className="w-full h-full rounded-lg object-contain"
                            controls
                        >
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div className="mt-8 bg-[#172633] rounded-lg p-6">
                        <div className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-white mb-1">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    className="w-full px-3 py-2 bg-[#0F1A24] text-white rounded-md border border-gray-600 focus:outline-none focus:border-[#0D80F2]"
                                    placeholder="Enter title..."
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="hashtags" className="block text-sm font-medium text-white mb-1">Hashtags</label>
                                <input
                                    type="text"
                                    id="hashtags" 
                                    className="w-full px-3 py-2 bg-[#0F1A24] text-white rounded-md border border-gray-600 focus:outline-none focus:border-[#0D80F2]"
                                    placeholder="#story #ai ..."
                                />
                            </div>

                            <div>
                                <label htmlFor="caption" className="block text-sm font-medium text-white mb-1">Caption</label>
                                <textarea
                                    id="caption"
                                    rows={3}
                                    className="w-full px-3 py-2 bg-[#0F1A24] text-white rounded-md border border-gray-600 focus:outline-none focus:border-[#0D80F2]"
                                    placeholder="Write a caption..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1">Next Options</label>
                                <div className="space-y-2">
                                <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Add new option..."
                                            className="flex-1 px-3 py-2 bg-[#0F1A24] text-white rounded-md border border-gray-600 focus:outline-none focus:border-[#0D80F2]"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                                    const newOptions = [...(story.nextOptions?.options || [])];
                                                    newOptions.push(e.currentTarget.value.trim());
                                                    setStory({...story, nextOptions: {...story.nextOptions, options: newOptions}});
                                                    e.currentTarget.value = '';
                                                }
                                            }}
                                        />
                                    </div>
                                    {story.nextOptions?.options?.map((option: string, index: number) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-white mr-8">{option}</span>
                                            <button 
                                                onClick={() => {
                                                    const newOptions = [...story.nextOptions.options];
                                                    newOptions.splice(index, 1);
                                                    setStory({...story, nextOptions: {...story.nextOptions, options: newOptions}});
                                                }}
                                                className="text-gray-400 hover:text-white"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-center mt-8">
                                <button className="px-4 py-2 bg-[#0D80F2] text-white font-bold rounded-lg hover:bg-[#106ad6] transition-colors">
                                    Publish to TikTok
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
      </div>
    );
  }
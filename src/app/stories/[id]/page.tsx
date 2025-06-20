"use client";

import StoryWeaverNav from "@/components/StoryWeaverNav";
import ToastMessageBar from "@/components/toastMessages/ToastMessageBar";
import { useAuth } from "@/contexts/AuthContext";
import { useStoryWeaver } from "@/contexts/StoryWeaverContext";
import { useToastMessage } from "@/contexts/ToastMessageContext";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

const requiredResources = [
  "audios",
  "chunkTexts",
  "imagePrompts",
  "images",
  "nextOptions",
  "summary",
  "videos",
]

export default function StoryPage() {
  const { getStory, startStory, continueStory, getStories, getLastestJobForStory } = useStoryWeaver();
  const params = useParams();
  const { addToastMessage } = useToastMessage();
  const [story, setStory] = useState<any>(null);
  const [missingResources, setMissingResources] = useState<string[]>([]);
  const [nextStory, setNextStory] = useState<any>(null);
  const [regenerating, setRegenerating] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [latestJobStatus, setLatestJobStatus] = useState<any>(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading]);


   useEffect(() => {
        if (story) {
            const missing = requiredResources.filter((resource) => !story[resource]);
            setMissingResources(missing);
        }
   }, [story]);

  useEffect(() => {
      const fetchLatestJob = async () => {
        const authToken = await user?.getIdToken();
        const latestJob = await getLastestJobForStory(story.id, authToken);
        setLatestJobStatus(latestJob.status);
      }

      if (story) {
        fetchLatestJob();
      }
  }, [story]);

  useEffect(() => {
    const fetchStory = async () => {
      const authToken = await user?.getIdToken();
      const story = await getStory(params.id as string, authToken);
      // TODO: this is very inefficient, we should only fetch the next story
      const allStories = await getStories(authToken);
      const nextStory = allStories.find((s: any) => s.prevStoryId === story.id) || null;
      setNextStory(nextStory);
      setStory(story);
    }
    if (user) {
      fetchStory();
      const interval = setInterval(fetchStory, 10000);
      return () => clearInterval(interval);
    }
  }, [params.id, user]);

  const handleContinueStory = async () => {
    const authToken = await user?.getIdToken();
    const { success, message } = await continueStory(params.id as string, selectedOption || story.nextOptions.options[0], undefined, authToken);
    if (success) {
      addToastMessage(message, "success");
    } else {
      addToastMessage(message, "error");
    }
    //TODO: in the future, we will get a job id back and the longer running process will be queued => redirect to the status page
    //router.push(`/stories/${params.id}`);
  }

  const handleRegenerateStory = async () => {
    const authToken = await user?.getIdToken();
    const config = {
      audience: story.audience,
      genre: story.genre,
      pov: story.pov,
    }
    setRegenerating(true);
    if (story.prevStoryId) {
      const { success, message } = await continueStory(story.prevStoryId, story.selectedOption, story.id, authToken);
      if (success) {
        addToastMessage(message, "success");
      } else {
        addToastMessage(message, "error");
      }
    } else {
      const { success, message } = await startStory(story.prompt, config, story.id, authToken);
      if (success) {
        addToastMessage(message, "success");
      } else {
        addToastMessage(message, "error");
      }
    }
    setRegenerating(false);
  }

  if (!story) {
    return <div>Loading...</div>;
  }

  const publishDisabled = missingResources.length > 0;

  return (
    <div className="min-h-screen bg-[#0F1A24]">
      <StoryWeaverNav />
      <ToastMessageBar />
      <main className="flex flex-col items-center px-4 py-10">
        <div className="pb-10 w-full max-w-5xl">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-white">{story?.title}</h1>
            {
                !story.published && !nextStory &&
                <button 
                    onClick={() => router.push(`/stories/publish/${params.id}`)} disabled={publishDisabled}
                    className={`px-4 py-2 bg-[#0D80F2] text-white font-bold rounded-lg hover:bg-[#106ad6] transition-colors ${publishDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    Publish
                </button>
            }
            {
                story.published && !nextStory &&
                <div className="flex flex-col gap-2">
                    <select 
                        className="w-96 px-4 py-4 bg-[#172633] text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#0D80F2]"
                        defaultValue={story.nextOptions.options[0]}
                        onChange={(e) => {
                            setSelectedOption(e.target.value);
                        }}
                    >
                        {story.nextOptions.options.map((option: string, index: number) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <button 
                        className="px-4 py-2 bg-[#0D80F2] text-white font-bold rounded-lg hover:bg-[#106ad6] transition-colors"
                        onClick={handleContinueStory}
                    >
                        Continue Story
                    </button>
                </div>
            }
            {
                story.published && nextStory &&
                <Link href={`/stories/${nextStory.id}`} className="px-4 py-2 bg-[#0D80F2] text-white font-bold rounded-lg hover:bg-[#106ad6] transition-colors">
                    Next
                </Link>
            }
          </div>
          <p className="text-slate-400">Story ID: {params.id}</p>
          {latestJobStatus && (
            <div className="flex flex-row gap-2">
              <p className={`flex items-center gap-2 ${
                latestJobStatus === 'completed' ? 'text-green-500' :
                latestJobStatus === 'failed' ? 'text-red-500' :
                latestJobStatus === 'running' ? 'text-yellow-500' :
                'text-orange-500'
              }`}>
                Status: {latestJobStatus}
                {latestJobStatus === 'completed' && <span>✓</span>}
                {latestJobStatus === 'failed' && <span>✗</span>}
                {latestJobStatus === 'running' && <span>⟳</span>}
                {latestJobStatus === 'pending' && <span>⌛</span>}
              </p>
            </div>
          )}
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
            {story.audios && 
                <PipelineItem stage="Audio Generation" completedAt={story.audios.last_updated} />
            }
            {story.videos && 
                <PipelineItem stage="Video Generation" completedAt={story.videos.last_updated} />
            }
            {story.finalVideo && 
                <PipelineItem stage="Final Video Generation" completedAt={story.finalVideo.last_updated} />
            }
          </div>
        </div>

        {missingResources.length > 0 && (latestJobStatus === "failed" || latestJobStatus === "completed") && (
          <div className="pb-10 w-full max-w-5xl">
            <h3 className="text-xl font-bold mb-8 text-white">Missing Resources</h3>
            <div className="flex flex-row gap-4">
              {missingResources.map((resource) => (
                <div key={resource} className="px-4 py-2 bg-[#172633] text-red-500 rounded-lg">
                  {resource}
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button disabled={regenerating} className="px-4 py-2 bg-[#0D80F2] text-white font-bold rounded-lg hover:bg-[#106ad6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleRegenerateStory}>
                {regenerating ? "Regenerating..." : "Generate Missing Resources"}
              </button>
            </div>
          </div>
        )}

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
    const { deleteResource } = useStoryWeaver();
    const { user } = useAuth();
    const { addToastMessage } = useToastMessage();

    const handleDeleteResource = async (resourceType: string) => {
        const authToken = await user?.getIdToken();
        const { success, message } = await deleteResource(resourceType, story.id, authToken);
        if (success) {
            addToastMessage(message, "success");
        } else {
            addToastMessage(message, "error");
        }
    }
    
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
                {story.audios && 
                    <button className={`px-4 py-2 text-white rounded-lg hover:bg-[#21364A] transition-colors ${selectedResource === 'audios' ? 'bg-[#21364A]' : 'bg-[#172633]'}`} onClick={() => setSelectedResource('audios')}>
                        Audio
                    </button>
                }
                {story.videos && 
                    <button className={`px-4 py-2 text-white rounded-lg hover:bg-[#21364A] transition-colors ${selectedResource === 'video' ? 'bg-[#21364A]' : 'bg-[#172633]'}`} onClick={() => setSelectedResource('videos')}>
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
                            <div key={chunk} className="bg-[#21364A] rounded-lg p-4">
                                <TextResource text={chunk} />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2" onClick={() => handleDeleteResource("chunkTexts")}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Delete Resource
                        </button>
                    </div>
                </div>
            }

            {selectedResource === "imagePrompts" && 
                <div className="bg-[#172633] rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-4">
                        {story.imagePrompts.prompts.map((prompt: any) => (
                            <div key={prompt} className="bg-[#21364A] rounded-lg p-4">
                                <TextResource text={prompt} />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2" onClick={() => handleDeleteResource("imagePrompts")}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Delete Resource
                        </button>
                    </div>
                </div>
            }

            {selectedResource === "nextOptions" && 
                <div className="bg-[#172633] rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-4">
                        {story.nextOptions.options.map((option: any) => (
                            <div key={option} className="bg-[#21364A] rounded-lg p-4">
                                <TextResource text={option} />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2" onClick={() => handleDeleteResource("nextOptions")}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Delete Resource
                        </button>
                    </div>
                </div>
            }

            {selectedResource === "images" && 
                <div className="bg-[#172633] rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-4">
                        {story.images.images.map((image: any) => (
                            <div key={image.key} className="bg-[#21364A] rounded-lg p-4">
                                <ImageResource imageKey={image.key} />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2" onClick={() => handleDeleteResource("images")}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Delete Resource
                        </button>
                    </div>
                </div>
            }

            {selectedResource === "summary" && 
                <div className="bg-[#172633] rounded-lg p-6">
                    <TextResource text={story.summary} />
                    <div className="flex justify-end mt-4">
                        <button className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2" onClick={() => handleDeleteResource("summary")}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Delete Resource
                        </button>
                    </div>
                </div>
            }

            {selectedResource === "audios" &&
                <div className="bg-[#172633] rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-4">
                        {story.audios.audios.map((audio: any) => (
                            <div key={audio.key} className="bg-[#21364A] rounded-lg p-4">
                                <AudioResource audioKey={audio.key} />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2" onClick={() => handleDeleteResource("audios")}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Delete Resource
                        </button>
                    </div>
                </div>
            }

            {selectedResource === "videos" && 
                <div className="bg-[#172633] rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-4">
                        {story.videos.videos.map((video: any) => (
                            <div key={video.key} className="bg-[#21364A] rounded-lg p-4">
                                <VideoResource videoKey={video.key} />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2" onClick={() => handleDeleteResource("videos")}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Delete Resource
                        </button>
                    </div>
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

const ImageResource = ({imageKey}: {imageKey: string}) => {
    const { getImageUrl } = useStoryWeaver();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchImage = async () => {
            const authToken = await user?.getIdToken();
            const imageUrl = await getImageUrl(imageKey, authToken);
            setImageUrl(imageUrl);
        }
        if (user) {
            fetchImage();
        }
    }, [imageKey, user]);

    if (!imageUrl) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col">
            <img src={imageUrl} className="w-full h-full object-cover" />
        </div>
    )
}

const AudioResource = ({audioKey}: {audioKey: string}) => {
    const { getAudioUrl } = useStoryWeaver();
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchAudio = async () => {
            const authToken = await user?.getIdToken();
            const audioUrl = await getAudioUrl(audioKey, authToken);
            setAudioUrl(audioUrl);
        }
        if (user) {
            fetchAudio();
        }
    }, [audioKey, user]);

    if (!audioUrl) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col">
            <audio src={audioUrl} controls />
        </div>
    )
}

const VideoResource = ({videoKey}: {videoKey: string}) => {
    const { getVideoUrl } = useStoryWeaver();
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchVideo = async () => {
            const authToken = await user?.getIdToken();
            const videoUrl = await getVideoUrl(videoKey, authToken);
            setVideoUrl(videoUrl);
        }
        if (user) {
            fetchVideo();
        }
    }, [videoKey, user]);

    if (!videoUrl) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col">
            <video src={videoUrl} controls />
        </div>
    )
}
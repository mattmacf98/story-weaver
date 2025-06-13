"use client";

import StoryWeaverNav from "@/components/StoryWeaverNav";
import { useEffect } from "react";
import { useStoryWeaver } from "@/contexts/StoryWeaverContext";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ToastMessageBar from "@/components/toastMessages/ToastMessageBar";
import { BACKEND_URL } from "@/lib/constants";


export default function PublishStoryPage() {
    const { getStory, getVideoUrl, publishStory } = useStoryWeaver();
    const [story, setStory] = useState<any>(null);
    const params = useParams();
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [videoKey, setVideoKey] = useState<string | null>(null);
    const { user, loading } = useAuth();
    const [tiktokAccessToken, setTiktokAccessToken] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const router = useRouter();
    
    useEffect(() => {
        if (!user && !loading) {
            router.push("/login");
        }
    }, [user, loading]);

    useEffect(() => {
        const accessToken = localStorage.getItem('tiktok_access_token');
        const expirationDate = localStorage.getItem('tiktok_token_expiration');
        if (accessToken && expirationDate) {
            const now = new Date();
            const expiration = new Date(expirationDate);
            if (now > expiration) {
                localStorage.removeItem('tiktok_access_token');
                localStorage.removeItem('tiktok_token_expiration');
            } else {
                setTiktokAccessToken(accessToken);
            }
        }
    }, []);

    useEffect(() => {
        const fetchStory = async () => {
            const authToken = await user?.getIdToken();
            const story = await getStory(params.id as string, authToken);
            setStory(story);
        }
        if (user) {
            fetchStory();
        }
    }, [params.id, user]);

    useEffect(() => {
        const fetchVideoUrl = async () => {
            const authToken = await user?.getIdToken();
            if (story && story.videos && story.videos.videos.length > 0) {
                const numVideos = story.videos.videos.length;
                const videoUrl = await getVideoUrl(story.videos.videos[numVideos - 1].key, authToken);
                setVideoUrl(videoUrl);
                setVideoKey(story.videos.videos[numVideos - 1].key);
            }
        }
        if (user) {
            fetchVideoUrl();
        }
    }, [story, user]);


    const authorizeTikTok = async() => {
        window.location.href = `${BACKEND_URL}/api/oauth`
    }

    const handleUploadVideo = async (videoKey: string) => {
        setIsUploading(true);
        const authToken = await user?.getIdToken();
        await fetch(`${BACKEND_URL}/api/tiktok/upload`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`,
                },
                body: JSON.stringify({videoKey: videoKey, accessToken: tiktokAccessToken, title: story.title}),
            }
        )
        await publishStory(params.id as string, authToken);
        setIsUploading(false);
    }

    if (!story || !videoUrl) {
        return <div>Loading...</div>;
    }

    return (
      <div className="min-h-screen bg-[#0F1A24]">
        <StoryWeaverNav />
        <ToastMessageBar />
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
                                <h2 className="text-lg font-semibold text-white mb-2">Title</h2>
                                <div className="w-full text-xl text-white">
                                    {story.title}
                                </div>
                            </div>

                            <div>
                                <label className="text-lg font-semibold text-white mb-2">Next Option Suggestions</label>
                                <div className="space-y-2">
                                    {story.nextOptions?.options?.map((option: string, index: number) => (
                                        <div key={index} className="text-white flex items-center">
                                            <span className="w-2 h-2 bg-[#0D80F2] rounded-full mr-2"></span>
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {
                                isUploading && (
                                    <div className="flex items-center justify-center">
                                        <div className="w-6 h-6 border-t-2 border-[#0D80F2] border-solid rounded-full animate-spin"></div>
                                        <span className="text-white">Uploading video...</span>
                                    </div>
                                )
                            }

                            {
                                !isUploading && (
                                    <div className="flex gap-4 mt-8">
                                        {!tiktokAccessToken && (
                                            <button 
                                                className="px-4 py-2 bg-[#0D80F2] text-white font-bold rounded-lg hover:bg-[#106ad6] transition-colors" 
                                                onClick={authorizeTikTok}
                                            >
                                                Authorize TikTok
                                            </button>
                                        )}
        
                                        {tiktokAccessToken && (
                                            <button 
                                                className="px-4 py-2 bg-[#0D80F2] text-white font-bold rounded-lg hover:bg-[#106ad6] transition-colors"
                                                onClick={() => handleUploadVideo(videoKey!)}
                                            >
                                                Upload to TikTok
                                            </button>
                                        )}
        
                                        <button
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = videoUrl;
                                                link.download = 'video.mp4';
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }}
                                            className="px-4 py-2 bg-[#0D80F2] text-white font-bold rounded-lg hover:bg-[#106ad6] transition-colors"
                                        >
                                            Download Video
                                        </button>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                </div>
            </div>
        </main>
      </div>
    );
  }
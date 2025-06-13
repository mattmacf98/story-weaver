"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BACKEND_URL } from "@/lib/constants";
import ToastMessageBar from "@/components/toastMessages/ToastMessageBar";
import StoryWeaverNav from "@/components/StoryWeaverNav";

export default function TikTokAuth() {
    const [authState, setAuthState] = useState<'loading' | 'success' | 'failed'>('loading');
    const searchParams = useSearchParams();

    useEffect(() => {
        const code = searchParams.get('code');
        if (!code) {
            setAuthState('failed');
            return;
        }
        
        const handleGetTikTokUserToken = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/tiktok/token`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ code }),
                });
                
                if (response.ok) {
                    setAuthState('success');
                    const data = await response.json();
                    const accessToken = data.data.access_token;
                    const expirationDate = new Date();
                    expirationDate.setDate(expirationDate.getDate() + 1);
                    localStorage.setItem('tiktok_access_token', accessToken);
                    localStorage.setItem('tiktok_token_expiration', expirationDate.toISOString());
                } else {
                    setAuthState('failed');
                }
            } catch (error) {
                console.error("Error authenticating with TikTok:", error);
                setAuthState('failed');
            }
        }

        if (code) {
            handleGetTikTokUserToken();
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-[#0F1A24]">
            <StoryWeaverNav />
            <ToastMessageBar />
            <div className="flex flex-col items-center justify-center h-screen">
                {authState === 'loading' && (
                    <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 border-t-2 border-[#0D80F2] border-solid rounded-full animate-spin"></div>
                        <span className="text-white">Authenticating with TikTok...</span>
                    </div>
                )}
                {authState === 'success' && (
                    <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-white">Successfully authenticated with TikTok!</span>
                    </div>
                )}
                {authState === 'failed' && (
                    <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        <span className="text-white">Failed to authenticate with TikTok</span>
                    </div>
                )}
            </div>
        </div>
    );
}

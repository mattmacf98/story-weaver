"use client";

import { createContext, useContext, ReactNode } from 'react';
// https://story-weaver-backend-7715b2910e28.herokuapp.com/
// http://localhost:5000
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://story-weaver-backend-7715b2910e28.herokuapp.com";

export enum Audience {
  Children = "Children",
  Teenagers = "Teenagers",
  Adults = "Adults",
}

export enum Genre {
  Fantasy = "Fantasy",
  SciFi = "Sci-Fi",
  Mystery = "Mystery",
  Romance = "Romance",
  Adventure = "Adventure",
  Drama = "Drama",
  Comedy = "Comedy",
  Action = "Action",
  Horror = "Horror",
  Thriller = "Thriller",
}

export enum POV {
  FirstPerson = "First Person",
  ThirdPerson = "Third Person",
}

export interface StoryConfig {
  audience: Audience;
  genre: Genre;
  pov: POV
}

interface StoryWeaverContextType {
  startStory: (prompt: string, config: StoryConfig, storyId?: string, authToken?: string) => Promise<any>;
  continueStory: (prevStoryId: string, nextOption: string, storyId?: string, authToken?: string) => Promise<any>;
  deleteResource: (pieceType: string, storyId: string, authToken?: string) => Promise<any>;
  getStory: (id: string, authToken?: string) => Promise<any>;
  getStories: (authToken?: string) => Promise<any[]>;
  getImageUrl: (key: string, authToken?: string) => Promise<string>;
  getAudioUrl: (key: string, authToken?: string) => Promise<string>;
  getVideoUrl: (key: string, authToken?: string) => Promise<string>;
  publishStory: (storyId: string, authToken?: string) => Promise<any>;
}

const StoryWeaverContext = createContext<StoryWeaverContextType | undefined>(undefined);

export function useStoryWeaver() {
  const context = useContext(StoryWeaverContext);
  if (context === undefined) {
    throw new Error('useStoryWeaver must be used within a StoryWeaverProvider');
  }
  return context;
}

interface StoryWeaverProviderProps {
  children: ReactNode;
}

export function StoryWeaverProvider({ children }: StoryWeaverProviderProps) {

  const deleteResource = async (pieceType: string, storyId: string, authToken?: string) => {
    const response = await fetch(`${BACKEND_URL}/api/delete_story_resource?resource_type=${pieceType}&story_id=${storyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
    });
    const data = await response.json();
    const success = response.ok;
    const message = data.message;
    return { success, message };
  };

  const startStory = async (prompt: string, config: StoryConfig, storyId?: string, authToken?: string) => {
    const body: any = {
      prompt,
      pov: config.pov,
      audience: config.audience,
      genre: config.genre,
    }
    if (storyId) {
      body.story_id = storyId;
    }
    
    const response = await fetch(`${BACKEND_URL}/api/start_story`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    const success = response.ok;
    const message = data.message;
    return { success, message };
  };

  const continueStory = async (prevStoryId: string, nextOption: string, storyId?: string, authToken?: string) => {
    const body: any = {
      prev_story_id: prevStoryId,
      next_option: nextOption,
    }
    if (storyId) {
      body.story_id = storyId;
    }

    const response = await fetch(`${BACKEND_URL}/api/continue_story`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    console.log("continue story response");
    console.log(data);
    console.log(response);
    const success = response.ok;
    const message = data.message;
    return { success, message };
  }

  const getStory = async (id: string, authToken?: string) => {
    const response = await fetch(`${BACKEND_URL}/api/get_story?id=${id}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
    });
    const data = await response.json();
    return data.data;
  };

  const getStories = async (authToken?: string) => {
    const response = await fetch(`${BACKEND_URL}/api/stories`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
    });
    const data = await response.json();
    return data.data;
  };

  const getImageUrl = async (key: string, authToken?: string) => {
    const response = await fetch(`${BACKEND_URL}/api/get_image?key=${key}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
    });
    const data = await response.json();
    return data.data;
  };

  const getAudioUrl = async (key: string, authToken?: string) => {
    const response = await fetch(`${BACKEND_URL}/api/get_audio?key=${key}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
    });
    const data = await response.json();
    return data.data;
  };

  const getVideoUrl = async (key: string, authToken?: string) => {
    const response = await fetch(`${BACKEND_URL}/api/get_video?key=${key}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
    });
    const data = await response.json();
    return data.data;
  };

  const publishStory = async (storyId: string, authToken?: string) => {
    const response = await fetch(`${BACKEND_URL}/api/publish_story?id=${storyId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
    });
    const data = await response.json();
    return data.data;
  };


  const value = {
    deleteResource,
    startStory,
    continueStory,
    getStory,
    getStories,
    getImageUrl,
    getAudioUrl,
    getVideoUrl,
    publishStory,
  };

  return (
    <StoryWeaverContext.Provider value={value}>
      {children}
    </StoryWeaverContext.Provider>
  );
}

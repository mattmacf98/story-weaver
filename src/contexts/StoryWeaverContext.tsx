"use client";

import { createContext, useContext, ReactNode } from 'react';

const BACKEND_URL = "http://localhost:5000";

interface StoryWeaverContextType {
  startStory: (prompt: string) => void;
  getStory: (id: string) => Promise<any>;
  getStories: () => Promise<any[]>;
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
  const startStory = async (prompt: string) => {
    const response = await fetch(`${BACKEND_URL}/api/start_story`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    console.log(data);
  };

  const getStory = async (id: string) => {
    const response = await fetch(`${BACKEND_URL}/api/get_story?id=${id}`);
    const data = await response.json();
    return data.data;
  };

  const getStories = async () => {
    const response = await fetch(`${BACKEND_URL}/api/stories`);
    const data = await response.json();
    return data.data;
  };

  const value = {
    startStory,
    getStory,
    getStories,
  };

  return (
    <StoryWeaverContext.Provider value={value}>
      {children}
    </StoryWeaverContext.Provider>
  );
}

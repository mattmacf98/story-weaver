interface Story {
    id: string;
    title: string;
    createdAt: string;
    storyText: StoryTextArtifact;
    chunks: StoryTextArtifact[];
    imagePrompts: StoryTextArtifact[];
    summary: StoryTextArtifact;
    nextOptions: StoryTextArtifact[];
    images: StoryBlobArtifact[];
    audio: StoryBlobArtifact[];
    video: StoryBlobArtifact[];
    finalVideo: StoryBlobArtifact;
}

interface StoryTextArtifact {
    createdAt: string;
    text: string;
}


interface StoryBlobArtifact {
    createdAt: string;
    key: string;
    mimeType: string;
}



import { StoryRow } from "./StoryRow";

export default function StoryTable({ stories }: { stories: any[] }) {
  return (
    <div className="w-full max-w-5xl flex flex-col items-center justify-center">
      <div className="rounded-xl overflow-hidden border border-[#304D69] bg-[#172633] w-full">
        <div className="flex w-full bg-[#172633] text-white text-[14px] font-bold" style={{fontFamily: 'sans-serif'}}>
          <div className="px-4 py-3 w-[281px]">Title</div>
          <div className="px-4 py-3 w-[199px]">Status</div>
          <div className="px-4 py-3 w-[275px]">Created</div>
          <div className="px-4 py-3 w-[171px]">Action</div>
        </div>
        {stories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((story, idx) => (
          <StoryRow key={story.title + idx} title={story.title} status={story.published ? "PUBLISHED" : "IN PROGRESS"} createdAt={story.createdAt} id={story.id} />
        ))}
      </div>
    </div>
  );
} 
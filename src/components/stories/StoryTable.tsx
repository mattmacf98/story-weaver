import { StoryRow } from "./StoryRow";

const stories = [
  {
    title: "The Enchanted Forest",
    status: "In Progress",
    created: "2024-01-15",
    action: "View",
    id: "1",
  },
  {
    title: "The Lost City",
    status: "Completed",
    created: "2023-12-20",
    action: "View",
    id: "2",
  },
  {
    title: "The Secret of the Stars",
    status: "Draft",
    created: "2023-11-05",
    action: "View",
    id: "3",
  },
  {
    title: "The Journey Begins",
    status: "In Progress",
    created: "2023-10-12",
    action: "View",
    id: "4",
  },
  {
    title: "The Last Dragon",
    status: "Completed",
    created: "2023-09-01",
    action: "View",
    id: "5",
  },
];

export default function StoryTable() {
  return (
    <div className="w-full max-w-5xl flex flex-col items-center justify-center">
      <div className="rounded-xl overflow-hidden border border-[#304D69] bg-[#172633] w-full">
        <div className="flex w-full bg-[#172633] text-white text-[14px] font-bold" style={{fontFamily: 'sans-serif'}}>
          <div className="px-4 py-3 w-[281px]">Title</div>
          <div className="px-4 py-3 w-[199px]">Status</div>
          <div className="px-4 py-3 w-[275px]">Created</div>
          <div className="px-4 py-3 w-[171px]">Action</div>
        </div>
        {stories.map((story, idx) => (
          <StoryRow key={story.title + idx} {...story} id={story.id} />
        ))}
      </div>
    </div>
  );
} 
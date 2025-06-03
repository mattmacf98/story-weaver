import Link from "next/link";

type StoryRowProps = {
  title: string;
  status: string;
  createdAt: string;
  id: string;
};

export function StoryRow({ title, status, createdAt, id }: StoryRowProps) {
  // Color for status
  const statusColor = status === "Completed"
    ? "bg-[#21364A] text-white"
    : status === "In Progress"
    ? "bg-[#21364A] text-white"
    : "bg-[#21364A] text-white";
  // Color for action
  const actionColor = "text-[#8FADCC] font-bold cursor-pointer";

  return (
    <div className="flex w-full border-t border-[#E5E8EB] bg-[#0F1A24] hover:bg-[#172633] transition-colors duration-150" style={{fontFamily: 'sans-serif'}}>
      <div className="flex items-center px-4 w-[281px] h-[72px] text-white text-[14px]" style={{fontFamily: 'sans-serif'}}>{title}</div>
      <div className="flex items-center px-4 w-[199px] h-[72px]">
        <span className={`rounded-xl px-4 py-1 text-[14px] font-medium ${statusColor}`} style={{fontFamily: 'sans-serif'}}>{status}</span>
      </div>
      <div className="flex items-center px-4 w-[275px] h-[72px] text-[#8FADCC] text-[14px]" style={{fontFamily: 'sans-serif'}}>{createdAt}</div>
      <div className="flex items-center px-4 w-[171px] h-[72px]">
        <Link href={`/stories/${id}`} className={actionColor} style={{fontFamily: 'sans-serif'}}>View</Link>
      </div>
    </div>
  );
}
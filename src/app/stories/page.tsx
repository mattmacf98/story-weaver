import StoryWeaverNav from "@/components/StoryWeaverNav";
import StoryTable from "@/components/stories/StoryTable";

export default function Stories() {
  return (
    <div className="min-h-screen bg-[#0F1A24]">
      <StoryWeaverNav />
      <main className="flex flex-col items-center px-4 py-10">
        <div className="pb-10 w-full max-w-5xl">
          <h1 className="text-3xl font-bold text-white">My Stories</h1>
        </div>
        <StoryTable />
      </main>
    </div>
  );
}   
import Profile from "@/components/figmaMCP/Profile";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-full max-w-[390px] h-[844px] mx-auto overflow-y-auto bg-white">
        <Profile />
      </div>
    </main>
  );
}

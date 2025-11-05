import ChangePassword from "@/components/figmaMCP/ChangePassword";

export default function PasswordPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-full max-w-[390px] h-[844px] mx-auto px-4 sm:px-0 overflow-y-auto bg-white">
        <ChangePassword />
      </div>
    </main>
  );
}

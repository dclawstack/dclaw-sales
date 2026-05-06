import Link from "next/link";
import { Target } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Target className="w-16 h-16 text-[#D97706] mb-6" />
      <h1 className="text-4xl font-bold text-[#D97706] mb-4">DClaw Sales</h1>
      <p className="text-lg text-gray-600 mb-8">CRM AI, email sequences & forecasting</p>
      <Link
        href="/dashboard"
        className="px-6 py-3 bg-[#D97706] text-white rounded-lg hover:bg-[#B45309] transition"
      >
        Go to Dashboard
      </Link>
    </main>
  );
}

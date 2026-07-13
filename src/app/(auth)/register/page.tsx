"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // MVP: Save user credentials to local storage
    setTimeout(() => {
      localStorage.setItem(
        "mvp_user",
        JSON.stringify({ name, email, password })
      );
      // Immediately log them in
      localStorage.setItem("mvp_session", "active");
      router.push("/agent");
    }, 500); // fake network delay
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(#e5e5e5_1px,transparent_1px),linear-gradient(90deg,#e5e5e5_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-accent-pink border-4 border-black brutal-shadow p-8 flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b-4 border-black pb-4 text-white">
            <UserPlus className="w-8 h-8" />
            <h1 className="text-3xl font-black uppercase tracking-tight">Register</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-white text-accent-pink font-bold p-3 border-4 border-black text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm uppercase text-white">Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full border-4 border-black p-3 bg-white font-mono text-sm focus:outline-none focus:ring-4 focus:ring-white/50 transition-all skeuo-inner"
                placeholder="Agent Smith"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm uppercase text-white">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full border-4 border-black p-3 bg-white font-mono text-sm focus:outline-none focus:ring-4 focus:ring-white/50 transition-all skeuo-inner"
                placeholder="agent@browserpilot.ai"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm uppercase text-white">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full border-4 border-black p-3 bg-white font-mono text-sm focus:outline-none focus:ring-4 focus:ring-white/50 transition-all skeuo-inner"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-4 w-full bg-accent-yellow text-black font-black text-xl uppercase p-4 border-4 border-black skeuo-button flex justify-center items-center gap-2 hover:bg-yellow-400 active:translate-y-1 active:shadow-none disabled:opacity-50 transition-all"
            >
              {isPending ? "Creating..." : "Initialize Agent"}
            </button>
          </form>

          <div className="mt-4 text-center border-t-4 border-black pt-4">
            <p className="font-bold text-sm text-white">
              ALREADY REGISTERED?{" "}
              <Link href="/login" className="text-accent-yellow hover:underline">
                LOG IN
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

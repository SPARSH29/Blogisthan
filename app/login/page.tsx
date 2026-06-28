"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import router from "next/router";
import { useEffect } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
const { data: session, status } = useSession();
const router = useRouter();

useEffect(() => {
  if (status === "authenticated") {
    router.replace("/");
  }
}, [status, router]);

if (status === "loading") {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

if (status === "authenticated") {
  return null;
}

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-200 px-4 overflow-hidden">
      {/* Purple Dot Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#a855f766_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Purple Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#7c3aed22,transparent_70%)]" />

      {/* Login Card */}
      <div className="relative z-10 my-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-purple-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome Back</h1>

          <p className="mt-2 text-gray-600">
            Sign in to continue to Blogisthan
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="rounded border-gray-300" />
              Remember me
            </label>

            <Link
              href="/forgot-password"
              className="text-purple-600 hover:text-purple-700"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl cursor-pointer bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700 hover:scale-[1.01]"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="px-3 text-sm text-gray-500">OR</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/yourblogs" })}
          className="w-full cursor-pointer hover:bg-gray-200 rounded-xl border border-gray-300 bg-white py-3 font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}

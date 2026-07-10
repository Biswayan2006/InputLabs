"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Zap, Loader2, AlertCircle } from "lucide-react";

// Google "G" logo — inline SVG so no extra dependency
function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get("callbackUrl") ?? "/";
  const errorParam   = searchParams.get("error");

  const [loading, setLoading] = useState(false);

  const errorMessages: Record<string, string> = {
    OAuthSignin:       "Could not start Google sign-in. Please try again.",
    OAuthCallback:     "Google sign-in failed. Please try again.",
    OAuthAccountNotLinked:
      "This email is already linked to another account.",
    default:           "Something went wrong. Please try again.",
  };
  const errorMessage = errorParam
    ? (errorMessages[errorParam] ?? errorMessages.default)
    : null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl });
    // Loading stays true — page navigates away
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-neutral-100/60 dark:shadow-none p-8">

          {/* Logo + title */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
              <Zap size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Welcome to InputLab
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 text-center">
              Sign in to compare peripherals, save favourites, and more.
            </p>
          </div>

          {/* Error banner */}
          {errorMessage && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm mb-6">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              {errorMessage}
            </div>
          )}

          {/* Google button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 font-medium text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 active:scale-[0.98] transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin text-neutral-400" />
            ) : (
              <GoogleLogo />
            )}
            {loading ? "Redirecting…" : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
            <span className="text-xs text-neutral-400">or</span>
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
          </div>

          {/* Info text */}
          <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center leading-relaxed">
            By signing in you agree to our terms. Admin access is granted to
            authorised email addresses only.
          </p>
        </div>

        {/* Admin hint */}
        <p className="text-center text-xs text-neutral-400 dark:text-neutral-600 mt-4">
          Admin? Use your authorised Google account to unlock the admin panel.
        </p>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-neutral-900 dark:text-white">
              InputLab
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400">
            <Link
              href="/mice"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Mice
            </Link>
            <Link
              href="/keyboards"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Keyboards
            </Link>
            <Link
              href="/monitors"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Monitors
            </Link>
            <Link
              href="/budget"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Budget Picks
            </Link>
          </nav>

          <p className="text-sm text-neutral-400 dark:text-neutral-600">
            © {new Date().getFullYear()} InputLab
          </p>
        </div>
      </div>
    </footer>
  );
}

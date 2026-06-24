import { motion } from "framer-motion";
import { Layers, Zap } from "lucide-react";
import { FeedList } from "@/components/feed/FeedList";

const TIPS = [
  { icon: Layers, text: "Intersection Observer lazy load" },
  { icon: Zap, text: "10 posts per page · 60 total" },
];

export function FeedApp() {
  return (
    <main className="mx-auto max-w-2xl flex-1 px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-8 text-center"
      >
        <h2 className="bg-linear-to-r from-orange-500 via-rose-500 to-amber-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
          Infinite Scroll Feed
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
          Scroll down to lazy-load more posts. Pagination, loading states, and
          error retry built in.
        </p>
      </motion.div>

      <FeedList />

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {TIPS.map(({ icon: Icon, text }) => (
          <span
            key={text}
            className="flex items-center gap-1.5 text-xs text-slate-400"
          >
            <Icon className="h-3.5 w-3.5 text-orange-400" />
            {text}
          </span>
        ))}
      </div>
    </main>
  );
}

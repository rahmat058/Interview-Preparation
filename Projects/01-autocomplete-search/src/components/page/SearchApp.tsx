import { motion } from "framer-motion";
import { Keyboard, Sparkles, Zap } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  clearSelection,
  setEntityTypeFilter,
  setQuery,
} from "@/lib/store/slices/searchSlice";
import { AutocompleteSearch } from "@/components/search/AutocompleteSearch";
import { EntityTypeFilter } from "@/components/search/EntityTypeFilter";
import { SelectedItemPanel } from "@/components/search/SelectedItemPanel";

const TIPS = [
  { icon: Zap, text: "300ms debounced API calls" },
  { icon: Keyboard, text: "Full keyboard navigation" },
  { icon: Sparkles, text: "Products, cities & users" },
];

const DEMO_QUERIES = ["sony", "tokyo", "sarah"] as const;

export function SearchApp() {
  const dispatch = useAppDispatch();
  const { selectedItem, entityTypeFilter } = useAppSelector(
    (state) => state.search,
  );

  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="text-center"
      >
        <h2 className="bg-linear-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
          Autocomplete Search
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500 sm:text-base">
          Type to search across products, cities, and users. Try{" "}
          {DEMO_QUERIES.map((q, i) => (
            <span key={q}>
              {i > 0 && (i === DEMO_QUERIES.length - 1 ? ", or " : ", ")}
              <button
                type="button"
                className="cursor-pointer font-medium text-indigo-600 hover:underline"
                onClick={() => dispatch(setQuery(q))}
              >
                {q}
              </button>
            </span>
          ))}
          .
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45 }}
        className="glass-card mx-auto mt-8 max-w-2xl p-6 sm:p-8"
      >
        <div className="mb-5">
          <EntityTypeFilter
            value={entityTypeFilter}
            onChange={(value) => dispatch(setEntityTypeFilter(value))}
          />
        </div>

        <div className="relative isolate">
          <AutocompleteSearch />

          {selectedItem && (
            <div className="relative z-0 mt-6">
              <SelectedItemPanel
                item={selectedItem}
                onClear={() => dispatch(clearSelection())}
              />
            </div>
          )}
        </div>
      </motion.div>

      <div className="mx-auto mt-4 flex max-w-2xl flex-wrap justify-center gap-4">
        {TIPS.map(({ icon: Icon, text }) => (
          <span
            key={text}
            className="flex items-center gap-1.5 text-xs text-slate-400"
          >
            <Icon className="h-3.5 w-3.5 text-indigo-400" />
            {text}
          </span>
        ))}
      </div>
    </main>
  );
}

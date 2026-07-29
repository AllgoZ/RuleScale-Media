import { Search } from "lucide-react";

export function SearchBox({ defaultValue }: { defaultValue?: string }) {
  return (
    <form
      action="/blog/search"
      method="GET"
      role="search"
      className="flex items-center gap-2 rounded-full border border-hairline bg-paper px-4 py-2.5 shadow-soft focus-within:border-accent/40"
    >
      <Search size={16} className="shrink-0 text-ink-soft" />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search articles..."
        aria-label="Search articles"
        className="w-full bg-transparent text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none"
      />
    </form>
  );
}

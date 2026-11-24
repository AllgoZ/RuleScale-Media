import { Search } from "lucide-react";

export function SearchBox({ defaultValue }: { defaultValue?: string }) {
  return (
    <form
      action="/blog/search"
      method="GET"
      role="search"
      className="flex h-12 w-full items-center gap-2 rounded-full border border-ink/25 bg-paper-2 px-5 transition-colors focus-within:border-ink focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent-deep sm:w-72"
    >
      <Search size={16} aria-hidden="true" className="shrink-0 text-ink-soft" />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search articles"
        aria-label="Search articles"
        className="w-full bg-transparent text-[15px] text-ink placeholder:text-ink-soft focus:outline-none"
      />
    </form>
  );
}

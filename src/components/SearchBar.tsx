import type { FormEvent } from 'react';

type SearchBarProps = {
  placeholder: string;
  inputId?: string;
  defaultValue?: string;
  /** Controlled value (omit with `onValueChange` for uncontrolled + `defaultValue`). */
  value?: string;
  onValueChange?: (value: string) => void;
  /** Enter / form submit — receives trimmed query. */
  onSubmitQuery?: (query: string) => void;
  /** Persistent orange ring (e.g. active query on Discover Search). */
  emphasized?: boolean;
};

export default function SearchBar({
  placeholder,
  inputId = 'discover-search',
  defaultValue,
  value,
  onValueChange,
  onSubmitQuery,
  emphasized = false,
}: SearchBarProps) {
  const controlled = value !== undefined;
  const shell = emphasized
    ? 'border border-solid border-[#ff5b00] shadow-[inset_0_1px_0_rgba(255,255,255,0.055),0_5px_18px_rgba(0,0,0,0.32)] focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_6px_20px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,91,0,0.35)]'
    : 'shadow-[inset_0_1px_0_rgba(255,255,255,0.055),0_5px_18px_rgba(0,0,0,0.32)] transition-[box-shadow] focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_6px_20px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,91,0,0.2)]';

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = controlled
      ? value
      : String(new FormData(e.currentTarget).get('q') ?? '');
    onSubmitQuery?.(raw.trim());
  }

  return (
    <form
      className={[
        'flex h-12 w-full max-w-[358px] items-center gap-3 rounded-2xl bg-[#101018] px-4',
        shell,
      ].join(' ')}
      onSubmit={handleSubmit}
      role="search"
    >
      <span className="pointer-events-none flex h-[18px] w-[18px] shrink-0 text-[rgba(255,255,255,0.45)]" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.35-4.35"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <label htmlFor={inputId} className="sr-only">
        Search
      </label>
      <input
        id={inputId}
        type="search"
        name="q"
        placeholder={placeholder}
        {...(controlled
          ? { value, onChange: (ev) => onValueChange?.(ev.target.value) }
          : { defaultValue })}
        className="h-full min-w-0 flex-1 bg-transparent text-[12px] leading-normal text-white placeholder:text-[rgba(255,255,255,0.5)] outline-none focus-visible:outline-none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
    </form>
  );
}

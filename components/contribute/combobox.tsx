"use client";

import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ComboboxProps {
  id?: string;
  name: string;
  options: string[];
  defaultValue?: string;
  placeholder?: string;
  allowCreate?: boolean;
  required?: boolean;
}

/** Searchable dropdown backed by a hidden input so it submits like a normal form field. Optionally lets the user add a value that isn't in `options` yet. */
export function Combobox({ id, name, options, defaultValue = "", placeholder, allowCreate, required }: ComboboxProps) {
  const [value, setValue] = useState(defaultValue);
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery(value);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [value]);

  const filtered = options.filter((option) => option.toLowerCase().includes(query.toLowerCase()));
  const exactMatch = options.some((option) => option.toLowerCase() === query.toLowerCase());

  function select(option: string) {
    setValue(option);
    setQuery(option);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={value} required={required} />
      <Input
        id={id}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setValue(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {open ? (
        <div className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md">
          {filtered.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => select(option)}
              className="flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
            >
              {option}
            </button>
          ))}
          {allowCreate && query && !exactMatch ? (
            <button
              type="button"
              onClick={() => select(query)}
              className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm text-action-blue hover:bg-accent"
            >
              <Plus className="size-3.5" />
              Add &quot;{query}&quot;
            </button>
          ) : null}
          {!allowCreate && filtered.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">No matches</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

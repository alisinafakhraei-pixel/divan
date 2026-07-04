import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FacetOption {
  value: string;
  label: string;
}

/** A Select whose trigger resolves the current value to its option label — Base UI's SelectValue shows the raw value otherwise. */
export function FacetSelect({
  value,
  onValueChange,
  allLabel,
  options,
}: {
  value: string;
  onValueChange: (value: string) => void;
  allLabel: string;
  options: FacetOption[];
}) {
  const labels: Record<string, string> = { all: allLabel };
  for (const o of options) labels[o.value] = o.label;

  return (
    <Select value={value} onValueChange={(v) => onValueChange(v as string)}>
      <SelectTrigger size="sm">
        <SelectValue>{(v: string) => labels[v] ?? allLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

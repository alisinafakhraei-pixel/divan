import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

export type ViewMode = "grid" | "table";

interface GridTableToggleProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}

export function GridTableToggle({ value, onChange }: GridTableToggleProps) {
  return (
    <div className="inline-flex gap-1 rounded-full border border-border p-1">
      <Button
        size="icon-sm"
        variant={value === "grid" ? "default" : "ghost"}
        onClick={() => onChange("grid")}
        aria-label="Grid view"
      >
        <LayoutGrid />
      </Button>
      <Button
        size="icon-sm"
        variant={value === "table" ? "default" : "ghost"}
        onClick={() => onChange("table")}
        aria-label="Table view"
      >
        <List />
      </Button>
    </div>
  );
}

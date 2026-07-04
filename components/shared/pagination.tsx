import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        size="icon-sm"
        variant="ghost"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft />
      </Button>
      {pages.map((p) => (
        <Button
          key={p}
          size="icon-sm"
          variant={p === page ? "default" : "ghost"}
          onClick={() => onPageChange(p)}
          className={cn("text-sm")}
        >
          {p}
        </Button>
      ))}
      <Button
        size="icon-sm"
        variant="ghost"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

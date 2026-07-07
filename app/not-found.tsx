import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
      <img src="/logo.svg" alt="Divan" className="h-12 w-auto opacity-80" />
      <div className="space-y-2">
        <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">404</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          This page led nowhere.
        </h1>
        <p className="mx-auto max-w-md text-base text-muted-foreground">
          Even the most ambitious founders hit a dead end sometimes. This one just happens to be a URL.
        </p>
      </div>
      <Button render={<Link href="/" />}>
        <ArrowLeft />
        Back to home
      </Button>
    </div>
  );
}

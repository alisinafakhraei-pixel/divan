"use client";

import { Button } from "@/components/ui/button";
import { Check, Link as LinkIcon, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  // Read after mount, not during render, so SSR and the first client render match (avoids a hydration mismatch).
  const [url, setUrl] = useState("");
  useEffect(() => setUrl(window.location.href), []);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? <Check /> : <LinkIcon />}
        {copied ? "Copied" : "Copy link"}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        aria-label="Share on X"
        render={
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        <Share2 />
        X
      </Button>
      <Button
        variant="ghost"
        size="sm"
        aria-label="Share on LinkedIn"
        render={
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        <Share2 />
        LinkedIn
      </Button>
    </div>
  );
}

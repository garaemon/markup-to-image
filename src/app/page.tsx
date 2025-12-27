'use client';

import { Suspense, useState } from 'react';
import { Header } from "@/components/header";
import { MarkupEditor } from "@/components/markup-editor";
import { MarkupPreview } from "@/components/markup-preview";
import { useMarkupState } from "@/hooks/use-markup-state";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function MarkupApp() {
  const { state, updateState, isLoaded } = useMarkupState();
  const [autoWidth, setAutoWidth] = useState<number>(600);

  const handleShare = () => {
    if (!navigator.clipboard) {
      toast.error("Clipboard access not available");
      return;
    }
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header onShare={handleShare} />
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 border-r p-6 overflow-y-auto bg-background">
           <MarkupEditor state={state} onChange={updateState} autoWidth={autoWidth} />
        </div>
        <div className="w-full md:w-1/2 p-6 overflow-hidden bg-muted/30">
           <MarkupPreview state={state} onAutoWidthChange={setAutoWidth} />
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <MarkupApp />
    </Suspense>
  );
}
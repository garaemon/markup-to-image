'use client';

import { Suspense } from 'react';
import { Header } from "@/components/header";
import { MarkupEditor } from "@/components/markup-editor";
import { MarkupPreview } from "@/components/markup-preview";
import { Usage } from "@/components/usage";
import { useMarkupState } from "@/hooks/use-markup-state";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function MarkupApp() {
  const { state, updateState, isLoaded } = useMarkupState();

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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="flex flex-col h-screen">
        <Header onShare={handleShare} />
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-1/2 border-r p-6 overflow-y-auto bg-background">
             <MarkupEditor state={state} onChange={updateState} />
          </div>
          <div className="w-full md:w-1/2 p-6 overflow-hidden bg-muted/30">
             <MarkupPreview state={state} />
          </div>
        </main>
      </div>
      <div className="border-t py-12 bg-muted/10">
        <Usage />
      </div>
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
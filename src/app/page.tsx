'use client';

import { Suspense, useState } from 'react';
import { Header } from "@/components/header";
import { MarkupEditor } from "@/components/markup-editor";
import { MarkupPreview } from "@/components/markup-preview";
import { Usage } from "@/components/usage";
import { useMarkupState } from "@/hooks/use-markup-state";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

function MarkupApp() {
  const { state, updateState, isLoaded } = useMarkupState();
  const [autoWidth, setAutoWidth] = useState<number>(600);
  const [activeTab, setActiveTab] = useState<string>('editor');

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

        {/* Mobile View Switcher */}
        <div className="md:hidden px-6 py-2 border-b bg-background">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2" data-testid="view-switcher">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          <div className={cn(
            "w-full md:w-1/2 border-r p-6 overflow-y-auto bg-background transition-all",
            // Mobile: show only if editor is active
            activeTab === 'preview' ? 'hidden md:block' : 'block'
          )}>
            <MarkupEditor state={state} onChange={updateState} autoWidth={autoWidth} />
          </div>
          <div className={cn(
            "w-full md:w-1/2 p-6 overflow-hidden bg-muted/30 transition-all",
            // Mobile: show only if preview is active
            activeTab === 'editor' ? 'hidden md:block' : 'block'
          )}>
            <MarkupPreview state={state} onAutoWidthChange={setAutoWidth} />
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

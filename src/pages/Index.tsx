import { PDFViewer } from '@/components/PDFViewer';
import { NotesPanel } from '@/components/NotesPanel';
import { useHighlight } from '@/hooks/useHighlight';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const { activeHighlight, highlightText } = useHighlight();

  const handleCitationClick = (pageNumber: number, keyword: string) => {
    highlightText(pageNumber, keyword);
    toast.success(`Navigating to page ${pageNumber}`, {
      description: 'Highlighting: ' + keyword,
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="bg-card border-b border-border px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">
              PDF Citation Viewer
            </h1>
            <p className="text-sm text-muted-foreground">
              Maersk Q2 2025 Interim Report
            </p>
          </div>
        </div>
      </header>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={65} minSize={30}>
          <PDFViewer 
            file="/maersk.pdf" 
            activeHighlight={activeHighlight}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={35} minSize={25}>
          <NotesPanel onCitationClick={handleCitationClick} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;

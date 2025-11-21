import { useState, useCallback, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, AlertCircle } from 'lucide-react';
import { Highlight } from '@/hooks/useHighlight';
import { Alert, AlertDescription } from './ui/alert';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  file: string;
  activeHighlight: Highlight | null;
}

export const PDFViewer = ({ file, activeHighlight }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const highlightOverlayRef = useRef<HTMLDivElement | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = () => {
    setError('Failed to load PDF. Please ensure maersk.pdf is in the public folder.');
    setLoading(false);
  };

  const scrollToPage = useCallback((targetPage: number) => {
    const pageElement = pageRefs.current.get(targetPage);
    if (pageElement && scrollAreaRef.current) {
      pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setPageNumber(targetPage);
    }
  }, []);

  useEffect(() => {
    if (activeHighlight) {
      scrollToPage(activeHighlight.pageNumber);
    }
  }, [activeHighlight, scrollToPage]);

  // Highlight logic using PDF.js correct positioning
  const applyHighlights = useCallback((force = false) => {
    console.log('📌 applyHighlights called with:', activeHighlight);
    
    // Clean up any existing highlights
    document.querySelectorAll('.pdf-highlight-overlay').forEach(el => el.remove());
    
    if (!activeHighlight) {
      console.log('ℹ️ No active highlight to apply');
      return;
    }

    const pageContainer = document.querySelector(
      `[data-page-number="${activeHighlight.pageNumber}"]`
    ) as HTMLElement;

    if (!pageContainer) {
      console.error('❌ Page container not found for page', activeHighlight.pageNumber);
      return;
    }
    console.log('📄 Page container found:', pageContainer);

    // Ensure page container has proper styling
    pageContainer.style.position = 'relative';

    const textLayer = pageContainer.querySelector('.react-pdf__Page__textContent');
    if (!textLayer) {
      console.error('❌ Text layer not found on page', activeHighlight.pageNumber);
      // Try to force render text layer
      const page = pageContainer.querySelector('.react-pdf__Page');
      if (page) {
        console.log('🔄 Attempting to force render text layer...');
        const event = new CustomEvent('textlayerrendered', { detail: { pageNumber: activeHighlight.pageNumber } });
        page.dispatchEvent(event);
      }
      return;
    }

    // Debug text layer content
    console.log('📝 Text layer content:', textLayer.innerHTML);
    console.log('🔍 Text layer children:', textLayer.children.length);
    
    // Ensure text layer is visible and has content
    if (textLayer.children.length === 0) {
      console.warn('⚠️ Text layer has no children, waiting for content...');
      // Try again after a short delay if text layer isn't ready
      setTimeout(applyHighlights, 100);
      return;
    }

    const spans = Array.from(textLayer.querySelectorAll('span'));
    console.log(`🔍 Found ${spans.length} text spans on page ${activeHighlight.pageNumber}`);
    
    // Debug first few spans
    spans.slice(0, 5).forEach((span, i) => {
      console.log(`  Span ${i + 1}:`, {
        text: span.textContent,
        className: span.className,
        style: span.getAttribute('style')
      });
    });
    
    if (spans.length === 0) {
      console.error('❌ No text spans found in text layer');
      return;
    }

    const target = activeHighlight.text.toLowerCase().trim();
    console.log(`🔎 Searching for: "${target}"`);

    // Try to find exact match first
    for (let i = 0; i < spans.length; i++) {
      const span = spans[i];
      const spanText = span.textContent?.toLowerCase().trim() || '';
      
      console.log(`  Checking span ${i}: "${spanText}"`);
      
      if (spanText === target) {
        console.log('✅ Found exact match!');
        highlightSpan(span, pageContainer);
        return;
      }
    }

    // If no exact match, try combining spans
    for (let i = 0; i < spans.length; i++) {
      let combined = '';
      const matchedSpans: Element[] = [];
      
      for (let j = i; j < Math.min(i + 10, spans.length); j++) {
        const span = spans[j];
        const spanText = span.textContent || '';
        combined += spanText;
        matchedSpans.push(span);
        
        if (combined.toLowerCase().trim() === target) {
          highlightSpans(matchedSpans, pageContainer);
          return;
        }
        
        // If we've gone too far, break early
        if (combined.length > target.length * 2) {
          break;
        }
      }
    }
    
    console.warn(`⚠️ Text not found: "${target}"`);
    
    function highlightSpan(span: Element, container: HTMLElement) {
      const rect = span.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const overlay = createHighlightOverlay(
        rect.left - containerRect.left,
        rect.top - containerRect.top,
        rect.width,
        rect.height
      );
      
      container.style.position = 'relative';
      container.appendChild(overlay);
      console.log('✅ Highlight applied to single span');
    }
    
    function highlightSpans(spans: Element[], container: HTMLElement) {
      const containerRect = container.getBoundingClientRect();
      const rects = spans.map(span => span.getBoundingClientRect());
      
      const left = Math.min(...rects.map(r => r.left));
      const right = Math.max(...rects.map(r => r.right));
      const top = Math.min(...rects.map(r => r.top));
      const bottom = Math.max(...rects.map(r => r.bottom));
      
      const overlay = createHighlightOverlay(
        left - containerRect.left,
        top - containerRect.top,
        right - left,
        bottom - top
      );
      
      container.style.position = 'relative';
      container.appendChild(overlay);
      console.log(`✅ Highlight applied to ${spans.length} spans`);
    }
    
    function createHighlightOverlay(left: number, top: number, width: number, height: number) {
      const overlay = document.createElement('div');
      overlay.className = 'pdf-highlight-overlay';
      overlay.style.cssText = `
        position: absolute;
        left: ${left}px;
        top: ${top}px;
        width: ${width}px;
        height: ${height}px;
        background: rgba(255, 255, 0, 0.35);
        border-radius: 2px;
        pointer-events: none;
        z-index: 50;
      `;
      return overlay;
    }
  }, [activeHighlight]);

  // Effect to apply highlights when activeHighlight changes
  useEffect(() => {
    if (!activeHighlight) {
      document.querySelectorAll('.pdf-highlight-overlay').forEach(el => el.remove());
      return;
    }

    console.log('🔍 Highlight target changed, applying highlights...');
    
    let retryCount = 0;
    const maxRetries = 5;
    
    const tryApplyHighlights = () => {
      console.log(`🔄 Attempt ${retryCount + 1} to apply highlights...`);
      applyHighlights(retryCount > 0); // Force after first attempt
      
      // Check if highlights were applied
      const checkHighlights = () => {
        const hasHighlights = document.querySelectorAll('.pdf-highlight-overlay').length > 0;
        if (hasHighlights) {
          console.log('✅ Highlights applied successfully');
          return true;
        }
        return false;
      };
      
      if (!checkHighlights() && retryCount < maxRetries) {
        retryCount++;
        setTimeout(tryApplyHighlights, 200);
      }
    };
    
    // Initial try after a short delay
    const timer = setTimeout(tryApplyHighlights, 100);
    
    return () => {
      clearTimeout(timer);
      document.querySelectorAll('.pdf-highlight-overlay').forEach(el => el.remove());
    };
  }, [activeHighlight, applyHighlights]);
  
  // Re-apply highlights on zoom or page change
  useEffect(() => {
    if (activeHighlight) {
      console.log('� Re-applying highlights due to view change...');
      const timer = setTimeout(applyHighlights, 100);
      return () => clearTimeout(timer);
    }
  }, [scale, pageNumber, activeHighlight, applyHighlights]);

  const changePage = (offset: number) => {
    const newPage = pageNumber + offset;
    if (newPage >= 1 && newPage <= numPages) {
      scrollToPage(newPage);
    }
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30 p-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-muted/30">
      <div className="flex items-center justify-between p-4 bg-card border-b border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-foreground font-medium min-w-[100px] text-center">
            {loading ? 'Loading...' : `Page ${pageNumber} of ${numPages}`}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages || loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={zoomOut} disabled={loading}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="outline" size="sm" onClick={zoomIn} disabled={loading}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-8 flex flex-col items-center gap-4">
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center p-12">
                <div className="text-muted-foreground">Loading PDF...</div>
              </div>
            }
            className="shadow-lg"
          >
            {Array.from(new Array(numPages), (_, index) => (
              <div
                key={`page_${index + 1}`}
                ref={(el) => {
                  if (el) pageRefs.current.set(index + 1, el);
                }}
                data-page-number={index + 1}
                className="relative mb-4"
              >
                <Page
                  pageNumber={index + 1}
                  scale={scale}
                  className="shadow-md"
                  renderTextLayer={true}
                  renderAnnotationLayer={false}
                  onRenderSuccess={() => {
                    if (activeHighlight && activeHighlight.pageNumber === index + 1) {
                      // Slight delay to ensure text layer is fully rendered
                      setTimeout(applyHighlights, 100);
                    }
                  }}
                />
              </div>
            ))}
          </Document>
        </div>
      </ScrollArea>
    </div>
  );
};

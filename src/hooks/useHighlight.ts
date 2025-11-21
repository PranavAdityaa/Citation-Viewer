import { useState, useCallback } from 'react';

export interface Highlight {
  pageNumber: number;
  text: string;
  id: string;
}

export const useHighlight = () => {
  const [activeHighlight, setActiveHighlight] = useState<Highlight | null>(null);

  const highlightText = useCallback((pageNumber: number, text: string) => {
    const id = `highlight-${pageNumber}-${Date.now()}`;
    setActiveHighlight({ pageNumber, text, id });
  }, []);

  const clearHighlight = useCallback(() => {
    setActiveHighlight(null);
  }, []);

  return {
    activeHighlight,
    highlightText,
    clearHighlight,
  };
};

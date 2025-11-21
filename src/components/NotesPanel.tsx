import { Citation } from "./Citation";
import { ScrollArea } from "./ui/scroll-area";

interface NotesPanelProps {
  onCitationClick: (pageNumber: number, keyword: string) => void;
}

export const NotesPanel = ({ onCitationClick }: NotesPanelProps) => {
  const citationMap = {
    1: { page: 3, keyword: "EBITDA of USD 2.3bn" },
    2: { page: 5, keyword: "EBITDA increased to USD 2.3bn" },
    3: { page: 15, keyword: "Gain on sale of non-current assets" }
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground">Analysis Notes</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Click on citations to view references in the PDF
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">
              2025 Performance Overview
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              Maersk reported Q2 2025 revenue of USD 13.1bn, up from USD 12.8bn in Q2 2024, 
              driven by higher volumes and improved performance across Ocean, Logistics & Services, 
              and Terminals. EBITDA increased to USD 2.298bn from USD 2.144bn, reflecting operational 
              improvements and cost discipline.
              <Citation 
                number={1} 
                onClick={() => onCitationClick(citationMap[1].page, citationMap[1].keyword)}
              />
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">
              Operational Efficiency
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              Operational efficiency improved across segments, especially in Logistics & Services 
              where the EBIT margin increased to 4.8% (from 3.5%). Terminals saw strong utilization 
              and a higher revenue per move, supporting margin uplift.
              <Citation 
                number={2} 
                onClick={() => onCitationClick(citationMap[2].page, citationMap[2].keyword)}
              />
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">
              Asset Management
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              The "Gain on sale of non-current assets, etc." was USD 25m in Q2 2025, 
              significantly below the USD 208m reported in Q2 2024. This gain is recorded 
              below EBITDA, meaning it does not affect EBITDA calculations.
              <Citation 
                number={3} 
                onClick={() => onCitationClick(citationMap[3].page, citationMap[3].keyword)}
              />
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">
              Strategic Implications
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              These indicators reflect stronger operational execution and improved demand 
              conditions, despite global uncertainty.
            </p>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};

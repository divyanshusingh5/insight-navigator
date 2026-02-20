import { useState } from "react";
import { ChevronDown, Code, Edit2, GitBranch, History, MessageSquare, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GlossaryMetric } from "@/data/glossaryData";

interface GlossaryCardsProps {
  metrics: GlossaryMetric[];
  allMetrics: GlossaryMetric[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onEdit: (metric: GlossaryMetric) => void;
  onDelete: (id: string) => void;
  onShowChangelog: (metric: GlossaryMetric) => void;
  onShowLineage: (metric: GlossaryMetric) => void;
}

export const GlossaryCards = ({
  metrics,
  allMetrics,
  favorites,
  onToggleFavorite,
  onEdit,
  onDelete,
  onShowChangelog,
  onShowLineage,
}: GlossaryCardsProps) => {
  const [expandedSql, setExpandedSql] = useState<string | null>(null);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
      {metrics.map((metric) => {
        const isFav = favorites.has(metric.id);
        const relatedNames = (metric.relatedMetricIds || [])
          .map((rid) => allMetrics.find((m) => m.id === rid)?.name)
          .filter(Boolean);

        return (
          <div
            key={metric.id}
            className={`rounded-lg border bg-card p-5 hover:shadow-md transition-shadow group ${
              isFav ? "border-yellow-400/50 ring-1 ring-yellow-400/20" : "border-border"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-2">
                <button
                  onClick={() => onToggleFavorite(metric.id)}
                  className="mt-0.5 p-0.5 rounded hover:bg-accent transition-colors"
                >
                  <Star
                    className={`h-4 w-4 transition-colors ${
                      isFav
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/40 hover:text-yellow-400"
                    }`}
                  />
                </button>
                <div>
                  <h3 className="font-semibold text-foreground">{metric.name}</h3>
                  <Badge variant="outline" className="text-xs mt-1 font-normal">{metric.dataset}</Badge>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onShowLineage(metric)} title="Lineage">
                  <GitBranch className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onShowChangelog(metric)} title="History">
                  <History className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(metric)}>
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(metric.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3">{metric.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {metric.synonyms.map((s) => (
                <span key={s} className="rounded-md bg-tag-bg text-tag-text border border-tag-border px-2 py-0.5 text-xs">{s}</span>
              ))}
            </div>

            {/* Related metrics */}
            {relatedNames.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                <GitBranch className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                {relatedNames.map((name) => (
                  <Badge key={name} variant="secondary" className="text-xs">{name}</Badge>
                ))}
              </div>
            )}

            {/* SQL Patterns collapsible */}
            <button
              onClick={() => setExpandedSql(expandedSql === metric.id ? null : metric.id)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <Code className="h-3.5 w-3.5" />
              <span>SQL ({metric.sqlPatterns.length})</span>
              <ChevronDown
                className={`h-3 w-3 ml-auto transition-transform ${expandedSql === metric.id ? "rotate-180" : ""}`}
              />
            </button>

            {expandedSql === metric.id && (
              <div className="mt-2 space-y-2 animate-fade-in">
                {metric.sqlPatterns.map((sp) => (
                  <div key={sp.id} className="rounded-md bg-muted p-2.5">
                    <p className="text-xs font-medium text-foreground mb-1">{sp.label}</p>
                    <code className="text-xs text-muted-foreground font-mono block whitespace-pre-wrap">{sp.query}</code>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span className="italic">"{metric.sampleQuestion}"</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

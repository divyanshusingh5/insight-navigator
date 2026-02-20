import { useState } from "react";
import { ChevronDown, ChevronRight, Code, Edit2, MessageSquare, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GlossaryMetric } from "@/data/glossaryData";

interface GlossaryTableProps {
  metrics: GlossaryMetric[];
  onEdit: (metric: GlossaryMetric) => void;
  onDelete: (id: string) => void;
}

export const GlossaryTable = ({ metrics, onEdit, onDelete }: GlossaryTableProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const grouped = metrics.reduce((acc, m) => {
    if (!acc[m.category]) acc[m.category] = [];
    acc[m.category].push(m);
    return acc;
  }, {} as Record<string, GlossaryMetric[]>);

  return (
    <div className="space-y-6 animate-fade-in">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-foreground">{category}</span>
            <span className="text-xs text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
              {items.length}
            </span>
          </div>

          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="w-8 px-3 py-2.5" />
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Metric / KPI
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                    Description
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                    Dataset
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                    Synonyms
                  </th>
                  <th className="w-24 px-3 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {items.map((metric) => {
                  const isExpanded = expandedId === metric.id;
                  return (
                    <TableRow
                      key={metric.id}
                      metric={metric}
                      isExpanded={isExpanded}
                      onToggle={() => setExpandedId(isExpanded ? null : metric.id)}
                      onEdit={() => onEdit(metric)}
                      onDelete={() => onDelete(metric.id)}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

function TableRow({
  metric,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
}: {
  metric: GlossaryMetric;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <>
      <tr
        className="border-b border-border last:border-0 hover:bg-surface-hover cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <td className="px-3 py-3">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </td>
        <td className="px-4 py-3">
          <span className="font-semibold text-sm text-foreground">{metric.name}</span>
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <span className="text-sm text-muted-foreground line-clamp-1">{metric.description}</span>
        </td>
        <td className="px-4 py-3 hidden lg:table-cell">
          <Badge variant="outline" className="text-xs font-normal">
            {metric.dataset}
          </Badge>
        </td>
        <td className="px-4 py-3 hidden lg:table-cell">
          <div className="flex flex-wrap gap-1">
            {metric.synonyms.slice(0, 3).map((s) => (
              <span
                key={s}
                className="inline-block rounded-md bg-tag-bg text-tag-text border border-tag-border px-2 py-0.5 text-xs"
              >
                {s}
              </span>
            ))}
            {metric.synonyms.length > 3 && (
              <span className="text-xs text-muted-foreground">+{metric.synonyms.length - 3}</span>
            )}
          </div>
        </td>
        <td className="px-3 py-3">
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-muted/30">
          <td colSpan={6} className="px-6 py-4">
            <div className="grid gap-4 md:grid-cols-2 animate-fade-in">
              {/* Description (mobile) */}
              <div className="md:hidden">
                <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
                <p className="text-sm text-foreground">{metric.description}</p>
              </div>

              {/* SQL Patterns */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5" />
                  SQL Patterns ({metric.sqlPatterns.length})
                </p>
                <div className="space-y-2">
                  {metric.sqlPatterns.map((sp) => (
                    <div key={sp.id} className="rounded-md border border-border bg-card p-3">
                      <p className="text-xs font-medium text-foreground mb-1">{sp.label}</p>
                      <code className="text-xs text-muted-foreground font-mono block whitespace-pre-wrap">
                        {sp.query}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Question & Synonyms */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Sample Question
                  </p>
                  <div className="rounded-md border border-border bg-card p-3">
                    <p className="text-sm text-foreground italic">"{metric.sampleQuestion}"</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">All Synonyms</p>
                  <div className="flex flex-wrap gap-1.5">
                    {metric.synonyms.map((s) => (
                      <span
                        key={s}
                        className="inline-block rounded-md bg-tag-bg text-tag-text border border-tag-border px-2 py-1 text-xs"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Dataset</p>
                  <Badge variant="outline">{metric.dataset}</Badge>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowRight, GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { GlossaryMetric } from "@/data/glossaryData";

interface LineageDialogProps {
  metric: GlossaryMetric | null;
  allMetrics: GlossaryMetric[];
  onClose: () => void;
}

export const LineageDialog = ({ metric, allMetrics, onClose }: LineageDialogProps) => {
  if (!metric) return null;

  const relatedMetrics = (metric.relatedMetricIds || [])
    .map((id) => allMetrics.find((m) => m.id === id))
    .filter(Boolean) as GlossaryMetric[];

  // Find metrics that reference this metric
  const referencedBy = allMetrics.filter(
    (m) => m.id !== metric.id && (m.relatedMetricIds || []).includes(metric.id)
  );

  return (
    <Dialog open={!!metric} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            Metric Lineage — {metric.name}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-6">
          {/* Visual lineage */}
          <div className="flex flex-col items-center gap-2">
            {/* Upstream: metrics that reference this */}
            {referencedBy.length > 0 && (
              <>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Referenced by</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {referencedBy.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-lg border border-border bg-card px-3 py-2 text-center"
                    >
                      <p className="text-sm font-medium text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.category}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-center">
                  <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                </div>
              </>
            )}

            {/* Center: current metric */}
            <div className="rounded-lg border-2 border-primary bg-primary/5 px-5 py-3 text-center">
              <p className="text-base font-semibold text-foreground">{metric.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{metric.category} · {metric.dataset}</p>
            </div>

            {/* Downstream: related metrics */}
            {relatedMetrics.length > 0 && (
              <>
                <div className="flex flex-col items-center">
                  <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                </div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Depends on</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {relatedMetrics.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-lg border border-border bg-card px-3 py-2 text-center"
                    >
                      <p className="text-sm font-medium text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.category}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {relatedMetrics.length === 0 && referencedBy.length === 0 && (
              <div className="py-6 text-center">
                <GitBranch className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No relationships defined yet</p>
                <p className="text-xs text-muted-foreground mt-1">Edit this metric to add related metrics</p>
              </div>
            )}
          </div>

          {/* Details */}
          {relatedMetrics.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Related Metrics Detail</p>
              <div className="space-y-2">
                {relatedMetrics.map((m) => (
                  <div key={m.id} className="rounded-md border border-border bg-card p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{m.name}</span>
                      <Badge variant="outline" className="text-xs">{m.dataset}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{m.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

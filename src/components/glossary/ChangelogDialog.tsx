import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { History } from "lucide-react";
import type { GlossaryMetric } from "@/data/glossaryData";

interface ChangelogDialogProps {
  metric: GlossaryMetric | null;
  onClose: () => void;
}

export const ChangelogDialog = ({ metric, onClose }: ChangelogDialogProps) => {
  if (!metric) return null;

  const entries = [...(metric.changelog || [])].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Dialog open={!!metric} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Change History — {metric.name}
          </DialogTitle>
        </DialogHeader>

        {entries.length === 0 ? (
          <div className="py-8 text-center">
            <History className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No changes recorded yet</p>
            <p className="text-xs text-muted-foreground mt-1">Changes will appear here when this metric is edited</p>
          </div>
        ) : (
          <div className="relative mt-2">
            {/* Timeline line */}
            <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />

            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="relative pl-8">
                  {/* Dot */}
                  <div className="absolute left-[9px] top-1.5 h-2 w-2 rounded-full bg-primary" />

                  <div className="rounded-md border border-border bg-card p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-foreground capitalize">{entry.field}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex gap-2 text-xs">
                        <span className="text-destructive/70 shrink-0">−</span>
                        <span className="text-muted-foreground line-through">{entry.oldValue || "(empty)"}</span>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="text-green-500 shrink-0">+</span>
                        <span className="text-foreground">{entry.newValue || "(empty)"}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">by {entry.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

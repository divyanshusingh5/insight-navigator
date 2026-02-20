import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, DATASETS, type GlossaryMetric, type SqlPattern } from "@/data/glossaryData";

interface MetricDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metric: GlossaryMetric | null;
  onSave: (metric: GlossaryMetric) => void;
}

const emptyMetric: GlossaryMetric = {
  id: "",
  name: "",
  description: "",
  category: "Metric",
  dataset: "Sales",
  synonyms: [],
  sqlPatterns: [{ id: crypto.randomUUID(), label: "", query: "" }],
  sampleQuestion: "",
};

export const MetricDialog = ({ open, onOpenChange, metric, onSave }: MetricDialogProps) => {
  const [form, setForm] = useState<GlossaryMetric>(emptyMetric);
  const [synonymInput, setSynonymInput] = useState("");

  useEffect(() => {
    if (open) {
      if (metric) {
        setForm(metric);
        setSynonymInput(metric.synonyms.join(", "));
      } else {
        setForm({ ...emptyMetric, id: crypto.randomUUID() });
        setSynonymInput("");
      }
    }
  }, [open, metric]);

  const updateField = <K extends keyof GlossaryMetric>(key: K, value: GlossaryMetric[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addSqlPattern = () => {
    setForm((prev) => ({
      ...prev,
      sqlPatterns: [...prev.sqlPatterns, { id: crypto.randomUUID(), label: "", query: "" }],
    }));
  };

  const updateSqlPattern = (id: string, field: keyof SqlPattern, value: string) => {
    setForm((prev) => ({
      ...prev,
      sqlPatterns: prev.sqlPatterns.map((sp) => (sp.id === id ? { ...sp, [field]: value } : sp)),
    }));
  };

  const removeSqlPattern = (id: string) => {
    setForm((prev) => ({
      ...prev,
      sqlPatterns: prev.sqlPatterns.filter((sp) => sp.id !== id),
    }));
  };

  const handleSubmit = () => {
    const synonyms = synonymInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onSave({ ...form, synonyms });
  };

  const categories = CATEGORIES.filter((c) => c !== "All");
  const datasets = DATASETS.filter((d) => d !== "All Datasets");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{metric ? "Edit Metric / KPI" : "Add Metric / KPI"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. Revenue, CAC, GMV"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="What does this metric represent?"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => updateField("category", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Dataset</Label>
              <Select value={form.dataset} onValueChange={(v) => updateField("dataset", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {datasets.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Synonyms (comma-separated)</Label>
            <Input
              value={synonymInput}
              onChange={(e) => setSynonymInput(e.target.value)}
              placeholder="e.g. income, earnings, sales"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>SQL Patterns</Label>
              <Button variant="ghost" size="sm" onClick={addSqlPattern} className="gap-1 text-xs h-7">
                <Plus className="h-3 w-3" />
                Add Pattern
              </Button>
            </div>
            <div className="space-y-3">
              {form.sqlPatterns.map((sp, idx) => (
                <div key={sp.id} className="rounded-md border border-border p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={sp.label}
                      onChange={(e) => updateSqlPattern(sp.id, "label", e.target.value)}
                      placeholder={`Pattern ${idx + 1} label`}
                      className="text-sm"
                    />
                    {form.sqlPatterns.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-destructive"
                        onClick={() => removeSqlPattern(sp.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <Textarea
                    value={sp.query}
                    onChange={(e) => updateSqlPattern(sp.id, "query", e.target.value)}
                    placeholder="SELECT ..."
                    className="font-mono text-xs"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Sample Question</Label>
            <Input
              value={form.sampleQuestion}
              onChange={(e) => updateField("sampleQuestion", e.target.value)}
              placeholder="e.g. What is our total revenue?"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!form.name}>
              {metric ? "Save Changes" : "Add Metric"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

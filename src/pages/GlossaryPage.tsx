import { useState } from "react";
import { Search, Filter, LayoutGrid, LayoutList, Plus, BookOpen, ChevronDown, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORIES, DATASETS, SAMPLE_METRICS, type GlossaryMetric, type ChangelogEntry } from "@/data/glossaryData";
import { GlossaryTable } from "@/components/glossary/GlossaryTable";
import { GlossaryCards } from "@/components/glossary/GlossaryCards";
import { MetricDialog } from "@/components/glossary/MetricDialog";
import { ChangelogDialog } from "@/components/glossary/ChangelogDialog";
import { LineageDialog } from "@/components/glossary/LineageDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const GlossaryPage = () => {
  const [metrics, setMetrics] = useState<GlossaryMetric[]>(SAMPLE_METRICS);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDataset, setActiveDataset] = useState("All Datasets");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<GlossaryMetric | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [changelogMetric, setChangelogMetric] = useState<GlossaryMetric | null>(null);
  const [lineageMetric, setLineageMetric] = useState<GlossaryMetric | null>(null);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = metrics.filter((m) => {
    const matchesSearch =
      search === "" ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase()) ||
      m.synonyms.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === "All" || m.category === activeCategory;
    const matchesDataset = activeDataset === "All Datasets" || m.dataset === activeDataset;
    return matchesSearch && matchesCategory && matchesDataset;
  });

  // Sort: favorites first
  const sorted = [...filtered].sort((a, b) => {
    const aFav = favorites.has(a.id) ? 0 : 1;
    const bFav = favorites.has(b.id) ? 0 : 1;
    return aFav - bFav;
  });

  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    if (cat === "All") {
      acc[cat] = metrics.filter(
        (m) =>
          (activeDataset === "All Datasets" || m.dataset === activeDataset) &&
          (search === "" ||
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.description.toLowerCase().includes(search.toLowerCase()))
      ).length;
    } else {
      acc[cat] = metrics.filter(
        (m) =>
          m.category === cat &&
          (activeDataset === "All Datasets" || m.dataset === activeDataset) &&
          (search === "" ||
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.description.toLowerCase().includes(search.toLowerCase()))
      ).length;
    }
    return acc;
  }, {} as Record<string, number>);

  const handleSave = (metric: GlossaryMetric) => {
    if (editingMetric) {
      // Generate changelog entries for changed fields
      const changes: ChangelogEntry[] = [];
      const oldMetric = metrics.find((m) => m.id === metric.id);
      if (oldMetric) {
        const fields: (keyof GlossaryMetric)[] = ["name", "description", "category", "dataset", "sampleQuestion"];
        fields.forEach((field) => {
          if (String(oldMetric[field]) !== String(metric[field])) {
            changes.push({
              id: crypto.randomUUID(),
              timestamp: new Date().toISOString(),
              field,
              oldValue: String(oldMetric[field]),
              newValue: String(metric[field]),
              user: "You",
            });
          }
        });
        if (oldMetric.synonyms.join(", ") !== metric.synonyms.join(", ")) {
          changes.push({
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            field: "synonyms",
            oldValue: oldMetric.synonyms.join(", "),
            newValue: metric.synonyms.join(", "),
            user: "You",
          });
        }
      }
      const updatedMetric = {
        ...metric,
        changelog: [...(metric.changelog || []), ...changes],
      };
      setMetrics((prev) => prev.map((m) => (m.id === metric.id ? updatedMetric : m)));
    } else {
      setMetrics((prev) => [
        ...prev,
        {
          ...metric,
          id: crypto.randomUUID(),
          relatedMetricIds: metric.relatedMetricIds || [],
          changelog: [],
        },
      ]);
    }
    setEditingMetric(null);
    setDialogOpen(false);
  };

  const handleEdit = (metric: GlossaryMetric) => {
    setEditingMetric(metric);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setMetrics((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Business Glossary</h1>
                <p className="text-sm text-muted-foreground">{metrics.length} metrics & KPIs</p>
              </div>
            </div>
            <Button
              onClick={() => {
                setEditingMetric(null);
                setDialogOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Metric / KPI
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search metrics, KPIs, synonyms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {activeDataset}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {DATASETS.map((ds) => (
                  <DropdownMenuItem
                    key={ds}
                    onClick={() => setActiveDataset(ds)}
                    className={activeDataset === ds ? "bg-accent font-medium" : ""}
                  >
                    {ds}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Favorites count */}
            {favorites.size > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span>{favorites.size} pinned</span>
              </div>
            )}

            <div className="ml-auto flex items-center gap-1 rounded-lg border border-border p-0.5">
              <button
                onClick={() => setViewMode("table")}
                className={`rounded-md p-1.5 transition-colors ${
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutList className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`rounded-md p-1.5 transition-colors ${
                  viewMode === "cards"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {cat}
                <span
                  className={`text-xs ${
                    activeCategory === cat ? "opacity-80" : "text-muted-foreground"
                  }`}
                >
                  {categoryCounts[cat] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-lg font-medium text-foreground">No metrics found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </div>
        ) : viewMode === "table" ? (
          <GlossaryTable
            metrics={sorted}
            allMetrics={metrics}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onShowChangelog={setChangelogMetric}
            onShowLineage={setLineageMetric}
          />
        ) : (
          <GlossaryCards
            metrics={sorted}
            allMetrics={metrics}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onShowChangelog={setChangelogMetric}
            onShowLineage={setLineageMetric}
          />
        )}
      </div>

      <MetricDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        metric={editingMetric}
        allMetrics={metrics}
        onSave={handleSave}
      />

      <ChangelogDialog
        metric={changelogMetric}
        onClose={() => setChangelogMetric(null)}
      />

      <LineageDialog
        metric={lineageMetric}
        allMetrics={metrics}
        onClose={() => setLineageMetric(null)}
      />
    </div>
  );
};

export default GlossaryPage;

import { SkillCategoryWithSkills } from "@/types";
import { Cpu, Database, Cloud, Layout, CheckCircle } from "lucide-react";

interface TechnologyMatrixProps {
  categories: SkillCategoryWithSkills[];
}

export function TechnologyMatrix({ categories }: TechnologyMatrixProps) {
  const getCategoryIcon = (index: number) => {
    switch (index % 4) {
      case 0:
        return <Cpu className="w-4 h-4 text-emerald-400" />;
      case 1:
        return <Database className="w-4 h-4 text-blue-400" />;
      case 2:
        return <Cloud className="w-4 h-4 text-amber-400" />;
      default:
        return <Layout className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <section id="capabilities" className="py-24 border-t border-surface-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14">
          <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Engineering Matrix & Proven Stack
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl">
            A concrete record of technologies applied in production. Every capability is anchored by verified architectural implementations rather than abstract percentages.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, idx) => (
            <div
              key={category.id}
              className="rounded-2xl bg-surface border border-surface-border p-6 sm:p-8 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-surface-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-surface-muted border border-surface-border">
                      {getCategoryIcon(idx)}
                    </div>
                    <h3 className="font-bold text-lg text-white tracking-tight">
                      {category.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {category.skills.length} Stack Components
                  </span>
                </div>

                {/* Skills List */}
                <div className="space-y-4">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-3.5 rounded-xl bg-surface-muted/40 border border-surface-border/70 hover:border-accent/40 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sm text-white">
                          {skill.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-muted-foreground border border-surface-border">
                          Verified
                        </span>
                      </div>

                      {skill.shortDescription && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {skill.shortDescription}
                        </p>
                      )}

                      {skill.evidenceNote && (
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono text-accent/90">
                          <CheckCircle className="w-3 h-3 text-accent shrink-0" />
                          <span className="line-clamp-1">{skill.evidenceNote}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

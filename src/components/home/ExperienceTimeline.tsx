import { ExperienceItem, AchievementItem, EducationItem } from "@/types";
import { Briefcase, Award, GraduationCap, Calendar, MapPin, CheckCircle2, ExternalLink } from "lucide-react";

interface ExperienceTimelineProps {
  experience: ExperienceItem[];
  achievements: AchievementItem[];
  education: EducationItem[];
}

export function ExperienceTimeline({
  experience,
  achievements,
  education,
}: ExperienceTimelineProps) {
  return (
    <section id="experience" className="py-24 border-t border-surface-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Professional Experience (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider mb-2">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Career Progression</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Professional Experience
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Demonstrated leadership across high-scale distributed systems and platform infrastructure.
              </p>
            </div>

            {/* Experience Timeline Items */}
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-surface-border">
              {experience.map((item) => (
                <div key={item.id} className="relative pl-7 sm:pl-10 group">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-2 top-2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 ${
                      item.current
                        ? "bg-accent border-surface shadow-glow"
                        : "bg-surface-border border-surface"
                    }`}
                  />

                  <div className="rounded-2xl bg-surface border border-surface-border p-4 sm:p-6 shadow-card hover:border-accent/40 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-surface-border">
                      <div>
                        <h3 className="font-bold text-base text-white tracking-tight">
                          {item.role}
                        </h3>
                        <div className="text-sm text-accent font-medium">
                          {item.company}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.startDate} &mdash; {item.current ? "Present" : item.endDate}
                        </span>
                        {item.location && (
                          <span className="flex items-center gap-1 hidden sm:flex">
                            <MapPin className="w-3.5 h-3.5" />
                            {item.location}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground mt-3 leading-relaxed">
                      {item.description}
                    </p>

                    {item.highlights && item.highlights.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {item.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-white/90">
                            <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements & Education (5 cols) */}
          <div className="lg:col-span-5 space-y-10">
            {/* Achievements & Certifications */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Validated Credentials</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white mb-6">
                Honors & Certifications
              </h3>

              <div className="space-y-3.5">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="p-4 rounded-xl bg-surface border border-surface-border hover:border-accent/40 transition-colors shadow-subtle"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold block mb-1">
                          {ach.category} &bull; {ach.date}
                        </span>
                        <h4 className="font-semibold text-sm text-white">
                          {ach.title}
                        </h4>
                        <span className="text-xs text-muted-foreground block mt-0.5">
                          Issuer: {ach.issuer}
                        </span>
                      </div>

                      {ach.url && (
                        <a
                          href={ach.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg border border-surface-border text-muted-foreground hover:text-white hover:border-white/20 transition-colors"
                          title="Verify Credential"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    {ach.description && (
                      <p className="text-xs text-muted-foreground mt-2 border-t border-surface-border/60 pt-2">
                        {ach.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            {education.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider mb-2">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Academic Foundation</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white mb-6">
                  Education
                </h3>

                <div className="space-y-4">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      className="p-5 rounded-xl bg-surface border border-surface-border shadow-subtle"
                    >
                      <h4 className="font-semibold text-sm text-white">
                        {edu.degree}
                      </h4>
                      <div className="text-xs text-accent font-medium mt-0.5">
                        {edu.institution}
                      </div>
                      <div className="text-xs font-mono text-muted-foreground mt-1">
                        {edu.startDate} &mdash; {edu.endDate}
                      </div>
                      {edu.gradeOrHonor && (
                        <div className="text-xs text-white/90 font-medium mt-2">
                          {edu.gradeOrHonor}
                        </div>
                      )}
                      {edu.activities && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {edu.activities}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export type ProjectCardModel = {
  id: string;
  title: string;
  cost?: number;
  before_image?: string;
  after_image?: string;
  gift_count?: number;
  materials?: { name: string; cost?: number }[];
  milestones?: { label: string; done?: boolean }[];
  team?: { name: string }[];
  href?: string;
};

export function ProjectCard({ project }: { project: ProjectCardModel }) {
  return (
    <a
      href={project.href || `/projects/${project.id}`}
      className="block rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/25 transition"
    >
      <div className="grid grid-cols-2 gap-px bg-white/10">
        <div className="relative h-24 bg-black/40">
          {project.before_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.before_image} alt="Before" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full grid place-items-center mono text-[10px] text-white/40">BEFORE</div>
          )}
          <span className="absolute left-2 top-2 mono text-[8px] px-1.5 py-0.5 rounded bg-black/70 text-white">
            BEFORE
          </span>
        </div>
        <div className="relative h-24 bg-black/40">
          {project.after_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.after_image} alt="After" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full grid place-items-center mono text-[10px] text-white/40">AFTER</div>
          )}
          <span className="absolute left-2 top-2 mono text-[8px] px-1.5 py-0.5 rounded bg-black/70 text-white">
            AFTER
          </span>
        </div>
      </div>
      <div className="p-3">
        <div className="text-[13px] font-bold text-white">{project.title}</div>
        <div className="mt-1 mono text-[10px] text-white/50">
          £{project.cost ?? 0} · Gifts {project.gift_count ?? 0} · Team {(project.team || []).map((t) => t.name).join(", ") || "—"}
        </div>
        {project.milestones?.length ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {project.milestones.map((m) => (
              <span
                key={m.label}
                className="mono text-[9px] px-2 py-0.5 rounded-full border border-white/10 text-white/70"
              >
                {m.done ? "✓ " : ""}
                {m.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </a>
  );
}

export default ProjectCard;

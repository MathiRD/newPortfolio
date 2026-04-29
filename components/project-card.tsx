import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { Locale, dictionary } from "@/lib/preferences";

type ProjectCardProps = {
  project: {
    titleEn: string;
    titlePt: string;
    descriptionEn: string;
    descriptionPt: string;
    imageUrl: string | null;
    githubUrl: string | null;
    liveUrl: string | null;
    techStack: string[];
    featured: boolean;
  };
  locale: Locale;
};

export function ProjectCard({ project, locale }: ProjectCardProps) {
  const copy = dictionary[locale];
  const title = locale === "pt" ? project.titlePt : project.titleEn;
  const description = locale === "pt" ? project.descriptionPt : project.descriptionEn;

  return (
    <article className="liquid-glass group overflow-hidden rounded-[2rem] transition duration-300 hover:-translate-y-2 hover:shadow-glow">
      <div className="relative h-56 overflow-hidden">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={title}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-surface text-muted">No image</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {project.featured ? (
          <span className="absolute left-5 top-5 rounded-full bg-white/18 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            Featured
          </span>
        ) : null}
      </div>

      <div className="space-y-5 p-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span key={tech} className="rounded-full border border-theme bg-white/5 px-3 py-1 text-xs font-medium text-muted">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              className="button-soft focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5"
            >
              <Github size={16} /> {copy.github}
            </a>
          ) : null}

          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              className="button-primary focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5"
            >
              <ExternalLink size={16} /> {copy.live}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

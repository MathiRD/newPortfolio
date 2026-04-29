import { Project } from "@prisma/client";

type ProjectFormProps = {
  action: (formData: FormData) => void;
  project?: Project;
};

export function ProjectForm({ action, project }: ProjectFormProps) {
  return (
    <form action={action} className="liquid-glass space-y-5 rounded-[2rem] p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <input name="titleEn" defaultValue={project?.titleEn} placeholder="Title EN" className="focus-ring rounded-2xl border border-theme bg-white/10 px-4 py-3" required />
        <input name="titlePt" defaultValue={project?.titlePt} placeholder="Título PT-BR" className="focus-ring rounded-2xl border border-theme bg-white/10 px-4 py-3" required />
      </div>

      <textarea name="descriptionEn" defaultValue={project?.descriptionEn} placeholder="Description EN" className="focus-ring min-h-28 w-full rounded-2xl border border-theme bg-white/10 px-4 py-3" required />
      <textarea name="descriptionPt" defaultValue={project?.descriptionPt} placeholder="Descrição PT-BR" className="focus-ring min-h-28 w-full rounded-2xl border border-theme bg-white/10 px-4 py-3" required />

      <input name="imageUrl" defaultValue={project?.imageUrl ?? ""} placeholder="Image URL" className="focus-ring w-full rounded-2xl border border-theme bg-white/10 px-4 py-3" />

      <div className="grid gap-4 md:grid-cols-2">
        <input name="githubUrl" defaultValue={project?.githubUrl ?? ""} placeholder="GitHub URL" className="focus-ring rounded-2xl border border-theme bg-white/10 px-4 py-3" />
        <input name="liveUrl" defaultValue={project?.liveUrl ?? ""} placeholder="Live URL" className="focus-ring rounded-2xl border border-theme bg-white/10 px-4 py-3" />
      </div>

      <input name="techStack" defaultValue={project?.techStack.join(", ")} placeholder="Tech stack: Node.js, PostgreSQL, Redis" className="focus-ring w-full rounded-2xl border border-theme bg-white/10 px-4 py-3" />

      <div className="flex flex-wrap gap-5 text-sm">
        <label className="flex items-center gap-2">
          <input name="featured" type="checkbox" defaultChecked={project?.featured} />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input name="published" type="checkbox" defaultChecked={project?.published ?? true} />
          Published
        </label>
      </div>

      <button className="button-primary focus-ring rounded-full px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5">
        Save project
      </button>
    </form>
  );
}

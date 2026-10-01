import { CreateProjectForm } from "./CreateProjectForm";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-[#39358c]">
          Project Management
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Create Project
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Convert an accepted proposal into a project and define
          the initial project details.
        </p>
      </div>

      <CreateProjectForm />
    </div>
  );
}
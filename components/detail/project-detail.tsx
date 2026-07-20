import { ProjectCarousel } from "@/components/detail/project-carousel";
import { ProjectPreview } from "@/components/detail/project-preview";
import { projects } from "@/data/projects";
import { isNodeId, type NodeId } from "@/data/holographic-nodes";
import type { Project } from "@/lib/types";

function EditorialSection({
  number,
  label,
  title,
  children,
  className = "",
}: {
  number: string;
  label: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`case-section ${className}`.trim()}>
      <div className="section-heading">
        <p>
          <span>{label}</span> / {number}
        </p>
        <span aria-hidden="true" />
      </div>
      <div className="case-section-grid">
        <h2>{title}</h2>
        <div className="case-section-content">{children}</div>
      </div>
    </section>
  );
}

export function ProjectDetail({
  project,
  index,
  onHome,
  onNavigate,
}: {
  project: Project;
  index: number;
  onHome: () => void;
  onNavigate: (nodeId: NodeId) => void;
}) {
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const projectNumber = project.archiveNumber;

  const navigate = (id: string) => {
    if (isNodeId(id)) onNavigate(id);
  };

  return (
    <article
      className="project-detail has-case-study"
      style={{ "--detail-accent": project.color } as React.CSSProperties}
    >
      <section className="project-hero">
        <div className="project-intro">
          <p className="detail-kicker">
            PROYECTO {projectNumber}
          </p>
          <h1
            id="detail-title"
            className={
              project.name.split(/\s+/).some((word) => word.length > 11)
                ? "is-long-title"
                : undefined
            }
            data-detail-heading
            tabIndex={-1}
          >
            {project.name}
          </h1>
          <p className="project-short">{project.shortDescription}</p>

          <dl className="project-facts">
            <div>
              <dt>TIPO</dt>
              <dd>{project.type}</dd>
            </div>
            <div>
              <dt>IDENTIFICADOR</dt>
              <dd>PRJ_{projectNumber}</dd>
            </div>
            <div>
              <dt>ARCHIVO</dt>
              <dd>
                {projectNumber} / {String(projects.length).padStart(2, "0")}
              </dd>
            </div>
            <div>
              <dt>ESTADO</dt>
              <dd>{project.status}</dd>
            </div>
            <div>
              <dt>AÑO</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt>ROL</dt>
              <dd>{project.role}</dd>
            </div>
          </dl>

          {project.technologies.length > 0 && (
            <ul className="technology-list" aria-label="Tecnologías principales">
              {project.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          )}
        </div>

        <ProjectCarousel media={project.media} projectName={project.name} />
      </section>

      <div className="case-study">
        <div className="case-pair">
          <EditorialSection
            number="01"
            label="CONTEXTO"
            title={project.context.title}
            className="case-section-lead"
          >
            <p>{project.context.description}</p>
          </EditorialSection>

          <EditorialSection
            number="02"
            label="PROBLEMA"
            title={project.problem.title}
          >
            <p>{project.problem.description}</p>
          </EditorialSection>
        </div>

        <EditorialSection
          number="03"
          label="SOLUCIÓN"
          title={project.solution.title}
        >
          <p>{project.solution.description}</p>
        </EditorialSection>

        <div className="case-pair">
          <EditorialSection
            number="05"
            label="CONTRIBUCIÓN"
            title={project.contribution.title}
          >
            <p>{project.contribution.description}</p>
          </EditorialSection>

          <EditorialSection
            number="06"
            label="TECNOLOGÍAS"
            title="Herramientas"
          >
            {project.technologies.length > 0 ? (
              <ul className="technology-matrix">
                {project.technologies.map((technology, technologyIndex) => (
                  <li key={technology}>
                    <span>
                      {String(technologyIndex + 1).padStart(2, "0")}
                    </span>
                    {technology}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="editorial-pending">
                Tecnologías pendientes de documentación en el archivo del proyecto.
              </p>
            )}
          </EditorialSection>
        </div>

        {project.result && (
          <EditorialSection number="07" label="RESULTADO" title="Resultado">
            <p>{project.result}</p>
          </EditorialSection>
        )}

        {project.preview.type !== "unavailable" && (
          <ProjectPreview project={project} />
        )}
      </div>

      {(project.repositoryUrl || project.liveUrl) && (
        <nav className="project-links" aria-label="Enlaces externos del proyecto">
          {project.repositoryUrl && (
            <a href={project.repositoryUrl} target="_blank" rel="noreferrer">
              REPOSITORIO <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              PROYECTO DESPLEGADO <span aria-hidden="true">↗</span>
            </a>
          )}
        </nav>
      )}

      <nav className="project-sequence" aria-label="Navegación entre proyectos">
        <button
          type="button"
          className="sequence-project sequence-previous"
          style={{ "--target-accent": previous.color } as React.CSSProperties}
          onClick={() => navigate(previous.id)}
        >
          <span aria-hidden="true">←</span>
          <span>
            <small>PROYECTO ANTERIOR</small>
            <strong>{previous.name}</strong>
          </span>
        </button>
        <button type="button" className="sequence-home" onClick={onHome}>
          <small>ÍNDICE</small>
          <strong>VOLVER AL GRAFO</strong>
        </button>
        <button
          type="button"
          className="sequence-project sequence-next"
          style={{ "--target-accent": next.color } as React.CSSProperties}
          onClick={() => navigate(next.id)}
        >
          <span>
            <small>PROYECTO SIGUIENTE</small>
            <strong>{next.name}</strong>
          </span>
          <span aria-hidden="true">→</span>
        </button>
      </nav>
    </article>
  );
}

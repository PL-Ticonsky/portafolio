import Image from "next/image";
import { projects } from "@/data/projects";
import { personalProfile } from "@/data/profile";
import { isNodeId, type NodeId } from "@/data/holographic-nodes";

function ProfileSection({
  number,
  label,
  title,
  children,
}: {
  number: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="profile-section">
      <div className="section-heading">
        <p>
          <span>{label}</span> / {number}
        </p>
        <span aria-hidden="true" />
      </div>
      <div className="profile-section-grid">
        <h2>{title}</h2>
        <div>{children}</div>
      </div>
    </section>
  );
}

export function ProfileDetail({
  onNavigate,
}: {
  onNavigate: (nodeId: NodeId) => void;
}) {
  const profile = personalProfile;
  const primaryLinks = [
    profile.githubUrl && {
      label: "GITHUB",
      url: profile.githubUrl,
      external: true,
    },
    profile.linkedinUrl && {
      label: "LINKEDIN",
      url: profile.linkedinUrl,
      external: true,
    },
    ...profile.otherLinks.map((link) => ({
      label: link.label,
      url: link.url,
      external: true,
    })),
    profile.email && {
      label: "CORREO",
      url: `mailto:${profile.email}`,
      external: false,
    },
    profile.resumeUrl && {
      label: "HOJA DE VIDA",
      url: profile.resumeUrl,
      external: true,
    },
  ].filter(
    (
      link,
    ): link is {
      label: string;
      url: string;
      external: boolean;
    } => Boolean(link),
  );
  const hasKnowledge =
    profile.specialties.length > 0 || profile.technologies.length > 0;
  const hasContact = primaryLinks.length > 0;

  const navigate = (id: string) => {
    if (isNodeId(id)) onNavigate(id);
  };

  return (
    <article
      className="profile-detail"
      style={{ "--detail-accent": "#00f5ff" } as React.CSSProperties}
    >
      <aside className="profile-rail" aria-hidden="true">
        <span className="profile-rail-name">TICONSKY // CENTRAL NODE</span>
        <ol>
          <li className="is-active">
            <span>00</span>
            <small>PERFIL</small>
          </li>
          {hasKnowledge && (
            <li>
              <span>02</span>
              <small>SISTEMA</small>
            </li>
          )}
          <li>
            <span>05</span>
            <small>ARCHIVO</small>
          </li>
          {hasContact && (
            <li>
              <span>NET</span>
              <small>CONTACTO</small>
            </li>
          )}
        </ol>
      </aside>

      <section className="profile-hero">
        <div className="profile-copy">
          <p className="detail-kicker">PERFIL / NODO CENTRAL</p>
          <h1 id="detail-title" data-detail-heading tabIndex={-1}>
            {profile.fullName ?? profile.alias}
          </h1>
          <div className="profile-name-rule" aria-hidden="true">
            <span>{profile.fullName ? profile.alias : "CENTRAL NODE / 00"}</span>
            <i />
          </div>
          {profile.professionalTitle && (
            <p className="profile-title">{profile.professionalTitle}</p>
          )}
          {profile.description && (
            <p className="profile-description">{profile.description}</p>
          )}
          {!profile.professionalTitle && !profile.description && (
            <p className="profile-system-note">
              Nodo central del archivo visual y acceso a proyectos seleccionados.
            </p>
          )}
          {profile.location && (
            <p className="profile-location">
              <span>UBICACIÓN</span>
              {profile.location}
            </p>
          )}
          {primaryLinks.length > 0 && (
            <nav className="profile-primary-links" aria-label="Enlaces principales">
              {primaryLinks.map((link) => (
                <a
                  key={`${link.label}-${link.url}`}
                  href={link.url}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                >
                  {link.label} <span aria-hidden="true">{link.external ? "↗" : "→"}</span>
                </a>
              ))}
            </nav>
          )}
        </div>

        <figure className="profile-photo">
          <Image
            src={profile.photo.src}
            alt={profile.photo.alt}
            fill
            priority
            sizes="(max-width: 767px) calc(100vw - 40px), 38vw"
            style={{ objectPosition: profile.photo.objectPosition }}
          />
          <span className="frame-corner frame-corner-top" aria-hidden="true" />
          <span className="frame-corner frame-corner-bottom" aria-hidden="true" />
          <figcaption aria-hidden="true">PORTRAIT / CENTRAL NODE</figcaption>
        </figure>
      </section>

      <div className="profile-archive">
        {profile.summary && (
          <ProfileSection number="00" label="RESUMEN" title="Perfil">
            <p className="profile-lead">{profile.summary}</p>
          </ProfileSection>
        )}

        {hasKnowledge && (
          <section className="profile-dual-section">
            {profile.specialties.length > 0 && (
              <ProfileSection number="01" label="ESPECIALIDADES" title="Áreas">
                <ul className="profile-index-list">
                  {profile.specialties.map((specialty, index) => (
                    <li key={specialty}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {specialty}
                    </li>
                  ))}
                </ul>
              </ProfileSection>
            )}
            {profile.technologies.length > 0 && (
              <ProfileSection number="02" label="TECNOLOGÍAS" title="Stack">
                <ul className="technology-matrix">
                  {profile.technologies.map((technology, index) => (
                    <li key={technology}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {technology}
                    </li>
                  ))}
                </ul>
              </ProfileSection>
            )}
          </section>
        )}

        {profile.experience.length > 0 && (
          <ProfileSection number="03" label="EXPERIENCIA" title="Trayectoria">
            <ol className="profile-timeline">
              {profile.experience.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ol>
          </ProfileSection>
        )}

        {profile.education.length > 0 && (
          <ProfileSection number="04" label="FORMACIÓN" title="Formación">
            <ul className="profile-index-list">
              {profile.education.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item}
                </li>
              ))}
            </ul>
          </ProfileSection>
        )}

        <ProfileSection
          number="05"
          label="PROYECTOS SELECCIONADOS"
          title="Archivo de proyectos"
        >
          <ol className="profile-projects">
            {projects.map((project, index) => (
              <li key={project.id}>
                <button
                  type="button"
                  style={{ "--target-accent": project.color } as React.CSSProperties}
                  onClick={() => navigate(project.id)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{project.name}</strong>
                  <span aria-hidden="true">→</span>
                </button>
              </li>
            ))}
          </ol>
        </ProfileSection>

        {hasContact && (
          <ProfileSection number="NET" label="CONTACTO" title="Conectar">
            <nav className="profile-contact" aria-label="Redes y contacto">
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                  GITHUB <span aria-hidden="true">↗</span>
                </a>
              )}
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
                  LINKEDIN <span aria-hidden="true">↗</span>
                </a>
              )}
              {profile.otherLinks.map((link) => (
                <a key={link.label} href={link.url} target="_blank" rel="noreferrer">
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
              {profile.email && <a href={`mailto:${profile.email}`}>CORREO →</a>}
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
                  HOJA DE VIDA <span aria-hidden="true">↗</span>
                </a>
              )}
            </nav>
          </ProfileSection>
        )}
      </div>
      <footer className="profile-endcap" aria-hidden="true">
        <span>END / PROFILE</span>
        <span>TICONSKY / CENTRAL NODE</span>
      </footer>
    </article>
  );
}

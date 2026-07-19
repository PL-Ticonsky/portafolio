"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Project } from "@/lib/types";

export function ProjectPreview({ project }: { project: Project }) {
  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const { preview } = project;
  const canLoad = Boolean(preview.url);
  const imageSource = preview.url ?? preview.poster;
  const unavailable =
    preview.type === "unavailable" ||
    (preview.type === "image" ? !imageSource : !canLoad);

  useEffect(() => {
    if (!requested || !loading) return;

    const timeout = window.setTimeout(() => {
      setLoading(false);
      setFailed(true);
    }, 15000);

    return () => window.clearTimeout(timeout);
  }, [loading, requested]);

  const requestPreview = () => {
    if (!preview.url) return;
    setFailed(false);
    setLoading(true);
    setRequested(true);
  };

  return (
    <section className="case-section preview-section" aria-labelledby="preview-title">
      <div className="section-heading">
        <p>
          <span>PREVIEW</span> / 08
        </p>
        <span aria-hidden="true" />
      </div>
      <div className="case-section-grid">
        <h2 id="preview-title">Vista del proyecto</h2>
        <div className="case-section-content">
          {unavailable ? (
            <div className="preview-unavailable">
              <span aria-hidden="true" />
              <p>Sin preview público.</p>
            </div>
          ) : preview.type === "image" && imageSource ? (
            <>
              <figure className="preview-stage preview-image">
                <Image
                  src={imageSource}
                  alt={preview.alt ?? `Preview de ${project.name}`}
                  fill
                  sizes="(max-width: 767px) calc(100vw - 40px), 68vw"
                  loading="lazy"
                />
              </figure>
              {preview.url && (
                <a
                  className="preview-external"
                  href={preview.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  ABRIR IMAGEN <span aria-hidden="true">↗</span>
                </a>
              )}
            </>
          ) : (
            <>
              <div className="preview-stage">
                {!requested ? (
                  <>
                    {preview.poster ? (
                      <Image
                        src={preview.poster}
                        alt={preview.alt ?? `Portada del preview de ${project.name}`}
                        fill
                        sizes="(max-width: 767px) calc(100vw - 40px), 68vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="preview-poster" aria-hidden="true">
                        <span>PREVIEW / READY</span>
                      </div>
                    )}
                    <button type="button" onClick={requestPreview}>
                      {preview.type === "video" ? "CARGAR VIDEO" : "CARGAR DEMO"}
                    </button>
                  </>
                ) : failed ? (
                  <div className="preview-message" role="alert">
                    No fue posible cargar el preview.
                  </div>
                ) : preview.type === "video" ? (
                  <>
                    {loading && (
                      <div className="preview-message" role="status">
                        Cargando video…
                      </div>
                    )}
                    <video
                      src={preview.url}
                      poster={preview.poster}
                      controls
                      playsInline
                      preload="metadata"
                      onCanPlay={() => setLoading(false)}
                      onError={() => {
                        setLoading(false);
                        setFailed(true);
                      }}
                    />
                  </>
                ) : (
                  <>
                    {loading && (
                      <div className="preview-message" role="status">
                        Cargando demo…
                      </div>
                    )}
                    <iframe
                      src={preview.url}
                      title={`Preview de ${project.name}`}
                      loading="lazy"
                      onLoad={() => setLoading(false)}
                      onError={() => {
                        setLoading(false);
                        setFailed(true);
                      }}
                      sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
                    />
                  </>
                )}
              </div>

              {preview.url && (
                <a
                  className="preview-external"
                  href={preview.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  ABRIR EN OTRA PESTAÑA <span aria-hidden="true">↗</span>
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

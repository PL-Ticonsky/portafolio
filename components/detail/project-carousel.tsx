"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import type { ProjectMedia } from "@/lib/types";

export function ProjectCarousel({
  media,
  projectName,
}: {
  media: ProjectMedia[];
  projectName: string;
}) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  const total = media.length;
  const item = media[index];

  const move = (direction: -1 | 1) => {
    if (total < 2) return;
    setIndex((current) => (current + direction + total) % total);
  };

  if (!item) {
    return (
      <section
        className="project-carousel is-empty"
        aria-label={`Galería de ${projectName}`}
      >
        <div className="carousel-stage">
          <div className="media-empty" role="img" aria-label="Sin imágenes del proyecto">
            <span>MEDIA SLOT</span>
            <strong>NO SOURCE</strong>
          </div>
          <div className="carousel-position" aria-hidden="true">
            00 / 00
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="project-carousel"
      aria-label={`Galería de ${projectName}`}
      aria-roledescription="carrusel"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          move(-1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          move(1);
        }
      }}
      onTouchStart={(event) => {
        touchStart.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const distance =
          (event.changedTouches[0]?.clientX ?? touchStart.current) -
          touchStart.current;
        if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1);
        touchStart.current = null;
      }}
    >
      <div className="carousel-stage">
        <span className="carousel-reference" aria-hidden="true">
          MEDIA / {projectName}
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure
            key={`${item.src}-${index}`}
            initial={reducedMotion ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
            transition={{ duration: reducedMotion ? 0.08 : 0.24 }}
          >
            <div className="carousel-media">
              {item.type === "video" ? (
                <video
                  src={item.src}
                  poster={item.poster}
                  aria-label={item.alt}
                  controls
                  playsInline
                  preload="metadata"
                />
              ) : (
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 767px) calc(100vw - 40px), 56vw"
                  priority={index === 0}
                />
              )}
            </div>
            {item.caption && <figcaption>{item.caption}</figcaption>}
          </motion.figure>
        </AnimatePresence>

        <div className="carousel-position" aria-live="polite" aria-atomic="true">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>

        {total > 1 && (
          <div className="carousel-controls">
            <button type="button" onClick={() => move(-1)} aria-label="Imagen anterior">
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Imagen siguiente">
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
        <span className="carousel-corner carousel-corner-bottom" aria-hidden="true" />
      </div>

      {total > 1 && (
        <div className="carousel-index">
          <span className="carousel-index-label" aria-hidden="true">
            MEDIA INDEX
          </span>
          <div className="carousel-thumbnails" aria-label="Seleccionar imagen">
            {media.map((thumbnail, itemIndex) => (
              <button
                type="button"
                key={`${thumbnail.src}-${itemIndex}`}
                className={itemIndex === index ? "active" : ""}
                onClick={() => setIndex(itemIndex)}
                aria-label={`Mostrar medio ${itemIndex + 1} de ${total}: ${thumbnail.alt}`}
                aria-current={itemIndex === index ? "true" : undefined}
              >
                {thumbnail.type === "image" ? (
                  <Image
                    src={thumbnail.src}
                    alt=""
                    fill
                    sizes="96px"
                    loading="lazy"
                  />
                ) : thumbnail.poster ? (
                  <Image
                    src={thumbnail.poster}
                    alt=""
                    fill
                    sizes="96px"
                    loading="lazy"
                  />
                ) : (
                  <span className="video-thumbnail" aria-hidden="true">VIDEO</span>
                )}
                <span>{String(itemIndex + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

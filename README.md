# Ticonsky — Universo de proyectos

Portafolio inmersivo construido con Next.js, TypeScript y React Three Fiber.
La portada presenta un grafo holográfico procedural con el nodo central
Ticonsky y cinco nodos de proyecto.

## Desarrollo local

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:3000`.

## Estructura de contenido

- `data/projects.ts` es la fuente única de cada proyecto: ruta, orden,
  contenido editorial, medios y configuración visual del planeta. Museum Heist
  conserva el contenido verificado; los campos aún desconocidos de los demás
  proyectos están marcados explícitamente como pendientes de documentación.
- `data/holographic-nodes.ts` agrega el nodo central Ticonsky a los planetas
  derivados de `data/projects.ts`.
- `data/profile.ts` conserva el alias Ticonsky. Los campos personales sin fuente
  se omiten.
- `public/placeholders/` contiene ranuras visuales neutrales; no representan
  capturas ni fotografías reales.

La tecla `Escape` y el historial del navegador permiten volver al grafo. Las
rutas `/proyectos/[slug]` abren cada proyecto y `/ticonsky` abre el perfil.

## Agregar un proyecto

Agrega un objeto a `projects` en `data/projects.ts`, respetando el orden en que
debe aparecer en la navegación. El objeto incluye su `id`, `slug`, número de
archivo, textos, medios y propiedad `node`; a partir de él se generan el planeta,
la URL estática, el detalle, el sitemap y los enlaces anterior/siguiente. No es
necesario crear una página o componente adicional.

Para generar metadata y sitemap con el dominio de producción:

```bash
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

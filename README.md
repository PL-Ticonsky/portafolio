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

- `data/holographic-nodes.ts` define identidad visual, posición y movimiento de
  los seis nodos.
- `data/projects.ts` contiene los datos editoriales verificados. Museum Heist es
  el único caso con información descriptiva cargada; los demás registros
  conservan únicamente su identidad de navegación.
- `data/profile.ts` conserva el alias Ticonsky. Los campos personales sin fuente
  se omiten.
- `public/placeholders/` contiene ranuras visuales neutrales; no representan
  capturas ni fotografías reales.

La tecla `Escape` y el historial del navegador permiten volver al grafo. Las
rutas `/proyectos/[slug]` abren cada proyecto y `/ticonsky` abre el perfil.

Para generar metadata y sitemap con el dominio de producción:

```bash
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

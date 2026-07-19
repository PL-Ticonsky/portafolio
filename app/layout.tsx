import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const spaceGrotesk = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "./fonts/space-grotesk-regular.otf", weight: "400" },
    { path: "./fonts/space-grotesk-medium.otf", weight: "500" },
    { path: "./fonts/space-grotesk-semibold.otf", weight: "600" },
    { path: "./fonts/space-grotesk-bold.otf", weight: "700" },
  ],
});

const inter = localFont({
  variable: "--font-body",
  display: "swap",
  src: "./fonts/inter-variable.woff2",
  weight: "100 900",
});

const mono = localFont({
  variable: "--font-mono",
  display: "swap",
  src: [
    { path: "./fonts/jetbrains-mono.ttf", weight: "400" },
    { path: "./fonts/jetbrains-mono-medium.ttf", weight: "500" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Ticonsky — Universo de proyectos", template: "%s — Ticonsky" },
  description:
    "Un universo tridimensional de proyectos donde cada mundo representa una idea construida.",
  openGraph: {
    title: "Ticonsky — Universo de proyectos",
    description: "Explora proyectos de desarrollo, producto y tecnología en un espacio conectado.",
    type: "website",
    locale: "es_CO",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#101416",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}

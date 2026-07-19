import type { Metadata } from "next";
import { GraphViewport } from "@/components/graph-viewport";

export const metadata: Metadata = {
  title: "Ticonsky",
  description: "Vista holográfica del nodo central Ticonsky.",
};

export default function TiconskyPage() {
  return <GraphViewport initialNodeId="ticonsky" />;
}

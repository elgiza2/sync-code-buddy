import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/GamesPage";

export const Route = createFileRoute("/ai")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Nova AI - Mine, Battle & Earn Gram" },
      { name: "description", content: "Nova AI: mine NOVA, battle monsters, and earn Gram cryptocurrency" },
    ],
  }),
});

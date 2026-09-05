import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/AiPage";

export const Route = createFileRoute("/ai")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Nova AI Assistant - Chat & Create" },
      { name: "description", content: "Chat with Nova AI, generate images and unlock AI tools inside Nova." },
      { property: "og:title", content: "Nova AI Assistant - Chat & Create" },
      { property: "og:description", content: "Chat with Nova AI, generate images and unlock AI tools inside Nova." },
    ],
  }),
});

import type { Board } from "./types";

export function createInitialBoard(): Board {
  return {
    columns: [
      {
        id: "col-backlog",
        title: "Backlog",
        cardIds: ["card-1", "card-2"],
      },
      {
        id: "col-ready",
        title: "Ready",
        cardIds: ["card-3", "card-4"],
      },
      {
        id: "col-progress",
        title: "In Progress",
        cardIds: ["card-5", "card-6"],
      },
      {
        id: "col-review",
        title: "Review",
        cardIds: ["card-7"],
      },
      {
        id: "col-done",
        title: "Done",
        cardIds: ["card-8", "card-9"],
      },
    ],
    cards: {
      "card-1": {
        id: "card-1",
        title: "Map onboarding flow",
        details: "Sketch the first-run experience for new workspace members.",
      },
      "card-2": {
        id: "card-2",
        title: "Collect brand assets",
        details: "Gather logos, color tokens, and approved photography.",
      },
      "card-3": {
        id: "card-3",
        title: "Draft API contract",
        details: "Define endpoints for board read and card mutations.",
      },
      "card-4": {
        id: "card-4",
        title: "Schedule design critique",
        details: "Book a 45-minute review with product and design leads.",
      },
      "card-5": {
        id: "card-5",
        title: "Build column layout",
        details: "Implement the five-column board shell with horizontal scroll.",
      },
      "card-6": {
        id: "card-6",
        title: "Wire drag and drop",
        details: "Enable moving cards within and across columns.",
      },
      "card-7": {
        id: "card-7",
        title: "Polish empty states",
        details: "Review spacing and copy when a column has no cards.",
      },
      "card-8": {
        id: "card-8",
        title: "Set project palette",
        details: "Applied navy, blue, purple, yellow, and gray tokens.",
      },
      "card-9": {
        id: "card-9",
        title: "Seed demo board",
        details: "Loaded sample cards so the board feels alive on open.",
      },
    },
  };
}

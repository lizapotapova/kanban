import { describe, expect, it } from "vitest";
import { addCard, deleteCard, moveCard, renameColumn } from "./board";
import { createInitialBoard } from "./seed";

describe("board helpers", () => {
  it("keeps exactly five columns on the seeded board", () => {
    const board = createInitialBoard();
    expect(board.columns).toHaveLength(5);
  });

  it("renames a column", () => {
    const board = createInitialBoard();
    const next = renameColumn(board, "col-backlog", "Ideas");
    expect(next.columns[0].title).toBe("Ideas");
  });

  it("ignores empty rename titles", () => {
    const board = createInitialBoard();
    const next = renameColumn(board, "col-backlog", "   ");
    expect(next.columns[0].title).toBe("Backlog");
  });

  it("adds a card to a column", () => {
    const board = createInitialBoard();
    const next = addCard(board, "col-ready", "Ship docs", "Write release notes");
    const column = next.columns.find((item) => item.id === "col-ready");
    const newId = column?.cardIds.at(-1);
    expect(newId).toBeTruthy();
    expect(next.cards[newId!].title).toBe("Ship docs");
    expect(next.cards[newId!].details).toBe("Write release notes");
  });

  it("does not add a card without a title", () => {
    const board = createInitialBoard();
    const next = addCard(board, "col-ready", "  ", "details");
    expect(next).toBe(board);
  });

  it("deletes a card from the board", () => {
    const board = createInitialBoard();
    const next = deleteCard(board, "card-1");
    expect(next.cards["card-1"]).toBeUndefined();
    expect(next.columns[0].cardIds).not.toContain("card-1");
  });

  it("moves a card across columns", () => {
    const board = createInitialBoard();
    const next = moveCard(board, "card-1", "col-done", 0);
    expect(next.columns[0].cardIds).not.toContain("card-1");
    expect(next.columns[4].cardIds[0]).toBe("card-1");
  });

  it("reorders a card within a column", () => {
    const board = createInitialBoard();
    const next = moveCard(board, "card-1", "col-backlog", 1);
    expect(next.columns[0].cardIds).toEqual(["card-2", "card-1"]);
  });
});

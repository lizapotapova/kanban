import type { Board } from "./types";

function cloneBoard(board: Board): Board {
  return {
    columns: board.columns.map((column) => ({
      ...column,
      cardIds: [...column.cardIds],
    })),
    cards: { ...board.cards },
  };
}

export function renameColumn(
  board: Board,
  columnId: string,
  title: string,
): Board {
  const next = cloneBoard(board);
  const column = next.columns.find((item) => item.id === columnId);
  if (!column) return board;
  column.title = title.trim() || column.title;
  return next;
}

export function addCard(
  board: Board,
  columnId: string,
  title: string,
  details: string,
): Board {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return board;

  const next = cloneBoard(board);
  const column = next.columns.find((item) => item.id === columnId);
  if (!column) return board;

  const id = `card-${crypto.randomUUID()}`;
  next.cards[id] = {
    id,
    title: trimmedTitle,
    details: details.trim(),
  };
  column.cardIds.push(id);
  return next;
}

export function deleteCard(board: Board, cardId: string): Board {
  const next = cloneBoard(board);
  if (!next.cards[cardId]) return board;

  delete next.cards[cardId];
  for (const column of next.columns) {
    column.cardIds = column.cardIds.filter((id) => id !== cardId);
  }
  return next;
}

export function moveCard(
  board: Board,
  cardId: string,
  toColumnId: string,
  toIndex: number,
): Board {
  const next = cloneBoard(board);
  if (!next.cards[cardId]) return board;

  const toColumn = next.columns.find((column) => column.id === toColumnId);
  if (!toColumn) return board;

  let fromColumn = next.columns.find((column) =>
    column.cardIds.includes(cardId),
  );
  if (!fromColumn) return board;

  fromColumn.cardIds = fromColumn.cardIds.filter((id) => id !== cardId);

  const boundedIndex = Math.max(0, Math.min(toIndex, toColumn.cardIds.length));
  toColumn.cardIds.splice(boundedIndex, 0, cardId);
  return next;
}

export function findColumnIdByCardId(
  board: Board,
  cardId: string,
): string | undefined {
  return board.columns.find((column) => column.cardIds.includes(cardId))?.id;
}

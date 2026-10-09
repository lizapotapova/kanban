"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
  type DropAnimation,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useMemo, useState } from "react";
import {
  addCard,
  deleteCard,
  findColumnIdByCardId,
  moveCard,
  renameColumn,
} from "@/lib/board";
import { createInitialBoard } from "@/lib/seed";
import type { Board as BoardType, Card as CardType } from "@/lib/types";
import { Column } from "./Column";

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

export function Board() {
  const [board, setBoard] = useState<BoardType>(() => createInitialBoard());
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [dndReady, setDndReady] = useState(false);

  useEffect(() => {
    setDndReady(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const cardCount = useMemo(
    () => Object.keys(board.cards).length,
    [board.cards],
  );

  function handleRename(columnId: string, title: string) {
    setBoard((current) => renameColumn(current, columnId, title));
  }

  function handleAddCard(columnId: string, title: string, details: string) {
    setBoard((current) => addCard(current, columnId, title, details));
  }

  function handleDeleteCard(cardId: string) {
    setBoard((current) => deleteCard(current, cardId));
  }

  function handleDragStart(event: DragStartEvent) {
    const card = board.cards[String(event.active.id)];
    setActiveCard(card ?? null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    setBoard((current) => {
      const fromColumnId = findColumnIdByCardId(current, activeId);
      const toColumnId =
        findColumnIdByCardId(current, overId) ??
        current.columns.find((column) => column.id === overId)?.id;

      if (!fromColumnId || !toColumnId || fromColumnId === toColumnId) {
        return current;
      }

      const toColumn = current.columns.find(
        (column) => column.id === toColumnId,
      );
      if (!toColumn) return current;

      const overIndex = toColumn.cardIds.indexOf(overId);
      const toIndex = overIndex >= 0 ? overIndex : toColumn.cardIds.length;
      return moveCard(current, activeId, toColumnId, toIndex);
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    setBoard((current) => {
      const columnId = findColumnIdByCardId(current, activeId);
      if (!columnId) return current;

      const column = current.columns.find((item) => item.id === columnId);
      if (!column) return current;

      const oldIndex = column.cardIds.indexOf(activeId);
      if (oldIndex < 0) return current;

      const overColumnId =
        findColumnIdByCardId(current, overId) ??
        current.columns.find((item) => item.id === overId)?.id;

      if (overColumnId && overColumnId !== columnId) {
        const toColumn = current.columns.find(
          (item) => item.id === overColumnId,
        );
        if (!toColumn) return current;
        const overIndex = toColumn.cardIds.indexOf(overId);
        const toIndex = overIndex >= 0 ? overIndex : toColumn.cardIds.length;
        return moveCard(current, activeId, overColumnId, toIndex);
      }

      const newIndex =
        overId === columnId
          ? column.cardIds.length - 1
          : column.cardIds.indexOf(overId);

      if (newIndex < 0 || newIndex === oldIndex) return current;

      const next = {
        ...current,
        columns: current.columns.map((item) => {
          if (item.id !== columnId) return item;
          return {
            ...item,
            cardIds: arrayMove(item.cardIds, oldIndex, newIndex),
          };
        }),
      };
      return next;
    });
  }

  const boardBody = (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-max max-w-[1600px] gap-4">
      {board.columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          board={board}
          onRename={handleRename}
          onAddCard={handleAddCard}
          onDeleteCard={handleDeleteCard}
        />
      ))}
    </div>
  );

  return (
    <div
      className="flex min-h-full flex-1 flex-col"
      data-testid="board"
      data-dnd-ready={dndReady ? "true" : "false"}
    >
      <header className="relative border-b border-[var(--color-navy)]/10 bg-white/85 px-6 py-5 backdrop-blur-md">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-yellow)] via-[var(--color-purple)] to-[var(--color-yellow)]" />
        <div className="mx-auto flex w-full max-w-[1600px] items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-purple)]">
              Project board
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--color-navy)] md:text-3xl">
              Kanban
            </h1>
            <p className="mt-1 text-sm text-[var(--color-gray)]">
              One board. Five columns. Move work with drag and drop.
            </p>
          </div>
          <p
            className="rounded-full bg-[var(--color-purple)] px-3 py-1 text-sm font-medium text-white"
            data-testid="card-count"
          >
            {cardCount} cards
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto px-6 py-6">
        {dndReady ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {boardBody}
            <DragOverlay dropAnimation={dropAnimation}>
              {activeCard ? (
                <div className="w-[17rem] rotate-1 rounded-xl border-2 border-[var(--color-yellow)] bg-white p-3 shadow-[0_18px_40px_rgba(117,57,145,0.22)]">
                  <div className="mb-2 h-1 w-10 rounded-full bg-[var(--color-yellow)]" />
                  <h3 className="text-sm font-semibold text-[var(--color-navy)]">
                    {activeCard.title}
                  </h3>
                  {activeCard.details ? (
                    <p className="mt-1.5 text-xs text-[var(--color-gray)]">
                      {activeCard.details}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          boardBody
        )}
      </div>
    </div>
  );
}

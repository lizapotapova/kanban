"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KeyboardEvent, useState } from "react";
import type { Board, Column as ColumnType } from "@/lib/types";
import { AddCardForm } from "./AddCardForm";
import { Card } from "./Card";

type ColumnProps = {
  column: ColumnType;
  board: Board;
  onRename: (columnId: string, title: string) => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (cardId: string) => void;
};

export function Column({
  column,
  board,
  onRename,
  onAddCard,
  onDeleteCard,
}: ColumnProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(column.title);
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  function commitRename() {
    onRename(column.id, draft);
    setDraft((current) => current.trim() || column.title);
    setEditing(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      commitRename();
    }
    if (event.key === "Escape") {
      setDraft(column.title);
      setEditing(false);
    }
  }

  return (
    <section
      className={`flex w-72 shrink-0 flex-col overflow-hidden rounded-2xl border bg-[rgba(255,255,255,0.78)] backdrop-blur-sm transition-colors ${
        isOver
          ? "border-[var(--color-yellow)] bg-[rgba(236,173,10,0.08)] shadow-[0_0_0_1px_rgba(236,173,10,0.35)]"
          : "border-[var(--color-navy)]/8"
      }`}
      data-testid={`column-${column.id}`}
    >
      <header className="relative border-b border-[var(--color-navy)]/8 bg-gradient-to-r from-[rgba(117,57,145,0.08)] to-[rgba(236,173,10,0.08)] px-4 py-3">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-yellow)]" />
        {editing ? (
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commitRename}
            onKeyDown={handleKeyDown}
            aria-label="Column title"
            className="w-full rounded-md border border-[var(--color-purple)] bg-white px-2 py-1 text-sm font-semibold text-[var(--color-navy)] outline-none"
            autoFocus
            data-testid={`rename-column-input-${column.id}`}
          />
        ) : (
          <button
            type="button"
            className="w-full text-left text-sm font-semibold tracking-wide text-[var(--color-navy)] transition-colors hover:text-[var(--color-purple)]"
            onClick={() => {
              setDraft(column.title);
              setEditing(true);
            }}
            data-testid={`rename-column-${column.id}`}
          >
            {column.title}
          </button>
        )}
        <p className="mt-1 text-xs font-medium text-[var(--color-purple)]/80">
          {column.cardIds.length}{" "}
          {column.cardIds.length === 1 ? "card" : "cards"}
        </p>
      </header>

      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-3 py-3"
        data-testid={`column-drop-${column.id}`}
      >
        <SortableContext
          items={column.cardIds}
          strategy={verticalListSortingStrategy}
        >
          {column.cardIds.map((cardId) => {
            const card = board.cards[cardId];
            if (!card) return null;
            return (
              <Card key={card.id} card={card} onDelete={onDeleteCard} />
            );
          })}
        </SortableContext>
        <AddCardForm columnId={column.id} onAdd={onAddCard} />
      </div>
    </section>
  );
}

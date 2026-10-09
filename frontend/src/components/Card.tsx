"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card as CardType } from "@/lib/types";

type CardProps = {
  card: CardType;
  onDelete: (cardId: string) => void;
};

export function Card({ card, onDelete }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl border border-[var(--color-navy)]/8 bg-white p-3 shadow-[0_1px_2px_rgba(3,33,71,0.06)] transition-shadow hover:border-[var(--color-purple)]/25 hover:shadow-[0_6px_18px_rgba(117,57,145,0.12)] ${
        isDragging ? "z-10 ring-2 ring-[var(--color-yellow)]" : ""
      }`}
      data-testid={`card-${card.id}`}
    >
      <div
        className="cursor-grab touch-none active:cursor-grabbing"
        data-testid={`drag-handle-${card.id}`}
        {...attributes}
        {...listeners}
      >
        <div className="mb-2 flex items-center gap-2">
          <div className="h-1 w-10 rounded-full bg-[var(--color-yellow)]" />
          <div className="h-1 w-3 rounded-full bg-[var(--color-purple)]/70" />
        </div>
        <h3 className="text-sm font-semibold leading-snug text-[var(--color-navy)]">
          {card.title}
        </h3>
        {card.details ? (
          <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-gray)]">
            {card.details}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        aria-label={`Delete ${card.title}`}
        className="mt-2 rounded-md px-1.5 py-0.5 text-xs font-medium text-[var(--color-gray)] transition-colors hover:bg-[var(--color-purple)]/10 hover:text-[var(--color-purple)]"
        onClick={() => onDelete(card.id)}
        data-testid={`delete-card-${card.id}`}
      >
        Delete
      </button>
    </article>
  );
}

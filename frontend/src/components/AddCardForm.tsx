"use client";

import { FormEvent, useState } from "react";

type AddCardFormProps = {
  columnId: string;
  onAdd: (columnId: string, title: string, details: string) => void;
};

export function AddCardForm({ columnId, onAdd }: AddCardFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  function reset() {
    setTitle("");
    setDetails("");
    setOpen(false);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    onAdd(columnId, title, details);
    reset();
  }

  if (!open) {
    return (
      <button
        type="button"
        className="mt-auto w-full rounded-lg border border-dashed border-[var(--color-purple)]/30 bg-[var(--color-purple)]/5 px-3 py-2 text-left text-sm font-medium text-[var(--color-purple)] transition-colors hover:border-[var(--color-yellow)] hover:bg-[var(--color-yellow)]/10 hover:text-[var(--color-navy)]"
        onClick={() => setOpen(true)}
        data-testid={`add-card-trigger-${columnId}`}
      >
        + Add card
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-auto flex flex-col gap-2 rounded-lg border border-[var(--color-purple)]/20 bg-white p-3 shadow-sm"
      data-testid={`add-card-form-${columnId}`}
    >
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Card title"
        aria-label="Card title"
        className="w-full rounded-md border border-[var(--color-navy)]/15 px-3 py-2 text-sm text-[var(--color-navy)] outline-none focus:border-[var(--color-purple)]"
        autoFocus
      />
      <textarea
        value={details}
        onChange={(event) => setDetails(event.target.value)}
        placeholder="Details (optional)"
        aria-label="Card details"
        rows={2}
        className="w-full resize-none rounded-md border border-[var(--color-navy)]/15 px-3 py-2 text-sm text-[var(--color-navy)] outline-none focus:border-[var(--color-yellow)]"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="rounded-md bg-[var(--color-purple)] px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Add
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-gray)] transition-colors hover:text-[var(--color-navy)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export const focusRingClass =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-duit";

export const primaryButtonClass = `inline-flex min-h-11 items-center justify-center rounded-lg bg-duit px-4 text-sm font-semibold text-on-duit transition-colors hover:bg-duit/90 ${focusRingClass} disabled:cursor-not-allowed disabled:opacity-60`;

export const secondaryButtonClass = `inline-flex min-h-11 items-center justify-center rounded-lg border border-line px-4 text-sm font-medium text-ink transition-colors hover:bg-ink/5 ${focusRingClass}`;

export const dangerButtonClass = `inline-flex min-h-11 items-center justify-center rounded-lg bg-expense px-4 text-sm font-semibold text-on-expense transition-colors hover:bg-expense/90 ${focusRingClass} disabled:cursor-not-allowed disabled:opacity-60`;

export const actionLinkClass = `inline-flex min-h-11 items-center rounded-md px-2 text-sm font-medium text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink ${focusRingClass}`;

export const dangerLinkClass = `inline-flex min-h-11 items-center rounded-md px-2 text-sm font-medium text-expense transition-colors hover:bg-expense/10 ${focusRingClass}`;

export const backLinkClass = `inline-flex min-h-11 items-center rounded-md text-sm font-medium text-ink/70 transition-colors hover:text-ink ${focusRingClass}`;

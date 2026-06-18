import { CheckCircle2 } from "lucide-react";

import type { ComponentType, ReactNode } from "react";

export function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-md border border-border bg-surface text-text-muted transition hover:border-border-strong hover:text-text"
    >
      {children}
    </button>
  );
}

export function SegmentBar<T extends string>({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: Array<{ id: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-text-subtle">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={
              item.id === value
                ? "rounded-md border border-ink bg-ink px-3 py-1.5 text-xs font-semibold text-ink-fg"
                : "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-muted transition hover:border-border-strong hover:text-text"
            }
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TextList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-text">{title}</h3>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-xs leading-5 text-text-muted"
          >
            <CheckCircle2
              className="mt-0.5 size-3.5 shrink-0 text-accent"
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border-strong bg-surface p-5">
      <p className="text-sm font-semibold text-text">{title}</p>
      <p className="mt-1 text-sm text-text-muted">{body}</p>
    </div>
  );
}

export function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-surface text-accent">
        <Icon className="size-4" aria-hidden />
      </span>
      <div>
        <h2 className="text-lg font-semibold text-text">{title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-text-muted">
          {description}
        </p>
      </div>
    </div>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}) {
  return (
    <article className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-text-subtle">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-text">{value}</p>
        </div>
        <span className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-bg text-accent">
          <Icon className="size-4" aria-hidden />
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-text-muted">{detail}</p>
    </article>
  );
}

"use client";

import {
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  useId,
} from "react";

import { cn } from "@/lib/utils";

interface FieldShellProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optionalLabel?: string;
  children: ReactNode;
  className?: string;
}

/** Wraps a control with a floating label, gold focus line and inline error. */
function FieldShell({
  id,
  label,
  error,
  hint,
  optionalLabel,
  children,
  className,
}: FieldShellProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute top-0 left-0 origin-left translate-y-[1.35rem] text-base text-current/60",
          "transition-transform duration-300 ease-expo",
          "group-focus-within/field:-translate-y-0.5 group-focus-within/field:scale-[0.78] group-focus-within/field:text-gold-light",
          "group-data-[filled=true]/field:-translate-y-0.5 group-data-[filled=true]/field:scale-[0.78]",
        )}
      >
        {label}
        {optionalLabel ? <span className="ml-2 text-xs opacity-70">({optionalLabel})</span> : null}
      </label>
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gold-light transition-transform duration-500 ease-expo group-focus-within/field:scale-x-100"
      />
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 text-sm text-error-dark in-data-[surface=light]:text-error"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 text-sm text-current/60">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const controlBase = [
  "peer block w-full appearance-none rounded-none border-0 border-b border-current/25 bg-transparent",
  "px-0 pt-7 pb-3 text-base text-current outline-none",
  "transition-colors duration-300 focus-visible:outline-none",
  "aria-invalid:border-error-dark in-data-[surface=light]:aria-invalid:border-error",
];

interface BaseFieldProps {
  label: string;
  error?: string;
  hint?: string;
  optionalLabel?: string;
  /** Drives the floating-label position (true when the field has a value). */
  filled?: boolean;
  wrapperClassName?: string;
}

export function TextField({
  label,
  error,
  hint,
  optionalLabel,
  filled,
  wrapperClassName,
  className,
  id: idProp,
  ...props
}: BaseFieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const generated = useId();
  const id = idProp ?? generated;
  return (
    <div data-filled={filled} className={cn("group/field", wrapperClassName)}>
      <FieldShell id={id} label={label} error={error} hint={hint} optionalLabel={optionalLabel}>
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(controlBase, "h-16", className)}
          {...props}
        />
      </FieldShell>
    </div>
  );
}

export function TextAreaField({
  label,
  error,
  hint,
  optionalLabel,
  filled,
  wrapperClassName,
  className,
  id: idProp,
  ...props
}: BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const generated = useId();
  const id = idProp ?? generated;
  return (
    <div data-filled={filled} className={cn("group/field", wrapperClassName)}>
      <FieldShell id={id} label={label} error={error} hint={hint} optionalLabel={optionalLabel}>
        <textarea
          id={id}
          rows={3}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(controlBase, "min-h-28 resize-y", className)}
          {...props}
        />
      </FieldShell>
    </div>
  );
}

export function SelectField({
  label,
  error,
  hint,
  filled: _filled,
  wrapperClassName,
  className,
  children,
  id: idProp,
  ...props
}: BaseFieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const generated = useId();
  const id = idProp ?? generated;
  return (
    // A select always shows text (its placeholder option), so its label stays floated.
    <div data-filled className={cn("group/field", wrapperClassName)}>
      <FieldShell id={id} label={label} error={error} hint={hint}>
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(
            controlBase,
            "h-16 cursor-pointer pr-8 [&>option]:bg-ink [&>option]:text-ivory",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 8"
          className="pointer-events-none absolute right-1 bottom-6 w-3 text-current/60"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path d="m1 1.5 5 5 5-5" />
        </svg>
      </FieldShell>
    </div>
  );
}

export function CheckboxField({
  label,
  error,
  id: idProp,
  className,
  ...props
}: { label: ReactNode; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const generated = useId();
  const id = idProp ?? generated;
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="flex min-h-12 cursor-pointer items-start gap-4 py-2 text-sm leading-relaxed"
      >
        <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
          <input
            id={id}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className="peer size-5 cursor-pointer appearance-none border border-current/40 transition-colors checked:border-gold checked:bg-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light"
            {...props}
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 12 10"
            className="pointer-events-none absolute w-3 text-ink opacity-0 peer-checked:opacity-100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="m1 5 3.5 3.5L11 1.5" />
          </svg>
        </span>
        <span className="text-current/80">{label}</span>
      </label>
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-sm text-error-dark in-data-[surface=light]:text-error"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

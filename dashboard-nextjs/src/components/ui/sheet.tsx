"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";

type SheetContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
};

const SheetContext = createContext<SheetContextValue | null>(null);

export function Sheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const contextValue = useMemo<SheetContextValue>(
    () => ({
      open,
      setOpen,
    }),
    [open],
  );

  return (
    <SheetContext.Provider value={contextValue}>
      {children}
    </SheetContext.Provider>
  );
}

function useSheetContext(component: string) {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error(`${component} must be used inside <Sheet>`);
  }
  return context;
}

type SheetTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function SheetTrigger({
  children,
  className = "",
  ...props
}: SheetTriggerProps) {
  const { setOpen } = useSheetContext("SheetTrigger");

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

type SheetContentProps = {
  side?: "left" | "right";
  className?: string;
  children: React.ReactNode;
};

export function SheetContent({
  side = "left",
  className = "",
  children,
}: SheetContentProps) {
  const { open, setOpen } = useSheetContext("SheetContent");
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-50 flex h-full w-72 max-w-[85%] flex-col shadow-2xl transition-transform duration-200 ${
          side === "left" ? "translate-x-0" : "translate-x-0 md:translate-x-0"
        } ${side === "left" ? "left-0" : "ml-auto"} ${className}`}
      >
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-md border border-white/20 bg-transparent p-2 text-current hover:bg-white/10"
        >
          <FiX />
        </button>
        <div className="h-full overflow-y-auto pt-12">{children}</div>
      </div>
    </div>
  );
}

export function SheetClose({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useSheetContext("SheetClose");
  return (
    <button
      type="button"
      onClick={() => setOpen(false)}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

export function useSheet() {
  return useSheetContext("useSheet");
}

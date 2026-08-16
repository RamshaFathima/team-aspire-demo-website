"use client";

import { Printer } from "lucide-react";

export default function PrintButton({ label = "Download / Print" }: { label?: string }) {
  return (
    <button onClick={() => window.print()} className="btn-primary print:hidden">
      <Printer className="mr-2 h-4 w-4" />
      {label}
    </button>
  );
}

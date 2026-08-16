"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { clientApi, getToken, type ApiError } from "@/lib/client-api";

export default function EnrollButton({ cohortId }: { cohortId: string }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const enroll = async () => {
    setError(null);
    if (!getToken()) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setState("loading");
    try {
      await clientApi("/me/enroll", { method: "POST", body: { cohortId } });
      setState("done");
    } catch (err) {
      setState("idle");
      setError((err as ApiError).message);
    }
  };

  if (state === "done") {
    return (
      <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
        You&apos;re enrolled! See your classes in My Account.
      </p>
    );
  }

  return (
    <div className="mt-3">
      <button onClick={enroll} disabled={state === "loading"} className="btn-primary w-full !py-2 text-xs">
        {state === "loading" ? "Enrolling…" : "Enroll in this batch"}
      </button>
      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

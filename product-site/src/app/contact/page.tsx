"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { clientApi, type ApiError } from "@/lib/client-api";

function ContactForm() {
  const params = useSearchParams();
  const [kind, setKind] = useState<"contact" | "volunteer">(
    params.get("volunteer") ? "volunteer" : "contact",
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await clientApi(`/public/forms/${kind}`, {
        method: "POST",
        auth: false,
        body: { fullName, email, phone: phone || undefined, message },
      });
      setDone(true);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="card mt-10 p-8 text-center">
        <h2 className="font-serif text-2xl text-maroon-900">Received, with gratitude.</h2>
        <p className="mt-2 text-sm text-maroon-950/60">
          {kind === "volunteer"
            ? "Our volunteer team will reach out to you soon insha'Allah."
            : "We'll get back to you as soon as we can."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card mt-10 space-y-5 p-6 md:p-8">
      <div className="flex gap-2">
        {(["contact", "volunteer"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold capitalize transition ${
              kind === k
                ? "border-maroon-700 bg-maroon-700 text-cream-50"
                : "border-cream-200 bg-white text-maroon-800"
            }`}
          >
            {k === "contact" ? "General enquiry" : "Volunteer with us"}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <span className="label">Full name</span>
          <input className="input" required minLength={2} value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <span className="label">Email</span>
          <input className="input" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>
      <div>
        <span className="label">Phone (optional)</span>
        <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div>
        <span className="label">{kind === "volunteer" ? "Tell us about yourself" : "Message"}</span>
        <textarea className="input" rows={4} required minLength={5} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button className="btn-primary w-full" disabled={busy}>
        {busy ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">Salaam!</p>
        <h1 className="mt-2 font-serif text-3xl text-maroon-900 md:text-4xl">Get in touch</h1>
        <p className="mt-3 text-sm text-maroon-950/60">
          Questions, ideas, or a heart ready to serve — we&apos;d love to hear from you.
        </p>
      </div>
      <Suspense>
        <ContactForm />
      </Suspense>
    </div>
  );
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">{eyebrow}</p>
      )}
      <h2 className="mt-2 font-serif text-3xl text-maroon-900 md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-sm leading-relaxed text-maroon-950/60">{subtitle}</p>}
    </div>
  );
}

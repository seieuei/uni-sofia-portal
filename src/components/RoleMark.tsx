export function RoleMark({ kind }: { kind: "student" | "admin" | "faculty" | "lecturer" | "visitor" }) {
  const common = "h-10 w-10 text-ivory";
  if (kind === "student") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M3 9.5 12 5l9 4.5-9 4.5L3 9.5Z" />
        <path d="M7 11.5v4.2c0 .4 2.2 2.3 5 2.3s5-1.9 5-2.3V11.5" />
        <path d="M21 10v6" />
      </svg>
    );
  }
  if (kind === "admin") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M4 20V8l8-4 8 4v12" />
        <path d="M9 20v-6h6v6" />
        <path d="M9 11h6" />
      </svg>
    );
  }
  if (kind === "faculty") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M4 20V10h16v10" />
        <path d="M2 20h20" />
        <path d="M8 10V6.5L12 4l4 2.5V10" />
        <path d="M8 14h.01M12 14h.01M16 14h.01" />
      </svg>
    );
  }
  if (kind === "lecturer") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M5 5h10a2 2 0 0 1 2 2v12H7a2 2 0 0 0-2 2V5Z" />
        <path d="M17 5h2a2 2 0 0 1 2 2v12h-4" />
        <path d="M8 9h6M8 13h6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M8 12h8" />
      <circle cx="12" cy="12" r="2.2" />
    </svg>
  );
}

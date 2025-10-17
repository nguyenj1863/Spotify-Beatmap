import SvgBase from "./SvgBase";

export function CalendarIcon({ className }: { className?: string }) {
  return (
    <SvgBase className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </SvgBase>
  );
}
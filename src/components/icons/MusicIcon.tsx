import SvgBase from "./SvgBase";

export function MusicIcon({ className }: { className?: string }) {
  return (
    <SvgBase className={className}>
      <path d="M9 18V5l10-2v13" />
      <circle cx="7" cy="18" r="2.5" />
      <circle cx="17" cy="16" r="2.5" />
    </SvgBase>
  );
}
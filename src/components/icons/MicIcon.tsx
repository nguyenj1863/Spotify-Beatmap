import SvgBase from "./SvgBase";

export function MicIcon({ className }: { className?: string }) {
  return (
    <SvgBase className={className}>
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <path d="M12 17v5" />
    </SvgBase>
  );
}
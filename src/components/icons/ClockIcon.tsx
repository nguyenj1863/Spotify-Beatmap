import SvgBase from "./SvgBase";

export function ClockIcon({ className }: { className?: string }) {
  return (
    <SvgBase className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </SvgBase>
  );
}
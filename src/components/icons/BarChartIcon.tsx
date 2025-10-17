import SvgBase from "./SvgBase";

export function BarChartIcon({ className }: { className?: string }) {
  return (
    <SvgBase className={className}>
      <path d="M4 20h16" />
      <rect x="6" y="10" width="3" height="7" />
      <rect x="11" y="6" width="3" height="11" />
      <rect x="16" y="12" width="3" height="5" />
    </SvgBase>
  );
}
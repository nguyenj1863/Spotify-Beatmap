import SvgBase from "./SvgBase";

export function TrendUpIcon({ className }: { className?: string }) {
  return (
    <SvgBase className={className}>
      <path d="M3 17l7-7 4 4 7-7" />
      <path d="M14 7h7v7" />
    </SvgBase>
  );
}
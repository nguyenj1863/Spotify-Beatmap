import SvgBase from "./SvgBase";

export function RefreshIcon({ className }: { className?: string }) {
  return (
    <SvgBase className={className}>
      <path d="M20 12a8 8 0 1 1-2.34-5.66" />
      <path d="M20 4v6h-6" />
    </SvgBase>
  );
}
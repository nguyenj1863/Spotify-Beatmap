import SvgBase from "./SvgBase";

export function PlaceholderIcon({ className }: { className?: string }) {
  return (
    <SvgBase className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 16l5-5 4 4 3-3 4 4" />
    </SvgBase>
  );
}
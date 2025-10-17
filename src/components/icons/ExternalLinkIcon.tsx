import SvgBase from "./SvgBase";

export function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <SvgBase className={className}>
      <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </SvgBase>
  );
}
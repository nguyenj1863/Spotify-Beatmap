import SvgBase from "./SvgBase";

export function PlayIcon({ className }: { className?: string }) {
  return (
    <SvgBase className={className}>
      <polygon points="8,5 19,12 8,19" fill="currentColor" />
    </SvgBase>
  );
}
import SvgBase from "./SvgBase";

export function UserCircleIcon({ className }: { className?: string }) {
  return (
    <SvgBase className={className}>
      <circle cx="12" cy="8" r="3" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </SvgBase>
  );
}

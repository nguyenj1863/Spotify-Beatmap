export default function SvgBase({
  className,
  children,
  viewBox = "0 0 24 24",
}: {
  className?: string;
  children: React.ReactNode;
  viewBox?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}
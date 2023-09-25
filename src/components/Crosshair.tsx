export function Crosshair() {
  return (
    <div
      id="crosshair"
      className="fixed top-1/2 left-1/2 w-3 h-3 border-border border-solid border transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded pointer-events-none"
    >
      <div className="w-1 h-1 bg-background-primary content-[''] rounded-sm" />
    </div>
  );
}

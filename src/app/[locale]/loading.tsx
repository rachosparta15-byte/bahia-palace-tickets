export default function Loading() {
  return (
    <>
      {/* Gold progress bar — fixed at top of viewport, above header */}
      <div
        aria-hidden="true"
        className="nav-progress-bar"
      />
      {/* Dark page fill so main content area isn't a white flash */}
      <div className="min-h-screen bg-[#1C1108]" />
    </>
  );
}

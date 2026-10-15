// components/TiltCard.jsx
// Was a 3D tilt that followed the pointer. Retired 15 Oct 2026: rotating a card in 3D on every
// mouse move made the text and the buttons inside it shimmer and their rounded clip glitch
// («the buttons in the cards look buggy»). It is now a plain, stable wrapper — the card lifts
// on hover instead (see «Cards v6» in globals.css). Kept as a component so every caller stays
// the same.
export default function TiltCard({ children, className = '' }) {
  return (
    <div className={`tilt-wrap ${className}`}>
      <div className="tilt-inner h-full">{children}</div>
    </div>
  );
}

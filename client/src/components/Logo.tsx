export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#6B21A8", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#7C3AED", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#purpleGrad)"/>
      
      {/* Lion's mane (jagged edges) */}
      <path d="M 20 35 Q 15 25, 20 20 Q 25 15, 30 20 Q 35 18, 40 20 Q 45 15, 50 20 Q 55 15, 60 20 Q 65 18, 70 20 Q 75 15, 80 20 Q 85 25, 80 35 Q 85 40, 80 50 Q 75 55, 70 50 Q 65 52, 60 50 Q 55 55, 50 50 Q 45 55, 40 50 Q 35 52, 30 50 Q 25 55, 20 50 Q 15 40, 20 35 Z" fill="#4C1D95"/>
      
      {/* Lion's head */}
      <ellipse cx="50" cy="50" rx="25" ry="28" fill="#6B21A8"/>
      
      {/* Lion's face features (white negative space) */}
      {/* Eye */}
      <ellipse cx="45" cy="48" rx="3" ry="5" fill="white" transform="rotate(-15 45 48)"/>
      
      {/* Nose */}
      <path d="M 50 55 L 48 60 L 52 60 Z" fill="white"/>
      
      {/* Mouth */}
      <path d="M 50 60 Q 45 65, 40 63" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
      
      {/* Inner ear */}
      <path d="M 30 40 Q 28 35, 32 38" fill="white"/>
      <path d="M 70 40 Q 72 35, 68 38" fill="white"/>
      
      {/* Crown */}
      <path d="M 35 25 L 40 20 L 45 25 L 50 18 L 55 25 L 60 20 L 65 25 L 65 30 L 35 30 Z" fill="#4C1D95"/>
      
      {/* Crown jewels (white negative space) */}
      <circle cx="40" cy="24" r="2" fill="white"/>
      <circle cx="50" cy="21" r="2.5" fill="white"/>
      <circle cx="60" cy="24" r="2" fill="white"/>
      <rect x="45" y="27" width="10" height="2" fill="white" rx="1"/>
    </svg>
  );
}


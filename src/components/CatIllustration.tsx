import React from 'react';

const CatIllustration: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      left: 0,
      bottom: 0,
      zIndex: 1000,
      width: '220px',
      height: '180px',
      pointerEvents: 'none',
    }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 220 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cola animada */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 55 150; 25 55 150; 0 55 150; -15 55 150; 0 55 150"
            keyTimes="0;0.25;0.5;0.75;1"
            dur="3.5s"
            repeatCount="indefinite"
          />
          <path
            d="M55 150 Q10 170 40 120 Q80 80 120 140"
            stroke="#C1442E"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />
        </g>
        {/* Cuerpo */}
        <path d="M60 150 Q40 80 110 60 Q200 60 170 150 Q150 180 60 150" fill="#C1442E" />
        {/* Patita trasera */}
        <path d="M140 150 Q150 170 170 150" stroke="#C1442E" strokeWidth="10" fill="none" strokeLinecap="round" />
        {/* Rayas */}
        <path d="M110 90 L140 80" stroke="#E87EA1" strokeWidth="8" strokeLinecap="round" />
        <path d="M100 110 L130 100" stroke="#E87EA1" strokeWidth="8" strokeLinecap="round" />
        {/* Cabeza */}
        <ellipse cx="150" cy="60" rx="38" ry="40" fill="#C1442E" />
        {/* Orejas */}
        <polygon points="120,30 130,10 135,40" fill="#C1442E" />
        <polygon points="180,30 190,10 185,40" fill="#C1442E" />
        {/* Interior orejas */}
        <polygon points="127,25 132,15 134,35" fill="#E87EA1" />
        <polygon points="187,25 192,15 186,35" fill="#E87EA1" />
        {/* Ojo izquierdo */}
        <path d="M140 65 Q145 70 150 65" stroke="#6B1F1A" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Ojo derecho */}
        <path d="M160 65 Q165 70 170 65" stroke="#6B1F1A" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Nariz */}
        <ellipse cx="155" cy="75" rx="4" ry="2.5" fill="#E87EA1" />
        {/* Boca */}
        <path d="M155 77 Q153 80 157 80" stroke="#6B1F1A" strokeWidth="2" fill="none" />
        {/* Bigotes */}
        <path d="M145 78 L130 82" stroke="#E87EA1" strokeWidth="2.5" />
        <path d="M145 82 L130 90" stroke="#E87EA1" strokeWidth="2.5" />
        <path d="M165 78 L180 82" stroke="#E87EA1" strokeWidth="2.5" />
        <path d="M165 82 L180 90" stroke="#E87EA1" strokeWidth="2.5" />
        {/* Mejilla */}
        <ellipse cx="135" cy="85" rx="6" ry="3" fill="#E87EA1" opacity="0.5" />
        {/* Patita delantera */}
        <path d="M110 150 Q120 170 130 150" stroke="#C1442E" strokeWidth="10" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export default CatIllustration; 
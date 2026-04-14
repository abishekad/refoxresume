import React from "react";

export default function Watermark() {
  const svgMarkup = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240">
      <g transform="translate(120, 120) rotate(-35) translate(-120, -120)">
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#000" fill-opacity="0.08" font-size="28" font-family="sans-serif" font-weight="900" letter-spacing="4">RefoxAI</text>
      </g>
    </svg>
  `;
  const encodedSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 50,
        backgroundImage: `url("${encodedSvg}")`,
        backgroundRepeat: 'repeat',
      }}
    />
  );
}

import React from "react";

// ─────────────────────────────────────────────
//  SVG Base Props
// ─────────────────────────────────────────────
export interface SVGProps {
  width?: number | string;
  height?: number | string;
  fill?: string;
  className?: string;
}

// ─────────────────────────────────────────────
//  SVG Boilerplate — edit width, height & fill
// ─────────────────────────────────────────────
const DEFAULT_WIDTH = 24;
const DEFAULT_HEIGHT = 24;
const DEFAULT_FILL = "currentColor";

// ─────────────────────────────────────────────
//  Individual SVG Components
// ─────────────────────────────────────────────



export const HamburgerIcon: React.FC<SVGProps> = ({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  fill = DEFAULT_FILL,
  className,
}) => (
  <svg xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={width}
    height={height}
    fill={fill}
    className={className}
    aria-hidden="true">
    <path d="M 3 7 A 1.0001 1.0001 0 1 0 3 9 L 27 9 A 1.0001 1.0001 0 1 0 27 7 L 3 7 z M 3 14 A 1.0001 1.0001 0 1 0 3 16 L 27 16 A 1.0001 1.0001 0 1 0 27 14 L 3 14 z M 3 21 A 1.0001 1.0001 0 1 0 3 23 L 27 23 A 1.0001 1.0001 0 1 0 27 21 L 3 21 z" />
  </svg>
)

export const DownArrowIcon: React.FC<SVGProps> = ({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  fill = DEFAULT_FILL,
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    fill={fill}
    version="1.1"
    id="Layer_1"
    width={width}
    height={height}
    className={className}
    viewBox="0 0 100 100"
    enableBackground="new 0 0 100 100"
    xmlSpace="preserve">

    <g id="SVGRepo_bgCarrier" stroke-width="0" />

    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

    <g id="SVGRepo_iconCarrier"> <g> <path d="M78.466,35.559L50.15,63.633L22.078,35.317c-0.777-0.785-2.044-0.789-2.828-0.012s-0.789,2.044-0.012,2.827L48.432,67.58 c0.365,0.368,0.835,0.563,1.312,0.589c0.139,0.008,0.278-0.001,0.415-0.021c0.054,0.008,0.106,0.021,0.16,0.022 c0.544,0.029,1.099-0.162,1.515-0.576l29.447-29.196c0.785-0.777,0.79-2.043,0.012-2.828S79.249,34.781,78.466,35.559z" /> </g> </g>

  </svg>
)

// ─────────────────────────────────────────────
//  Default Export — all SVGs in one place
// ─────────────────────────────────────────────
const Icons = {
  Hamburger: HamburgerIcon,
  DownArrow: DownArrowIcon
};

export default Icons;

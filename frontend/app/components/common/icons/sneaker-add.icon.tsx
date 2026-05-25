import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
}

const SneakerAddIcon = React.forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 24,
      color = "currentColor",
      strokeWidth = 2,
      absoluteStrokeWidth,
      className,
      ...props
    },
    ref,
  ) => {
    const computedStrokeWidth = absoluteStrokeWidth
      ? (Number(strokeWidth) * 24) / Number(size)
      : strokeWidth;

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={computedStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
        {...props}
      >
        {/* Sneaker */}
        <path d="M3 16.4c1.2 0 2.5-.4 3.7-1.1l4.1-2.7c1-.7 1.5-1.7 1.6-2.9l.1-2.2c2.2 2.4 4.3 3.9 7.6 4.8 1.2.3 2.4 1.1 2.7 2.4l.2 1c.2 1-.5 1.8-1.5 1.9L7 19.4c-2 .2-3.6-.4-4.7-1.6-.5-.6-.9-1.2-.9-2.4Z" />
        <path d="M3.2 17.5c.8.8 2 1.4 3.8 1.2l14.8-1.6c.9-.1 1.7-.5 2.2-1.2" />

        {/* Laces */}
        <path d="M9.7 14.8l2.2-.3" />
        <path d="M8.7 16.2l2.3-.3" />

        {/* Plus badge (top-right) */}
        <path d="M19 3v6" />
        <path d="M16 6h6" />
      </svg>
    );
  },
);

SneakerAddIcon.displayName = "SneakerAddIcon";
export default SneakerAddIcon;

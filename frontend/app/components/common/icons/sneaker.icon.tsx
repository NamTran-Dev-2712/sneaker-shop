import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
}

const SneakerIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        {/* Sneaker silhouette */}
        <path d="M3 16.5c1.2 0 2.6-.4 3.8-1.2l4.2-2.8c.9-.6 1.4-1.6 1.5-2.7l.2-2.3c2.2 2.4 4.3 4 7.6 4.9 1.2.3 2.4 1.1 2.7 2.4l.2 1.1c.2.9-.5 1.8-1.5 1.9L7 19.5c-2 .2-3.6-.4-4.7-1.6-.5-.6-.9-1.3-.9-2.4Z" />

        {/* Sole */}
        <path d="M3.2 17.6c.8.8 2 1.4 3.8 1.2l14.8-1.6c.9-.1 1.7-.5 2.2-1.2" />

        {/* Laces */}
        <path d="M10.2 13.5l2.2-.3" />
        <path d="M9.4 15l2.3-.3" />
        <path d="M8.4 16.4l2.4-.3" />

        {/* Toe / detail */}
        <path d="M18.5 14.3h.01" />
      </svg>
    );
  },
);

SneakerIcon.displayName = "SneakerIcon";

export default SneakerIcon;

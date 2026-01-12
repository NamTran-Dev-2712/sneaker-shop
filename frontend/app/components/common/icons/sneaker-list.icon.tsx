import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
}

const SneakerListIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M3 16.6c1.2 0 2.5-.4 3.7-1.1l4.1-2.7c1-.7 1.5-1.7 1.6-2.9l.1-2.2c2.2 2.4 4.3 3.9 7.6 4.8 1.2.3 2.4 1.1 2.7 2.4l.2 1c.2 1-.5 1.8-1.5 1.9L7 19.6c-2 .2-3.6-.4-4.7-1.6-.5-.6-.9-1.2-.9-2.4Z" />
        <path d="M3.2 17.7c.8.8 2 1.4 3.8 1.2l14.8-1.6c.9-.1 1.7-.5 2.2-1.2" />

        {/* List lines on upper area */}
        <path d="M13.2 9.8h6" />
        <path d="M13.2 12.2h5.2" />
        <path d="M13.2 14.6h4.4" />
      </svg>
    );
  },
);

SneakerListIcon.displayName = "SneakerListIcon";
export default SneakerListIcon;

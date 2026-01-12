import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
}

const BrandAddIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        {/* Tag */}
        <path d="M10.5 3h6l4 4v6l-8.9 8.9a2.3 2.3 0 0 1-3.3 0L3.6 17.5a2.3 2.3 0 0 1 0-3.3L10.5 3Z" />
        <path d="M17 6.5h.01" />

        {/* Plus badge */}
        <path d="M18 14v6" />
        <path d="M15 17h6" />
      </svg>
    );
  },
);

BrandAddIcon.displayName = "BrandAddIcon";
export default BrandAddIcon;

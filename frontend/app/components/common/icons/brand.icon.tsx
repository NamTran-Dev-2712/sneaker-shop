import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
}

const BrandIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        {/* Tag / Label + "B" */}
        <path d="M11 3h6l4 4v6l-9.2 9.2a2.3 2.3 0 0 1-3.3 0L3.6 17.5a2.3 2.3 0 0 1 0-3.3L11 3Z" />
        <path d="M13 9h2.2a1.8 1.8 0 1 1 0 3.6H13V9Z" />
        <path d="M13 12.6h2.6a1.7 1.7 0 1 1 0 3.4H13v-3.4Z" />
        <path d="M13 9v7" />
        <path d="M17.5 6.5h.01" />
      </svg>
    );
  },
);

BrandIcon.displayName = "BrandIcon";

export default BrandIcon;

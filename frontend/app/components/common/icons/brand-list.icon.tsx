import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
}

const BrandListIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M11 3h6l4 4v6l-7.8 7.8a2.3 2.3 0 0 1-3.3 0L3.6 18a2.3 2.3 0 0 1 0-3.3L11 3Z" />
        <path d="M17.5 6.5h.01" />

        {/* List lines */}
        <path d="M12.2 12h4.6" />
        <path d="M12.2 15h4.2" />
        <path d="M12.2 18h3.6" />
      </svg>
    );
  },
);

BrandListIcon.displayName = "BrandListIcon";
export default BrandListIcon;

import { type SVGProps } from "react";

type SVGIconProps = SVGProps<SVGSVGElement>;

export function SVGIcon(props: SVGIconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      focusable="false"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      {...props}
    />
  );
}

import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

const IconBase: React.FC<IconProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  />
);

export const IconNumerology = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </IconBase>
);

export const IconAstrology = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v3" />
    <path d="M12 19v3" />
    <path d="M2 12h3" />
    <path d="M19 12h3" />
    <path d="M5 5l2 2" />
    <path d="M17 17l2 2" />
    <path d="M5 19l2-2" />
    <path d="M17 7l2-2" />
  </IconBase>
);

export const IconZodiac = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 12a8 8 0 0 1 8-8" />
    <path d="M4 12a8 8 0 0 0 8 8" />
    <circle cx="12" cy="12" r="1" />
  </IconBase>
);

export const IconEnergy = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8z" />
  </IconBase>
);

export const IconDiscover = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </IconBase>
);

export const IconLayers = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m12 2 9 4.5-9 4.5-9-4.5L12 2z" />
    <path d="M3 15l9 4.5 9-4.5" />
    <path d="M3 10.5l9 4.5 9-4.5" />
  </IconBase>
);

export const IconCompass = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M16 8l-4 4-4-4" />
    <path d="M12 16V12" />
    <path d="m10 14 2-2" />
  </IconBase>
);

export const IconUsers = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
  </IconBase>
);

export const IconGlobe = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20z" />
    <path d="M2 12h20" />
  </IconBase>
);

export const IconSparkles = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 21l1.9-5.8 5.8-1.9-5.8-1.9z" />
  </IconBase>
);

export const IconLifePath = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 12h16" />
    <path d="M4 12l4-4" />
    <path d="M4 12l4 4" />
  </IconBase>
);

export const IconSun = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
  </IconBase>
);

export const IconArrowRight = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </IconBase>
);

export const IconLock = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </IconBase>
);

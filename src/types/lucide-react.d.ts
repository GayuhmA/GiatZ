declare module "lucide-react" {
  import { FC, SVGProps } from "react";
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }
  export type Icon = FC<IconProps>;
  export const Sparkles: Icon;
  export const Zap: Icon;
  export const Rocket: Icon;
  export const Star: Icon;
  export const Brain: Icon;
  export const Trophy: Icon;
  export const Timer: Icon;
  export const Share2: Icon;
  export const CheckCircle2: Icon;
  export const Settings: Icon;
  export const Flame: Icon;
  export const Hand: Icon;
  export const Eye: Icon;
  export const EyeOff: Icon;
  export const Pencil: Icon;
  export const Check: Icon;
  export const X: Icon;
  export const Clock: Icon;
  export const LayoutGrid: Icon;
  export const FileText: Icon;
  export const FileQuestion: Icon;
  export const Layers: Icon;
}

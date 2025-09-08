// src/types/static.d.ts
import type { ImageSourcePropType } from "react-native";

declare module "*.png" {
  const content: ImageSourcePropType;
  export default content;
}
declare module "*.jpg" {
  const content: ImageSourcePropType;
  export default content;
}
declare module "*.jpeg" {
  const content: ImageSourcePropType;
  export default content;
}
declare module "*.webp" {
  const content: ImageSourcePropType;
  export default content;
}
declare module "*.svg" {
  // Si usas SVGR, cambia a React.FC<...>. Para Expo por defecto, any.
  const content: any;
  export default content;
}

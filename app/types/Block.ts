export type Block = {
  id: string;
  type: "text" | "image";
  content: string;
  row: number;
  column: 0 | 1;
  imageHeight?: number;
  imageWidth?: number;
  objectFit?: React.CSSProperties["objectFit"];
};

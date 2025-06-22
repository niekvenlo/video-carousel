import { useRef, type PropsWithChildren } from "react";

type RestProps = Record<string, any>;
type Props = PropsWithChildren & {
  onDrag: ({ x, dx }: { x: number; dx?: number }) => void;
} & RestProps;

function Draggable({
  children,
  onDragStart,
  onDragEnd,
  onDrag,
  ...restProps
}: Props) {
  const xOffset = useRef<number | null>(null);
  const ts = useRef<number>(Date.now());
  return (
    <div className="layer-container">
      <div className="bottom-layer">{children}</div>
      <div
        {...restProps}
        className="top-layer"
        onDragStart={(e) => {
          xOffset.current = e.pageX;
          ts.current = Date.now();
          onDragStart();
        }}
        onDragEnd={onDragEnd}
        onDragOver={(e) => {
          const x = e.pageX - xOffset.current!;
          const dx = Math.round((10 * x) / (Date.now() - ts.current)) / 10;
          onDrag({ x, dx });
          e.preventDefault();
          e.dataTransfer.setDragImage(new Image(), 0, 0);
        }}
        draggable="true"
      ></div>
    </div>
  );
}

export default Draggable;

import { useRef, type PropsWithChildren } from "react";

type RestProps = Record<string, any>;
type Props = PropsWithChildren & { onDrag: (x: number) => void } & RestProps;

function Draggable({ children, onDrag, ...restProps }: Props) {
  const xOffset = useRef<number | null>(null);
  return (
    <div className="layer-container">
      <div className="bottom-layer">{children}</div>
      <div
        {...restProps}
        className="top-layer"
        onDragOver={(e) => {
          if (xOffset.current === null) {
            xOffset.current = e.pageX;
          }
          onDrag(e.pageX - xOffset.current);
          e.preventDefault();
          e.dataTransfer.setDragImage(new Image(), 0, 0);
        }}
        draggable="true"
      ></div>
    </div>
  );
}

export default Draggable;

import {
  useCallback,
  useRef,
  useState,
  type DragEvent,
  type TouchEvent,
  type PropsWithChildren,
} from "react";
import "./draggable.css";

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

  const calcMovement = (pageX: number) => {
    const x = pageX - xOffset.current!;
    const dx = Math.round((10 * x) / (Date.now() - ts.current)) / 10;
    return { x, dx };
  };

  const onDragStartCallback = useCallback(
    (event: DragEvent) => {
      xOffset.current = event.pageX;
      ts.current = Date.now();
      onDragStart();
    },
    [onDragStart]
  );
  const onDragOverCallback = useCallback(
    (event: DragEvent) => onDrag(calcMovement(event.pageX)),
    [onDrag]
  );
  const onDragEndCallback = useCallback(
    (event: DragEvent) => onDragEnd(calcMovement(event.pageX)),
    [onDragEnd]
  );

  return (
    <div className="draggable-layer-container">
      <div className="bottom-layer">{children}</div>
      <div
        {...restProps}
        className="top-layer"
        onDragStart={onDragStartCallback}
        onDragOver={onDragOverCallback}
        onDragEnd={onDragEndCallback}
        draggable="true"
        onTouchStart={(e) => {
          xOffset.current = e.touches[0].pageX;
          ts.current = Date.now();
          onDragStart();
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          onDrag(calcMovement(e.touches[0].pageX));
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          onDragEnd(calcMovement(e.changedTouches[0].pageX));
        }}
        onTouchCancel={(e) => {
          e.preventDefault();
          onDragEnd(calcMovement(e.touches[0].pageX));
        }}
      ></div>
    </div>
  );
}

export default Draggable;

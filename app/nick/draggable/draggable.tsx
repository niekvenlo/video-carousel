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

  const calcMovement = useCallback((pageX: number) => {
    const x = pageX - xOffset.current!;
    const dx = Math.round((10 * x) / (Date.now() - ts.current)) / 10;
    return { x, dx };
  }, []);

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

  const onTouchStartCallback = useCallback(
    (event: TouchEvent) => {
      xOffset.current = event.touches[0].pageX;
      ts.current = Date.now();
      onDragStart();
    },
    [onDragStart]
  );
  const onTouchMoveCallback = useCallback(
    (event: TouchEvent) => {
      event.preventDefault();
      onDrag(calcMovement(event.touches[0].pageX));
    },
    [onDrag]
  );
  const onTouchEndCallback = useCallback((event: TouchEvent) => {
    onDragEnd(calcMovement(event.changedTouches[0].pageX));
  }, []);

  return (
    <div className="draggable-layer-container">
      <div className="bottom-layer">{children}</div>
      <div
        {...restProps}
        className="top-layer"
        draggable="true"
        // Mouse support
        onDragStart={onDragStartCallback}
        onDragOver={onDragOverCallback}
        onDragEnd={onDragEndCallback}
        // Touch screen support
        onTouchStart={onTouchStartCallback}
        onTouchMove={onTouchMoveCallback}
        onTouchEnd={onTouchEndCallback}
        onTouchCancel={onTouchEndCallback}
      ></div>
    </div>
  );
}

export default Draggable;

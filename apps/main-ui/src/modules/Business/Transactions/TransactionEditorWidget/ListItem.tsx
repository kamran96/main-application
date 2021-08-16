import dotsGrid from "@iconify-icons/mdi/dots-grid";
import { Icon } from "@iconify/react";
import { XYCoord } from "dnd-core";
import React, { ReactElement, useRef } from "react";
import { DropTargetMonitor, useDrag, useDrop } from "react-dnd";

import convertToRem from "../../../../utils/convertToRem";

export const ItemTypes = {
  CARD: "card",
};

const style = {};

export interface CardProps {
  id: any;
  children: ReactElement<any>;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  className?: string;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}
export const ListItem: React.FC<CardProps> = ({
  id,
  children,
  index,
  moveCard,
  className,
}) => {
  const ref = useRef<any>(null);
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.CARD, id, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.6 : 1;
  drag(drop(ref));
  return (
    <tr className={className} ref={ref} style={{ ...style, opacity }}>
      <td style={{ cursor: "move", width: convertToRem(10) }}>
        <Icon icon={dotsGrid} color={"#B1B1B1"} style={{ fontSize: "17px" }} />
      </td>
      {children}
    </tr>
  );
};

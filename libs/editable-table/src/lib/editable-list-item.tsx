import { memo } from 'react';
import { EditableColumnsType } from './editable-table';

type DivProps = JSX.IntrinsicElements['tr'];

export interface EditableListItemProps extends DivProps {
  columns: EditableColumnsType[];
  row: any;
  moveCard?: (dragIndex: number, hoverIndex: number) => void;
  index: number;
  id: string;
  selectedIndex: number | null;
  customMount: any;
  rowClassName?: (record: any, index: number) => string;
}

const _EditableListItem = ({
  row,
  columns,
  moveCard,
  index,
  id,
  rowClassName,
  ...rest
}: EditableListItemProps) => {
  const renderData = (column: EditableColumnsType, row: any, index: number) => {
    const styles: any = { ...column.style };
    if (column.width) {
      // styles = { ...styles, width: column.width };
    }

    return (
      <td className="ant-table-cell">
        {column.render
          ? column.render(row[column.dataIndex], row, index)
          : row[column.dataIndex]}
      </td>
    );
  };

  return (
    <tr
      className={`${rowClassName ? rowClassName(row, index) : ''}`}
      id={id}
      {...rest}
    >
      {columns?.map((colD) => {
        return renderData(colD, row, index);
      })}
    </tr>
  );
};

export const EditableListItem = memo(
  _EditableListItem,
  (prevprops, nextProps) => {
    return (
      JSON.stringify(prevprops.row) === JSON.stringify(nextProps.row) &&
      JSON.stringify(prevprops.columns) === JSON.stringify(nextProps.columns) &&
      JSON.stringify(prevprops.rowClassName) ===
        JSON.stringify(nextProps.rowClassName) &&
      prevprops?.customMount === nextProps?.customMount
    );
  }
);

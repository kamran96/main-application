import { memo } from 'react';
import { EditableColumnsType } from './editable-table';

type DivProps = JSX.IntrinsicElements['tr'];

export interface EditableListItemProps extends DivProps {
  columns: EditableColumnsType[];
  row: any;
  moveCard?: (dragIndex: number, hoverIndex: number) => void;
  index: number;
  id: string;
  selectedIndex: number |null
}

const _EditableListItem = ({
  row,
  columns,
  moveCard,
  index,
  id,
  ...rest
}: EditableListItemProps) => {
  const renderData = (column: EditableColumnsType, row: any, index: number) => {
    let styles: any = { ...column.style };
    if (column.width) {
      // styles = { ...styles, width: column.width };
    }

    return (
      <td  className="ant-table-cell">
        {column.render
          ? column.render(row[column.dataIndex], row, index)
          : row[column.dataIndex]}
      </td>
    );
  };

  return (
    <tr id={id} {...rest}>
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
      JSON.stringify(prevprops.columns) === JSON.stringify(nextProps.columns)
    );
  }
);

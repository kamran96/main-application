import { useEffect, useState } from 'react';
import { EditableListItem } from './editable-list-item';
import { EditableTableWrapper } from './styles';
import { Skeleton } from 'antd';

/* eslint-disable-next-line */

export interface EditableColumnsType {
  title: string;
  dataIndex: string;
  key: string;
  style?: CSSStyleSheet;
  className?: string;
  id?: string;
  ref?: any;
  width?: number;
  render?: (data: any, row: Object, index: number) => JSX.Element;
}

export interface Scrollable {
  offsetY: number;
  offsetX: number;
}

export interface EditableTableProps {
  columns: EditableColumnsType[];
  data: any[];
  dragable: (payload: any[]) => void;
  scrollable?: Scrollable;
  loading?: boolean;
  cacheKey?: string;
  resetCache?: boolean;
  // onMoveCard: (data: any[])=>void;
}

export function EditableTable({
  columns,
  data,
  dragable,
  scrollable,
  loading,
  cacheKey,
  resetCache,
}: EditableTableProps) {
  const [{ tableColumns, tableData }, setLoadingConfig] = useState<{
    tableColumns: EditableColumnsType[];
    tableData: any[];
  }>({
    tableData: [],
    tableColumns: [],
  });

  useEffect(() => {
    if (cacheKey && cacheKey !== null && data !== null) {
      localStorage.setItem(cacheKey, JSON.stringify(data));
    }
  }, [data, cacheKey]);

  useEffect(() => {
    if (resetCache && true && cacheKey) {
      localStorage.removeItem(cacheKey);
    }
  }, [resetCache]);

  useEffect(() => {
    if (cacheKey) {
      let data = localStorage.getItem(cacheKey);
      if (data) {
        dragable(JSON.parse(data));
      }
    }
  }, [cacheKey]);

  useEffect(() => {
    if (loading) {
      setLoadingConfig(() => {
        let cols = columns?.map((col) => {
          return {
            ...col,
            render: () => (
              <Skeleton title={false} paragraph={{ rows: 1 }} active />
            ),
          };
        });

        return { tableColumns: cols, tableData: [{}, {}, {}] };
      });
    } else if (!loading && data) {
      setLoadingConfig({ tableColumns: columns, tableData: data });
    }
  }, [loading, data, columns]);

  const [drag, setDrag] = useState<{
    dragIndex: number | null;
    dropIndex: number | null;
  }>({
    dragIndex: null,
    dropIndex: null,
  });
  const [dragEnd, setDragEnd] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { dragIndex, dropIndex } = drag;

  const onDragStart = (index: number) => {
    setDrag((prev) => {
      return { ...prev, dragIndex: index };
    });
  };
  const onMouseOver = (index: number) => {
    setDrag((prev) => {
      return { ...prev, dropIndex: index };
    });
  };

  useEffect(() => {
    if (
      dragIndex !== null &&
      dropIndex !== null &&
      dragIndex !== dropIndex &&
      dragEnd
    ) {
      console.log(dragIndex, dropIndex);
      let _dragItem = data[dragIndex];

      let allRows = [...data];
      allRows.splice(dragIndex, 1);
      allRows.splice(dropIndex, 0, _dragItem);

      dragable(allRows);

      resetDrag();
    }
  }, [dragIndex, dropIndex, dragEnd]);

  const resetDrag = () => {
    setDrag({ dragIndex: null, dropIndex: null });
    setDragEnd(false);
  };

  return (
    <EditableTableWrapper scrollable={scrollable ? scrollable : null}>
      <colgroup>
        {columns.map((col, index) => {
          let style = { width: col?.width ? `${col.width}px` : '' };
          return <col key={index} style={style} />;
        })}
      </colgroup>
      <thead className="ant-table-thead ">
        <tr>
          {columns?.map((col, index) => {
            return (
              <th className="ant-table-cell" key={col.key + index}>
                {col.title}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody className="ant-table-tbody">
        {tableData.map((item, index) => {
          return (
            <EditableListItem
              onMouseOver={() => setSelectedIndex(index)}
              selectedIndex={selectedIndex}
              onDragStart={() => onDragStart(index)}
              onDragOver={() => {
                onMouseOver(index);
              }}
              onDragEnd={() => setDragEnd(true)}
              draggable={true}
              key={index}
              id={`item-level-${index}`}
              index={index}
              row={item}
              columns={tableColumns}
            />
          );
        })}
      </tbody>
    </EditableTableWrapper>
  );
}

export default EditableTable;
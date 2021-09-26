import { render } from '@testing-library/react';

import EditableTable from './editable-table';

describe('EditableTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditableTable />);
    expect(baseElement).toBeTruthy();
  });
});

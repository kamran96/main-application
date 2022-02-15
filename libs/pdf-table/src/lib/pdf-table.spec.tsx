import { render } from '@testing-library/react';

import PdfTable from './pdf-table';

describe('PdfTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PdfTable />);
    expect(baseElement).toBeTruthy();
  });
});

import { render } from '@testing-library/react';

import SidebarUiV2 from './sidebar-ui-v2';

describe('SidebarUiV2', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SidebarUiV2 />);
    expect(baseElement).toBeTruthy();
  });
});

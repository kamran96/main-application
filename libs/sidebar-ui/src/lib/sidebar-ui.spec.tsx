import { render } from '@testing-library/react';

import SidebarUi from './sidebar-ui';

describe('SidebarUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SidebarUi />);
    expect(baseElement).toBeTruthy();
  });
});

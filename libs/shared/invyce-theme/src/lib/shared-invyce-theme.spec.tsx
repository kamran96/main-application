import { render } from '@testing-library/react';

import SharedInvyceTheme from './shared-invyce-theme';

describe('SharedInvyceTheme', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SharedInvyceTheme />);
    expect(baseElement).toBeTruthy();
  });
});

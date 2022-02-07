import { render } from '@testing-library/react';

import MicroFrontend from './micro-frontend';

describe('MicroFrontend', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MicroFrontend />);
    expect(baseElement).toBeTruthy();
  });
});

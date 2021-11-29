import { render } from '@testing-library/react';

import ErrorBoundry from './error-boundry';

describe('ErrorBoundry', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ErrorBoundry />);
    expect(baseElement).toBeTruthy();
  });
});

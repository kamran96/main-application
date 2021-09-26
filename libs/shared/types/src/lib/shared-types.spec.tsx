import { render } from '@testing-library/react';

import SharedTypes from './shared-types';

describe('SharedTypes', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SharedTypes />);
    expect(baseElement).toBeTruthy();
  });
});

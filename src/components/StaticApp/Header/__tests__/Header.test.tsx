import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';

describe('<Header />', () => {
  it('renders a visible header title and logo', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(getByRole('img')).toBeVisible();
  });
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ConfirmedActionButton } from '../ConfirmedActionButton';

const popupText = 'Are you sure you would like to delete the test sample?';

describe('<ConfirmedActionButton />', () => {
  it('renders the popup when clicked', () => {
    const { queryByText, getByText } = render(
      <ConfirmedActionButton
        size="large"
        type="accept"
        displayText="Are you sure you would like to delete the test sample?"
      />
    );
    expect(queryByText(popupText)).toBeNull();
    fireEvent.click(getByText('Accept'));
    expect(queryByText(popupText)).not.toBeNull();
    expect(getByText(popupText)).toBeInTheDocument();
  });
});

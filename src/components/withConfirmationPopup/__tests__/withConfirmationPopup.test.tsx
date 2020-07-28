import React, { FC } from 'react';
import { render, fireEvent } from '@testing-library/react';
import withConfirmationPopup from '../withConfirmationPopup';

const containerText = 'Lorem Ipsum';
const popupText = 'Are you sure you would like to delete the test sample?';
const mockCallback = jest.fn();

const MockComponent: FC = () => {
  return <div>{containerText}</div>;
};

const MockWithConfirmation: FC = withConfirmationPopup(MockComponent);

describe('withConfirmationPopup', () => {
  it('renders the wrapped component', () => {
    const { getByText } = render(<MockWithConfirmation />);
    expect(getByText(containerText)).toBeInTheDocument();
  });

  it('renders the popup when clicked', () => {
    const { getByText, queryByText } = render(
      <MockWithConfirmation deleteName="test" deleteType="sample" />
    );
    expect(queryByText(popupText)).toBeNull();
    fireEvent.click(getByText(containerText));
    expect(queryByText(popupText)).not.toBeNull();
    expect(getByText(popupText)).toBeInTheDocument();
  });

  it('calls the onConfirm callback when the confirmation is accepted', () => {
    const { getByText, getByTestId } = render(<MockWithConfirmation onConfirm={mockCallback} />);
    fireEvent.click(getByText(containerText));
    expect(mockCallback).not.toHaveBeenCalled();
    fireEvent.click(getByTestId('accept'));
    expect(mockCallback).toHaveBeenCalled();
  });

  it('closes the popup when the confirmation is denied', () => {
    const { getByText, queryByText, getByTestId } = render(
      <MockWithConfirmation deleteName="test" deleteType="sample" />
    );
    expect(queryByText(popupText)).toBeNull();
    fireEvent.click(getByText(containerText));
    expect(queryByText(popupText)).not.toBeNull();
    fireEvent.click(getByTestId('decline'));
    expect(queryByText(popupText)).toBeNull();
  });
});

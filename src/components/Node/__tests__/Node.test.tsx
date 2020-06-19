import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Node from '../Node';
import { createState } from 'utils/builder';

const testState = {
  label: 'Start',
  transitions: []
};

describe('<Node />', () => {
  it('renders a node with text, icon, and correct styles', () => {
    const { container, getByText, getByRole } = render(
      <Node
        pathwayState={testState}
        xCoordinate={0}
        yCoordinate={0}
        currentNode={createState('TestNode')}
      />
    );

    expect(getByText(testState.label)).toBeVisible();
    expect(getByRole('img', { hidden: true })).toBeVisible();

    expect(container.firstChild).toHaveClass('node');
    expect(container.firstChild).toHaveStyle(`top: 0px`);
    expect(container.firstChild).toHaveStyle(`left: 0px`);
  });

  it('expands the additional children when clicked', () => {
    const { container } = render(
      <Node
        pathwayState={testState}
        xCoordinate={0}
        yCoordinate={0}
        currentNode={createState('TestNode')}
      />
    );

    const numberOfChildren = container.children.length;

    fireEvent.click(container);
    expect(container.children.length > numberOfChildren);
  });
});

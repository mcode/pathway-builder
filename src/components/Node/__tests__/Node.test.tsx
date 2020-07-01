import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Node from '../Node';
import { createNode } from 'utils/builder';

const testNode = {
  label: 'Start',
  transitions: []
};

describe('<Node />', () => {
  it('renders a node with text, no icon, and correct styles', () => {
    const { container, getByText, getByRole } = render(
      <Node
        pathwayNode={testNode}
        xCoordinate={0}
        yCoordinate={0}
        currentNode={createNode('TestNode')}
      />
    );

    expect(getByText(testNode.label)).toBeVisible();
    // The created node does not have a type therefore no icon will be displayed
    expect(() => {
      getByRole('img', { hidden: true });
    }).toThrowError();

    expect(container.firstChild).toHaveClass('node');
    expect(container.firstChild).toHaveStyle(`top: 0px`);
    expect(container.firstChild).toHaveStyle(`left: 0px`);
  });

  it('expands the additional children when clicked', () => {
    const { container } = render(
      <Node
        pathwayNode={testNode}
        xCoordinate={0}
        yCoordinate={0}
        currentNode={createNode('TestNode')}
      />
    );

    const numberOfChildren = container.children.length;

    fireEvent.click(container);
    expect(container.children.length > numberOfChildren);
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import Arrow from '../Arrow';
import { createState } from 'utils/builder';

const testEdge = {
  start: 'start',
  end: 'end',
  label: {
    text: 'label',
    x: 0,
    y: 0
  },
  points: [
    { x: 0, y: 0 },
    { x: 10, y: 10 },
    { x: 20, y: 20 }
  ]
};

describe('<Arrow />', () => {
  it('renders an arrow with a label', () => {
    const { container, getByText } = render(
      <Arrow edge={testEdge} edgeName="test" widthOffset={0} currentNode={createState('Test')} />
    );

    expect(getByText(testEdge.label.text)).toBeVisible();
    const className = container.firstElementChild.getAttribute('class');
    expect(className.includes('arrow'));
  });

  it('renders an arrow on patient path', () => {
    const { container } = render(
      <Arrow edge={testEdge} edgeName="test" widthOffset={0} currentNode={createState('Test')} />
    );

    const className = container.firstElementChild.getAttribute('class');
    expect(className.includes('arrow'));
  });
});

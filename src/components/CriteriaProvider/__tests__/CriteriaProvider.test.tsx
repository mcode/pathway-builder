import { CriteriaProvider, useCriteriaContext } from '../CriteriaProvider';
import { render, screen } from '@testing-library/react';
import React, { FC } from 'react';

const DisplayCriteria: FC<> = () => {
  const { criteria } = useCriteriaContext();
  return <span>Number of Criteria: {criteria.length}</span>;
};

describe('<CriteriaProvider />', () => {
  it('provides access to criteria', () => {
    render(
      <CriteriaProvider>
        <DisplayCriteria />
      </CriteriaProvider>
    );
    expect(screen.getByText(/^Number of Criteria:/)).toHaveTextContent('Number of Criteria: 0');
  });
});

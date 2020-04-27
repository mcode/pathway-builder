import React from 'react';
import { render } from '@testing-library/react';
import DropDown from '../DropDown';

const label = 'drop down options';
const idText = 'fakeId';
const options = [
  { label: 'cat', value: 'feline' },
  { label: 'dog', value: 'canine' },
  { label: 'lion', value: 'simba' }
];

describe('<DropDown />', () => {
  it('renders the options', () => {
    const { getByLabelText } = render(<DropDown id={idText} options={options} label={label} />);
    expect(getByLabelText(label)).toBeVisible();
  });
});

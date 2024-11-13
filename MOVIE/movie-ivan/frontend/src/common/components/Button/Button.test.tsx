import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import Button from '.';

describe('Button component', () => {
  it('should match snapshot when initially rendered', () => {
    const { asFragment } = render(
      <Button data-testid="button" className="p-2" onClick={() => {}}>
        Click Me
      </Button>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the button with correct text', () => {
    render(
      <Button data-testid="button" onClick={() => {}}>
        Click Me
      </Button>,
    );
    expect(screen.getByTestId('button')).toHaveTextContent('Click Me');
  });

  it('applies the correct default classes', () => {
    render(<Button data-testid="button">Styled Button</Button>);
    const button = screen.getByTestId('button');
    expect(button).toHaveClass('rounded-lg bg-blue-500 p-2 px-6 font-semibold text-white');
  });

  it('calls onClick when button is clicked', () => {
    const handleClick = jest.fn();
    render(
      <Button data-testid="button" onClick={handleClick}>
        Click Me
      </Button>,
    );
    fireEvent.click(screen.getByTestId('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

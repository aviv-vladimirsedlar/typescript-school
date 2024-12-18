import { screen, fireEvent } from '@testing-library/react';

export const findInputAndChangeText = (testId: string, value: string) => {
  const wrapper = screen.getByTestId(testId);
  const input = wrapper.querySelector('input');
  if (input) {
    fireEvent.change(input, { target: { value } });
  }
};

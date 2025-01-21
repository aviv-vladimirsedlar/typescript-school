import { GeminiProvider } from "@gemini/core";
import { AVIV_THEME } from "@gemini/tokens";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import React from "react";

import "@testing-library/jest-dom";
import { findInputAndChangeText } from "../../../../common/utils/test.util";
import { useRegister } from "./hooks/useRegister";

import { RegisterForm } from "./RegisterForm";

jest.mock("../../../common/hooks/useRegister");

const mockMutate = jest.fn();
const mockUseRegister = useRegister as jest.MockedFunction<typeof useRegister>;

const renderComponent = () => (
  <GeminiProvider theme={AVIV_THEME}>
    <RegisterForm />
  </GeminiProvider>
);

describe("RegisterForm", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockUseRegister.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  it("should match snapshot when initially rendered", () => {
    const { asFragment } = render(renderComponent());
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render the form and handle successful registration", async () => {
    mockMutate.mockImplementation(
      (data, { onSuccess }) => onSuccess && onSuccess()
    );
    render(renderComponent());
    await act(async () => {
      findInputAndChangeText("first-name-input", "John");
      findInputAndChangeText("last-name-input", "Doe");
      findInputAndChangeText("email-input", "john.doe@example.com");
      findInputAndChangeText("password-input", "Password123");
      findInputAndChangeText("confirm-password-input", "Password123");
      fireEvent.click(screen.getByTestId("btn-register"));
    });
    await waitFor(() => expect(mockMutate).toHaveBeenCalled());
    expect(
      screen.queryByText(/An unknown error occurred/i)
    ).not.toBeInTheDocument();
  });

  it("should show error message on failed registration", async () => {
    mockMutate.mockImplementation(
      (data, { onError }) =>
        onError &&
        onError({ response: { data: { message: "Registration failed" } } })
    );
    render(renderComponent());
    await act(async () => {
      findInputAndChangeText("first-name-input", "John");
      findInputAndChangeText("last-name-input", "Doe");
      findInputAndChangeText("email-input", "john.doe@example.com");
      findInputAndChangeText("password-input", "Password123");
      findInputAndChangeText("confirm-password-input", "Password123");
      fireEvent.click(screen.getByTestId("btn-register"));
    });
    await waitFor(() =>
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument()
    );
  });

  it("should validate required fields and show validation errors", async () => {
    render(renderComponent());
    await act(async () => {
      fireEvent.click(screen.getByTestId("btn-register"));
    });
    await waitFor(() => {
      expect(screen.getByTestId("first-name-input")).toHaveTextContent(
        "is required"
      );
      expect(screen.getByTestId("last-name-input")).toHaveTextContent(
        "is required"
      );
      expect(screen.getByTestId("email-input")).toHaveTextContent(
        "is required"
      );
      expect(screen.getByTestId("password-input")).toHaveTextContent(
        "is required"
      );
      expect(screen.getByTestId("confirm-password-input")).toHaveTextContent(
        "is required"
      );
    });
  });
});

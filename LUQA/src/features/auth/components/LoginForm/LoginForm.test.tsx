import { GeminiProvider } from "@gemini/core";
import { AVIV_THEME } from "@gemini/tokens";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

import "@testing-library/jest-dom";

import { findInputAndChangeText } from "../../../../common/utils/test.util";
import { useLogin } from "../../hooks/useLogin";

import { LoginForm } from "./LoginForm";

jest.mock("../../../common/hooks/useLogin");

const renderComponent = () => (
  <GeminiProvider theme={AVIV_THEME}>
    <LoginForm />
  </GeminiProvider>
);

const mockMutate = jest.fn();
const mockUseLogin = useLogin as jest.MockedFunction<typeof useLogin>;

describe("LoginForm", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockUseLogin.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  it("should match snapshot when initially rendered", () => {
    const { asFragment } = render(renderComponent());
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the login form", () => {
    mockMutate.mockImplementation(
      (data, { onSuccess }) => onSuccess && onSuccess()
    );
    render(renderComponent());
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("btn-login")).toBeInTheDocument();
  });

  it("shows an error message on invalid credentials", async () => {
    mockMutate.mockImplementation(
      (data, { onError }) =>
        onError &&
        onError({ response: { data: { message: "Invalid credentials" } } })
    );
    render(renderComponent());

    findInputAndChangeText("email-input", "admin@aviv-group.com");
    findInputAndChangeText("password-input", "Test@#12345");
    fireEvent.click(screen.getByTestId("btn-login"));

    await waitFor(() => {
      expect(screen.getByTestId("login-error-message")).toHaveTextContent(
        "Invalid credentials"
      );
    });
  });

  it("does not show an error message on successful login", async () => {
    mockMutate.mockImplementation(
      (data, { onSuccess }) => onSuccess && onSuccess()
    );
    render(renderComponent());

    findInputAndChangeText("email-input", "admin@aviv-group.com");
    findInputAndChangeText("password-input", "Test@#12345");
    fireEvent.click(screen.getByTestId("btn-login"));

    await waitFor(() => {
      expect(screen.queryByTestId("login-error-message")).toBeNull();
    });
  });
});

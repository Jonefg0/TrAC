import "@testing-library/jest-dom/extend-expect";

import React from "react";
import waitForExpect from "wait-for-expect";

import { MockedProvider } from "@apollo/react-testing";
import { act, cleanup, render } from "@testing-library/react";

import { UserType } from "../client/constants";
import { baseConfig } from "../client/constants/baseConfig";
import { baseUserConfig } from "../client/constants/userConfig";
import AdminPage from "../src/pages/admin";
import LoginPage from "../src/pages/login";
import UnlockPage from "../src/pages/unlock/[email]/[unlockKey]";
import { AllUsersAdminDocument, CurrentUserDocument } from "../src/graphql";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

afterEach(async () => {
  await cleanup();
});

describe("unlock", () => {
  test("renders correctly", async () => {
    await act(async () => {
      const { getByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: CurrentUserDocument,
              },
              result: {
                data: {
                  currentUser: {
                    user: null,
                  },
                },
              },
            },
          ]}
          addTypename={false}
        >
          <UnlockPage email="asd@gmail.com" unlockKey="asd" />
        </MockedProvider>
      );

      await waitForExpect(async () => {
        const NewPasswordFieldLabel = getByText(
          baseConfig.UNLOCK_NEW_PASSWORD_LABEL
        );

        expect(NewPasswordFieldLabel).toBeTruthy();
      });
    });
  });
});

describe("login", () => {
  test("renders correctly", async () => {
    await act(async () => {
      const { getByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: CurrentUserDocument,
              },
              result: {
                data: {
                  currentUser: {
                    user: null,
                  },
                },
              },
            },
          ]}
          addTypename={false}
        >
          <LoginPage />
        </MockedProvider>
      );

      await waitForExpect(async () => {
        const LoginButton = getByText(baseConfig.LOGIN_BUTTON);

        expect(LoginButton).toBeTruthy();
        expect(LoginButton).toHaveAttribute("disabled");
      });
    });
  });
});

describe("admin", () => {
  test("renders correctly", async () => {
    await act(async () => {
      const { getByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: CurrentUserDocument,
              },
              result: {
                data: {
                  currentUser: {
                    user: {
                      email: "asd@gmail.com",
                      name: "name",
                      admin: true,
                      type: UserType.Director,
                      config: baseUserConfig,
                      student_id: "",
                      __typename: "User",
                    },
                    __typename: "AuthResult",
                  },
                },
              },
            },
            {
              request: {
                query: AllUsersAdminDocument,
              },
              result: {
                data: {
                  users: [],
                },
              },
            },
          ]}
          addTypename={true}
        >
          <AdminPage />
        </MockedProvider>
      );

      await waitForExpect(async () => {
        const UsersMenu = getByText("Users");

        expect(UsersMenu).toBeTruthy();
        expect(UsersMenu).toHaveClass("active");
      });
    });
  });
});

export {};

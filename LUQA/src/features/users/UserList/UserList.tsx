import { Box } from "@gemini/core";
import { Button } from "@gemini/ui";
import React from "react";

import { useCurrentUser } from "../../auth/hooks/useCurrentUser";
import { useUserList } from "./hooks/useUserList";

export const UserList = () => {
  const { assignUserId, data, handleAssignAuthor, isLoadingList } =
    useUserList();
  const { isAdmin } = useCurrentUser();

  if (isLoadingList) {
    return (
      <Box textAlign="center" padding="spacing.32">
        Loading...
      </Box>
    );
  }
  if (!data.length) {
    return (
      <Box textAlign="center" padding="spacing.32">
        No data
      </Box>
    );
  }
  return (
    <Box overflowX="auto" paddingVertical="spacing.20">
      <Box as="table" width="100%" textAlign="left">
        <Box as="thead" typography="typography.body.14.bold">
          <Box as="tr">
            <Box as="th" scope="col" padding="spacing.12">
              Name
            </Box>
            <Box as="th" scope="col" padding="spacing.12">
              Email
            </Box>
            <Box as="th" scope="col" padding="spacing.12">
              Roles
            </Box>
            <Box />
          </Box>
        </Box>
        <Box as="tbody">
          {data.map((user, index) => {
            const roles = user.roles
              ?.map((userRole) => userRole.role.name)
              .join(", ");
            const isAuthor = user.roles?.some(
              (userRole) => userRole.role.name === "author"
            );
            return (
              <Box
                as="tr"
                key={user.id}
                borderBottomColor="color.background.light"
                borderBottomWidth="borderWidth.1"
                backgroundColor={
                  index % 2 === 0
                    ? "color.background.subdued"
                    : "color.background.constant.white"
                }
              >
                <Box
                  as="td"
                  scope="row"
                  padding="spacing.12"
                  whiteSpace="nowrap"
                >
                  {user.firstName} {user.lastName}
                </Box>
                <Box
                  as="td"
                  scope="row"
                  padding="spacing.12"
                  whiteSpace="nowrap"
                >
                  {user.email}
                </Box>
                <Box
                  as="td"
                  scope="row"
                  padding="spacing.12"
                  whiteSpace="nowrap"
                >
                  {roles}
                </Box>
                <Box
                  as="td"
                  scope="row"
                  padding="spacing.12"
                  maxWidth="sizing.60"
                >
                  {isAdmin && !isAuthor && (
                    <Button size="32" onPress={handleAssignAuthor(user.id)}>
                      {assignUserId === user.id ? "..." : "Assign author "}
                    </Button>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

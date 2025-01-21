import { Box } from "@gemini/core";
import { AVIVLogo } from "@gemini/logos";
import { Button } from "@gemini/ui";
import React from "react";
import { Link } from "react-router-dom";

import { useCurrentUser } from "../../features/auth/hooks/useCurrentUser";
import { useLogout } from "../../features/auth/hooks/useLogout";

export const Header: React.FC = () => {
  const { mutate: logout, isPending } = useLogout(); // Use isPending for v5
  const { currentUser, isAdmin } = useCurrentUser();

  const handleLogout = () => {
    logout(undefined); // Pass undefined explicitly
  };

  const renderLogoutButton = () => {
    if (currentUser) {
      return (
        <Button
          testId="btn-logout"
          marginLeft="spacing.12"
          onPress={handleLogout}
          variant="secondary"
        >
          {isPending ? "..." : "Logout"}
        </Button>
      );
    }
    return null;
  };

  return (
    <Box
      as="header"
      backgroundColor="color.background.constant.white"
      boxShadow="shadow.4"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginHorizontal="auto"
        maxWidth={{
          "breakpoint.base": "100%",
          "breakpoint.lg": "1340px",
          "breakpoint.xl": "1640px",
        }}
        paddingVertical="spacing.16"
        paddingHorizontal="spacing.16"
      >
        <Link to="/">
          <AVIVLogo size="sizing.32" variant="colored" />
        </Link>

        <Box as="nav">
          <Box as="ul" display="flex" gap="spacing.24">
            <Box as="li" typography="typography.body.14.bold">
              <Link to="/movies">Movies</Link>
            </Box>
            {isAdmin && (
              <Box as="li" typography="typography.body.14.bold">
                <Link to="/users">Users</Link>
              </Box>
            )}
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Box display="flex" alignItems="center" marginLeft="spacing.32">
            <Box
              backgroundColor="color.background.subdued"
              paddingVertical="spacing.6"
              paddingHorizontal="spacing.12"
              borderRadius="radius.8"
              typography="typography.body.14.bold"
            >
              {currentUser?.firstName}{" "}
            </Box>
            {renderLogoutButton()}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

import { Box } from "@gemini/core";
import { EllipsisVerticalIcon } from "@gemini/icons";
import { CardProps, ProgressCircle, ProgressCircleProps } from "@gemini/ui";
import React from "react";

import { SkeletonWrapper } from "../../../../common/components/SkeletonWrapper/SkeletonWrapper";

export interface PerformanceCardProps extends CardProps {
  time: string;
  productionStatus: string;
  ca: number;
  eval: number;
  progressValue: number; // Value for the ProgressCircle
  progressMaxValue?: number; // Max value for the ProgressCircle
  progressType?: ProgressCircleProps["type"]; // Type of ProgressCircle (percentage, stepper, hidden)
  progressVariant?: ProgressCircleProps["variant"]; // Variant of ProgressCircle
  progressSize?: ProgressCircleProps["size"]; // Size of ProgressCircle
  borderRadius: "4" | "8" | "16"; // Border radius of the card
  hasPadding?: boolean; // Padding inside the card
  isLoading: boolean;
}

export const PerformanceCard = ({
  progressValue,
  progressMaxValue = 100,
  progressType = "percentage",
  progressVariant = "default",
  progressSize = "64",
  isLoading,
}: PerformanceCardProps) => {
  return (
    <SkeletonWrapper isLoading={isLoading}>
      <Box
        maxWidth="sizing.320"
        minWidth="sizing.320"
        marginTop="spacing.12"
        borderRadius="radius.16"
        borderColor="color.border.light.default"
        borderWidth="borderWidth.1"
        borderStyle="solid"
        padding="spacing.16"
      >
        <Box
          as="div"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box typography="typography.body.16.bold">Performance</Box>
          <EllipsisVerticalIcon />
        </Box>
        <Box
          as="div"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginTop="spacing.12"
        >
          <Box>
            <Box
              as="div"
              display="flex"
              flexDirection="row"
              alignItems="center"
              paddingTop="spacing.8"
              paddingBottom="spacing.8"
            >
              <Box typography="typography.body.14.regular">Prod</Box>
              <Box
                typography="typography.body.14.bold"
                paddingLeft="spacing.12"
                paddingRight="spacing.12"
              >
                4:17
              </Box>
              <Box
                height="sizing.10"
                width="sizing.10"
                backgroundColor="color.border.active.default"
                borderRadius="radius.16"
              />
            </Box>

            <Box
              as="div"
              display="flex"
              flexDirection="row"
              alignItems="center"
              paddingTop="spacing.8"
              paddingBottom="spacing.8"
            >
              <Box typography="typography.body.14.regular">EVAL</Box>
              <Box
                typography="typography.body.14.bold"
                paddingLeft="spacing.12"
                paddingRight="spacing.12"
              >
                3
              </Box>
              <Box
                height="sizing.10"
                width="sizing.10"
                backgroundColor="color.border.active.default"
                borderRadius="radius.16"
              />
            </Box>
            <Box
              as="div"
              display="flex"
              flexDirection="row"
              alignItems="center"
              paddingTop="spacing.8"
              paddingBottom="spacing.8"
            >
              <Box typography="typography.body.14.regular">CA</Box>
              <Box
                typography="typography.body.14.bold"
                paddingLeft="spacing.12"
                paddingRight="spacing.12"
              >
                2
              </Box>
              <Box
                height="sizing.10"
                width="sizing.10"
                backgroundColor="color.border.active.default"
                borderRadius="radius.16"
              />
            </Box>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <ProgressCircle
              value={progressValue}
              maxValue={progressMaxValue}
              type={progressType}
              variant={progressVariant}
              size={progressSize}
              aria-label="Performance progress"
            />
          </Box>
        </Box>
      </Box>
    </SkeletonWrapper>
  );
};

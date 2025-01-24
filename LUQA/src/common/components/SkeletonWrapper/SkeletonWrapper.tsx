import { Skeleton, SkeletonProps } from "@gemini/ui";
import React from "react";
import { ReactNode } from "react";

type SkeletonWrapperProps = SkeletonProps & {
  /**
   * Controls whether the skeleton is displayed.
   */
  isLoading: boolean;
  /**
   * The content to be displayed inside the skeleton.
   */
  children: ReactNode;
};

export const SkeletonWrapper = ({
  isLoading,
  children,
  ...restProps // Pass the rest of the props to Skeleton
}: SkeletonWrapperProps) => {
  if (isLoading) {
    // If loading, wrap children with Skeleton and pass restProps
    return <Skeleton {...restProps}>{children}</Skeleton>;
  }

  // If not loading, render children directly
  return <>{children}</>;
};

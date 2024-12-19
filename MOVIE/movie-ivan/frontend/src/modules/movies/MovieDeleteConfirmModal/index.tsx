import { Box } from '@gemini/core';
import { Modal } from '@gemini/ui';
import React, { forwardRef } from 'react';

import { useHook } from './hook';
import { Props } from './types';

export const MovieDeleteConfirmModal = forwardRef(({ refetch }: Props, ref) => {
  const { handleMovieDeleteCancel, handleMovieDeleteConfirm, isLoading, movieDelete, isOpen, toggleModal } = useHook({
    ref,
    refetch,
  });

  const renderTrigger = () => <></>;

  return (
    <Modal
      footerEndButtonProps={{
        children: 'Confirm',
        testId: 'movie-delete-confirm-btn',
        isLoading: false,
        onPress: handleMovieDeleteConfirm,
      }}
      footerStartButtonProps={{
        children: 'Cancel',
        isLoading,
        onPress: handleMovieDeleteCancel,
      }}
      isOpen={isOpen}
      title="Delete movie"
      trigger={renderTrigger}
      onOpenChange={() => {
        toggleModal();
      }}
    >
      <Box as="p">
        Are you sure you want to delete <strong>"{movieDelete?.title}"?</strong>
      </Box>
    </Modal>
  );
});

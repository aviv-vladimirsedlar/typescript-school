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
        isLoading: false,
        onPress: handleMovieDeleteConfirm,
      }}
      footerStartButtonProps={{
        children: 'Cancel',
        isLoading,
        onPress: handleMovieDeleteCancel,
      }}
      isOpen={isOpen}
      testId="filter-leads-modal"
      title="Delete movie"
      trigger={renderTrigger}
      onOpenChange={() => {
        toggleModal();
      }}
    >
      {/* {renderForm()} */}
      <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
        Are you sure you want to delete <strong>"{movieDelete?.title}"?</strong>
      </h3>
    </Modal>
  );
});

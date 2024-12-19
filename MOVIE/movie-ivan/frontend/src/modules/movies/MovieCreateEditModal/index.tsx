import { Box } from '@gemini/core';
import { Button, Modal, TextArea, TextField } from '@gemini/ui';
import React, { forwardRef } from 'react';

import { useHook } from './hook';
import { Props } from './types';

export const MovieCreateEditModal = forwardRef(function CreateEditComponent({ refetch }: Props, ref) {
  const { errorMessage, formik, handleSubmit, isOpen, movieId, onChange, toggleModal } = useHook({ ref, refetch });

  const renderForm = () => {
    return (
      <Box>
        <Box>
          <TextField
            testId="title-input"
            isDisabled={!!movieId}
            name="title"
            label="Title"
            isOptional={false}
            onChange={onChange('title')}
            error={formik.errors.title}
            value={formik.values.title}
          />
        </Box>
        <Box marginTop="spacing.8">
          <TextField
            testId="duration-input"
            name="duration"
            label="Duration"
            isOptional={false}
            onChange={onChange('duration')}
            error={formik.errors.duration}
            value={formik.values.duration}
          />
        </Box>
        <Box marginTop="spacing.8">
          <TextField
            testId="year-input"
            name="year"
            label="Year"
            isOptional={false}
            onChange={onChange('year')}
            error={formik.errors.year}
            value={formik.values.year}
          />
        </Box>
        <Box marginTop="spacing.8">
          <TextArea
            testId="description-input"
            label="Description"
            name="description"
            onChange={onChange('description')}
            value={formik.values.description}
          />
        </Box>

        {!!errorMessage && (
          <Box
            display="flex"
            gap="spacing.20"
            backgroundColor="color.border.status.error.default"
            marginTop="spacing.16"
            typography="typography.body.14.bold"
            color="color.content.constant.white"
            textAlign="left"
            padding="spacing.12"
            paddingLeft="spacing.16"
            zIndex="zIndex.4"
          >
            {errorMessage}
          </Box>
        )}
      </Box>
    );
  };

  const renderTrigger = () => (
    <Button
      marginTop="spacing.24"
      testId="movie-create-edit-modal-trigger"
      onPress={toggleModal}
      type="button"
      size="48"
    >
      Create movie
    </Button>
  );

  return (
    <Modal
      footerEndButtonProps={{
        children: 'Save',
        form: 'filter-form',
        isDisabled: !formik.values.title || !formik.values.duration || !formik.values.year,
        isLoading: false,
        testId: 'create-edit-movie-confirm-btn',
        onPress: handleSubmit,
      }}
      footerStartButtonProps={{
        children: 'Cancel',
        form: 'filter-form',
        isLoading: false,
        testId: 'create-edit-movie-cancel-btn',
        onPress: toggleModal,
      }}
      isOpen={isOpen}
      testId="filter-leads-modal"
      title={movieId ? 'Edit movie' : 'Create movie'}
      trigger={renderTrigger}
      onOpenChange={() => {
        toggleModal();
      }}
    >
      {renderForm()}
    </Modal>
  );
});

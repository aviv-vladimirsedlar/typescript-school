import React, { forwardRef } from 'react';

import Button from '../../../common/components/Button';
import Input from '../../../common/components/Input';

import { useHook } from './hook';
import { Props } from './types';

export const MovieCreateEditModal = forwardRef(function CreateEditComponent({ refetch }: Props, ref) {
  const { errorMessage, formik, handleClose, modalRef, movieId, onChange } = useHook({ ref, refetch });

  return (
    <div
      data-testidid="movie-create-edit-modal"
      id="movie-create-edit-modal"
      ref={modalRef as React.RefObject<HTMLDivElement>}
      className="fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0"
    >
      <div className="relative max-h-full w-full max-w-md p-4">
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700 md:min-w-[600px]">
          <button
            type="button"
            className="absolute end-2.5 top-3 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={handleClose}
          >
            <svg
              className="h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-4 text-left md:p-5">
            <h3 className="mb-5 text-lg font-bold">{movieId ? 'Edit movie' : 'Create movie'}</h3>

            <div className="text-left">
              <Input
                data-testid="title-input"
                label="Title"
                name="title"
                onChange={onChange('title')}
                required
                value={formik.values.title}
              />
              <Input
                data-testid="duration-input"
                label="Duration"
                name="duration"
                onChange={onChange('duration')}
                required
                type="number"
                value={formik.values.duration}
              />
              <Input
                data-testid="year-input"
                label="Year"
                name="year"
                onChange={onChange('year')}
                required
                type="number"
                value={formik.values.year}
              />
              <Input
                data-testid="description-input"
                label="Description"
                name="description"
                onChange={onChange('description')}
                required
                value={formik.values.description}
              />
              {!!errorMessage && (
                <div className="my-4 rounded-lg border border-red-300 bg-red-100/50 p-4 py-2 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button data-testid="create-edit-movie-cancel-btn" className="bg-red-500 py-2" onClick={handleClose}>
                Cancel
              </Button>
              <Button data-testid="create-edit-movie-confirm-btn" className="py-2" onClick={formik.handleSubmit}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

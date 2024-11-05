import { Modal } from 'flowbite';
import { useFormik } from 'formik';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as Yup from 'yup';

import Button from '../../../common/components/Button';
import Input from '../../../common/components/Input';
import { useMovieCreate } from '../../../common/hooks/useMovieCreate';
import { useMovieUpdate } from '../../../common/hooks/useMovieUpdate';
import { Movie } from '../../../common/types/movie.types';

interface FormFields {
  title: string;
  description: string;
  duration: string;
  year: string;
}

const initialValues: FormFields = {
  title: '',
  description: '',
  duration: '',
  year: '',
};

const ValidationSchema = Yup.object().shape({
  duration: Yup.string().required('Duration is required'),
  description: Yup.string().optional(),
  title: Yup.string().required('Title is required'),
  year: Yup.string().required('Year is required'),
});

interface Props {
  refetch: () => void;
}

export const MovieCreateEditModal = forwardRef(function CreateEditComponent({ refetch }: Props, ref) {
  const modalRef = useRef<Modal | null>(null);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [movieId, setMovieId] = useState<string>('');

  const handleSuccessCreate = () => {
    refetch();
    modalRef?.current?.hide();
  };

  const { mutate: createMovie } = useMovieCreate();
  const { mutate: updateMovie } = useMovieUpdate();

  const handleSubmit = async () => {
    const { values } = formik;

    const mutate = movieId ? updateMovie : createMovie;
    await mutate(
      { movieId, data: { ...values, year: parseInt(values.year), duration: parseInt(values.duration) } },
      {
        onSuccess: handleSuccessCreate,
        onError: (error: unknown) => {
          const typedError = error as Error & { response: { data: { message: string } } };
          if (typedError?.response?.data) {
            setErrorMessage(typedError.response.data.message);
          } else {
            setErrorMessage('An unknown error occurred');
          }
        },
      },
    );
  };

  const formik = useFormik({
    initialValues,
    validationSchema: ValidationSchema,
    onSubmit: handleSubmit,
  });

  const onChange = (field: keyof FormFields) => (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue(field, event.target.value);
  };

  const handleOpen = (movie?: Movie) => {
    if (movie) {
      formik.setValues({
        title: movie.title,
        description: movie.description || '',
        duration: movie.duration.toString(),
        year: movie.year.toString(),
      });
      setMovieId(movie.id);
    }
    modalRef?.current?.show();
  };

  const handleClose = () => {
    modalRef?.current?.hide();
  };

  useEffect(() => {
    const element = document.getElementById('movie-create-edit-modal');
    const modal = new Modal(element, {}, {});
    modalRef.current = modal;
  }, []);

  useImperativeHandle(ref, () => ({ open: handleOpen, close: handleClose }), []);

  return (
    <div
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
              <Input label="Title" name="title" onChange={onChange('title')} required value={formik.values.title} />
              <Input
                label="Duration"
                name="duration"
                onChange={onChange('duration')}
                required
                type="number"
                value={formik.values.duration}
              />
              <Input
                label="Year"
                name="year"
                onChange={onChange('year')}
                required
                type="number"
                value={formik.values.year}
              />
              <Input
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
              <Button className="bg-red-500 py-2" onClick={handleClose}>
                Cancel
              </Button>
              <Button className="py-2" onClick={formik.handleSubmit}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

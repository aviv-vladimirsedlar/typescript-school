import { Modal } from 'flowbite';
import { useFormik } from 'formik';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as Yup from 'yup';

import { useMovieCreate } from '../../../common/hooks/useMovieCreate';
import { useMovieUpdate } from '../../../common/hooks/useMovieUpdate';
import { Movie } from '../../../common/types/movie.types';

import { FormFields, Props } from './types';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useHook = ({ ref, refetch }: Props & { ref: any }) => {
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

  const handleOpen = React.useCallback(
    (movie?: Movie) => {
      if (movie) {
        formik.setValues({
          title: movie.title,
          description: movie.description || '',
          duration: movie.duration.toString(),
          year: movie.year.toString(),
        });
        setMovieId(movie.id);
      } else {
        formik.setValues(initialValues);
        setMovieId('');
      }
      modalRef?.current?.show();
    },
    [formik, setMovieId],
  );

  const handleClose = () => {
    modalRef?.current?.hide();
  };

  useEffect(() => {
    const element = document.getElementById('movie-create-edit-modal');
    const modal = new Modal(element, {}, {});
    modalRef.current = modal;
  }, []);

  useImperativeHandle(ref, () => ({ open: handleOpen, close: handleClose }), [handleOpen]);

  return { errorMessage, formik, handleClose, modalRef, movieId, onChange };
};

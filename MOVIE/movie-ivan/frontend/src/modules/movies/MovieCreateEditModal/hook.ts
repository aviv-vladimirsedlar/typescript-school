import { useFormik } from 'formik';
import React, { useCallback, useImperativeHandle, useState } from 'react';
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
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [movieId, setMovieId] = useState<string>('');
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSuccessCreate = async () => {
    await refetch();
    toggleModal();
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

  const toggleModal = useCallback(() => {
    if (isOpen) {
      formik.resetForm();
      setMovieId('');
    }
    setIsOpen((prev) => !prev);
  }, [formik, isOpen]);

  const onChange = (field: keyof FormFields) => (value: string) => {
    formik.setFieldValue(field, value);
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
      toggleModal();
    },
    [formik, setMovieId, toggleModal],
  );

  const handleClose = useCallback(() => {
    formik.resetForm();
    setMovieId('');
    ref?.current?.hide();
  }, [formik, ref]);

  useImperativeHandle(ref, () => ({ open: handleOpen, close: handleClose }), [handleOpen, handleClose]);

  return { errorMessage, formik, handleClose, handleSubmit, isOpen, movieId, onChange, toggleModal };
};

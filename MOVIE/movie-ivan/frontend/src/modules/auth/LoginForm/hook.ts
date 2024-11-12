import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';

import { useLogin } from '../../../common/hooks/useLogin';

import { FormFields } from './types';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const initialValues: FormFields = {
  email: 'admin@aviv-group.com',
  password: 'Test@#12345',
};

export const useHook = () => {
  const { mutate: login, isLoading } = useLogin();

  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async () => {
    const { values } = formik;
    await login(
      { email: values.email, password: values.password },
      {
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
    validationSchema: LoginSchema,
    onSubmit: handleSubmit,
  });

  const onChange = (field: keyof FormFields) => (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue(field, event.target.value);
  };

  return { errorMessage, formik, isLoading, onChange };
};

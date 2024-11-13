import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';

import { useRegister } from '../../../common/hooks/useRegister';

import { FormFields } from './types';

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  passwordConfirm: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const initialValues: FormFields = {
  email: '',
  password: '',
  passwordConfirm: '',
  firstName: '',
  lastName: '',
};

export const useHook = () => {
  const { mutate: register, isLoading } = useRegister();

  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async () => {
    const errors = await formik.validateForm();
    if (!Object.keys(errors).length) {
      const { values } = formik;
      await register(
        { email: values.email, firstName: values.firstName, lastName: values.lastName, password: values.password },
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
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: RegisterSchema,
    onSubmit: handleSubmit,
  });

  const onChange = (field: keyof FormFields) => (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue(field, event.target.value);
  };

  return { errorMessage, formik, isLoading, onChange };
};

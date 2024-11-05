import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';

import Button from '../../../common/components/Button';
import Input from '../../../common/components/Input';
import { useRegister } from '../../../common/hooks/useRegister';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  passwordConfirm: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

interface FormFields {
  email: string;
  password: string;
  passwordConfirm: string;
  firstName: string;
  lastName: string;
}

const initialValues: FormFields = {
  email: 'ivanvukusic-ext@aviv-group.com',
  password: 'Test@#12345',
  passwordConfirm: 'Test@#12345',
  firstName: 'Ivan',
  lastName: '',
};

export const RegisterForm: React.FC = () => {
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
    validationSchema: LoginSchema,
    onSubmit: handleSubmit,
  });

  const onChange = (field: keyof FormFields) => (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue(field, event.target.value);
  };

  return (
    <form className="mx-auto w-full">
      <div className="grid grid-cols-2 gap-4">
        <Input
          error={formik.errors.firstName}
          label="First name"
          name="firstName"
          onChange={onChange('firstName')}
          required
          value={formik.values.firstName}
        />
        <Input
          error={formik.errors.lastName}
          label="Last name"
          name="lastName"
          onChange={onChange('lastName')}
          required
          value={formik.values.lastName}
        />
      </div>
      <Input
        error={formik.errors.email}
        label="Your email"
        name="email"
        onChange={onChange('email')}
        required
        value={formik.values.email}
      />
      <Input
        error={formik.errors.password}
        label="Password"
        name="password"
        onChange={onChange('password')}
        required
        value={formik.values.password}
      />
      <Input
        error={formik.errors.passwordConfirm}
        label="Confirm password"
        name="passwordConfirm"
        onChange={onChange('passwordConfirm')}
        required
        value={formik.values.passwordConfirm}
      />

      <Button className="w-full" onClick={formik.handleSubmit} type="submit">
        {isLoading ? '...' : 'Submit'}
      </Button>

      {!!errorMessage && (
        <div className="mt-4 rounded-lg border border-red-300 bg-red-100/50 p-4 py-2 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
    </form>
  );
};

import { useFormik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import Button from '../../../common/components/Button';
import Input from '../../../common/components/Input';
import { useLogin } from '../../../common/hooks/useLogin';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

interface FormFields {
  email: string;
  password: string;
}

const initialValues: FormFields = {
  email: 'admin@aviv-group.com',
  password: 'Test@#12345',
};

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: login, isLoading } = useLogin();

  const handleSubmit = async (values: { email: string; password: string }) => {
    await login(
      { email: values.email, password: values.password },
      {
        onSuccess: () => {
          navigate('/dashboard');
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

  return (
    <form className="mx-auto w-full max-w-sm">
      <Input label="Your email" name="email" onChange={onChange('email')} required value={formik.values.email} />
      <Input
        label="Your password"
        name="password"
        onChange={onChange('password')}
        required
        type="password"
        value={formik.values.password}
      />

      <Button className="w-full" label={isLoading ? '...' : 'Submit'} onClick={formik.handleSubmit} type="submit" />
    </form>
  );
};

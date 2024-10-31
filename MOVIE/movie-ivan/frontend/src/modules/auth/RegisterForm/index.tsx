import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';

import Button from '../../../common/components/Button';
import Input from '../../../common/components/Input';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

interface FormFields {
  email: string;
  password: string;
  passwordConfirm: string;
  firstName: string;
  lastName: string;
}

const initialValues: FormFields = {
  email: '',
  password: '',
  passwordConfirm: '',
  firstName: '',
  lastName: '',
};

export const RegisterForm: React.FC = () => {
  const handleSubmit = (values: { email: string; password: string }) => {
    console.log('Form Values:', values);
    // Perform login action here
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
          label="First name"
          name="firstName"
          onChange={onChange('firstName')}
          required
          value={formik.values.firstName}
        />
        <Input
          label="Last name"
          name="lastName"
          onChange={onChange('lastName')}
          required
          value={formik.values.lastName}
        />
      </div>
      <Input label="Your email" name="email" onChange={onChange('email')} required value={formik.values.email} />
      <Input label="Password" name="password" onChange={onChange('password')} required value={formik.values.password} />
      <Input
        label="Confirm password"
        name="passwordConfirm"
        onChange={onChange('passwordConfirm')}
        required
        value={formik.values.passwordConfirm}
      />

      <Button className="w-full" label="Submit" onClick={formik.handleSubmit} type="submit" />
    </form>
  );
};

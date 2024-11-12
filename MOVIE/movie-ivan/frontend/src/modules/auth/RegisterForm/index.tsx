import React from 'react';

import Button from '../../../common/components/Button';
import Input from '../../../common/components/Input';

import { useHook } from './hook';

export const RegisterForm: React.FC = () => {
  const { errorMessage, formik, isLoading, onChange } = useHook();

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

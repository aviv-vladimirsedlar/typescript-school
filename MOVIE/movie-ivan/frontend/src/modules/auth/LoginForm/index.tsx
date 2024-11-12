import React from 'react';

import Button from '../../../common/components/Button';
import Input from '../../../common/components/Input';

import { useHook } from './hook';

export const LoginForm: React.FC = () => {
  const { errorMessage, formik, isLoading, onChange } = useHook();

  return (
    <form className="mx-auto w-full max-w-sm">
      <Input
        data-testid="email-input"
        label="Your email"
        name="email"
        onChange={onChange('email')}
        required
        value={formik.values.email}
      />
      <Input
        data-testid="password-input"
        label="Your password"
        name="password"
        onChange={onChange('password')}
        required
        type="password"
        value={formik.values.password}
      />

      <Button data-testid="btn-login" className="w-full" onClick={formik.handleSubmit} type="submit">
        {isLoading ? '...' : 'Submit'}
      </Button>

      {!!errorMessage && (
        <div
          data-testid="login-error-message"
          className="mt-4 rounded-lg border border-red-300 bg-red-100/50 p-4 py-2 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}
    </form>
  );
};

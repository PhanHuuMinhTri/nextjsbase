'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema';
import { Controller, useForm } from 'react-hook-form';
import { FieldGroup, Field, FieldError, FieldLabel, FieldTitle } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import authApiRequest from '@/apiRequests/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { handleErrorApi } from '@/lib/utils';
import { useAppContext } from '@/app/app-provider';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAppContext();
  const router = useRouter();
  const defaultValue: LoginBodyType = {
    email: '',
    password: '',
  };

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: { ...defaultValue },
  });

  const onSubmit = async (values: LoginBodyType) => {
    if (loading) return;
    setLoading(true);

    try {
      const result = await authApiRequest.login(values);
      await authApiRequest.auth({
        sessionToken: result.payload.data.token,
        expiresAt: result.payload.data.expiresAt,
      });
      toast(result.payload.message);
      setUser(result.payload.data.account);
      router.push('/');
      router.refresh();
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="" noValidate>
      <FieldTitle className="mb-10 flex w-full justify-center text-2xl text-center">
        Login
      </FieldTitle>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-email">Email</FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-email"
                aria-invalid={fieldState.invalid}
                placeholder="Input your email...."
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-password">Password</FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-password"
                aria-invalid={fieldState.invalid}
                placeholder="Input your password...."
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit">Submit</Button>
      </FieldGroup>
    </form>
  );
}

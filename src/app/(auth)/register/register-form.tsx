'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterBody, RegisterBodyType } from '@/schemaValidations/auth.schema';
import { Controller, useForm } from 'react-hook-form';
import { FieldGroup, Field, FieldError, FieldLabel, FieldTitle } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import authApiRequest from '@/apiRequests/auth';
import { toast } from 'sonner';
import { useAppContext } from '@/app/app-provider';
import router from 'next/router';
import { handleErrorApi } from '@/lib/utils';

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAppContext();

  const defaultValue: RegisterBodyType = {
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  };

  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: { ...defaultValue },
  });

  const onSubmit = async (values: RegisterBodyType) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await authApiRequest.register(values);

      await authApiRequest.auth({
        sessionToken: result.payload.data.token,
        expiresAt: result.payload.data.expiresAt,
      });
      toast(result.payload.message);
      setUser(result.payload.data.account);

      router.push('/me');
    } catch (error: any) {
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
        Register
      </FieldTitle>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-name">Name</FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-name"
                aria-invalid={fieldState.invalid}
                placeholder="Input your name...."
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

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

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-confirmPassword">Confirm Password</FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-confirmPassword"
                aria-invalid={fieldState.invalid}
                placeholder="Input your confirmPassword...."
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

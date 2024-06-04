'use client';

import { Input, Button } from '@nextui-org/react';
import { useFormState, useFormStatus } from 'react-dom';
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  KeyIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import {
  resetPassword,
  sendRecoveryCode,
  validateOTP,
} from '@/app/lib/actions/auth.actions';
import OTPInput from './otp-input';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Forms() {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [emailState, emailDispatch] = useFormState(sendRecoveryCode, {
    errors: {},
    step: '',
    message: '',
  });

  useEffect(() => {
    if (emailState.step) {
      setStep(emailState.step);
    }
  }, [emailState]);

  return (
    <div>
      {step === 'email' && (
        <>
          <Link href="/login">
            <ArrowLongLeftIcon width={30} className="mb-4" />
          </Link>
          <div className="mb-2 items-center md:flex">
            <EnvelopeIcon width={30} className="mr-2 flex text-primary-500" />
            <h2 className="text-2xl">Correo electrónico</h2>
          </div>
          <p className="mb-6 text-gray-500">
            No te preocupes, te ayudaremos a recuperar tu contraseña, solo
            necesitamos el correo que usas para iniciar sesión.
          </p>
          <form action={emailDispatch}>
            <Input
              label="Email"
              type="email"
              name="email"
              id="email"
              className="mb-4"
              errorMessage="Por favor, ingresa un correo válido"
              isClearable
              isRequired
            />
            <NextButton />
            <div
              className="mt-2 flex gap-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {emailState.errors.email && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-danger-400" />
                  <p className="text-sm text-danger-400">
                    {emailState.errors.email}
                  </p>
                </>
              )}
            </div>
          </form>
        </>
      )}
      {step === 'otp' && (
        <OTPForm userID={emailState.userID} setStep={setStep} />
      )}
      {step === 'password' && <PasswordForm userID={emailState.userID} />}
    </div>
  );
}

function NextButton({ isDisabled }: { isDisabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      color={isDisabled ? 'default' : 'primary'}
      className="relative m-auto w-full"
      size="lg"
      variant="shadow"
      aria-disabled={pending}
      isDisabled={pending || isDisabled}
      isLoading={pending}
    >
      Siguiente
      <ArrowLongRightIcon className="absolute right-4 ml-auto w-6 " />
    </Button>
  );
}

function AcceptButton({ isDisabled }: { isDisabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      color={isDisabled ? 'default' : 'primary'}
      className="relative m-auto w-full"
      size="lg"
      variant="shadow"
      aria-disabled={pending}
      isDisabled={pending || isDisabled}
      isLoading={pending}
    >
      Aceptar
      <ArrowLongRightIcon className="absolute right-4 ml-auto w-6 " />
    </Button>
  );
}

function OTPForm({
  userID,
  setStep,
}: {
  userID?: number;
  setStep: (step: 'email' | 'otp' | 'password') => void;
}) {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const validateOTPWithUser = validateOTP.bind(null, userID || 0);
  const [state, dispatch] = useFormState(validateOTPWithUser, null);

  useEffect(() => {
    if (state?.userID) {
      setStep('password');
    }
  }, [setStep, state]);

  return (
    <>
      <ArrowLongLeftIcon
        width={30}
        className="mb-4"
        role="button"
        onClick={() => {
          setStep('email');
        }}
      />
      <div className="mb-2 items-center md:flex">
        <KeyIcon width={30} className="mr-2 flex text-primary-500" />
        <h2 className="text-2xl">Código de seguridad</h2>
      </div>
      <p className="mb-6 text-gray-500">
        Si el correo ingresado está registrado, recibirás un código de 6 dígitos
        para recuperar tu contraseña.
      </p>
      <form action={dispatch}>
        <fieldset>
          <div className="mb-4 flex w-full gap-2">
            <OTPInput otp={otp} setOtp={setOtp} />
          </div>
        </fieldset>

        <NextButton isDisabled={otp.some((code) => code === '')} />
        <div className="mt-2 flex gap-1" aria-live="polite" aria-atomic="true">
          {state?.errors.otp && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-danger-400" />
              <p className="text-sm text-danger-400">{state.errors.otp}</p>
            </>
          )}
        </div>
      </form>
    </>
  );
}

function PasswordForm({ userID }: { userID?: number }) {
  const resetPassWithUser = resetPassword.bind(null, userID || 0);
  const [state, dispatch] = useFormState(resetPassWithUser, null);

  return (
    <>
      {!state?.done && (
        <>
          <div className="mb-2 items-center md:flex">
            <LockClosedIcon width={30} className="mr-2 flex text-primary-500" />
            <h2 className="text-2xl">Nueva contraseña</h2>
          </div>
          <p className="mb-6 text-gray-500">
            ¡Casi listo! Ingresa tu nueva contraseña para continuar.
          </p>
          <form action={dispatch}>
            <fieldset>
              <div className="mb-4 flex w-full flex-col gap-2">
                <Input
                  label="Contraseña"
                  type="password"
                  name="password"
                  id="password"
                  className="w-full"
                  errorMessage="La contraseña es requerida"
                  isClearable
                  isRequired
                />
                <Input
                  label="Confirmar contraseña"
                  type="password"
                  name="passwordConfirm"
                  id="passwordConfirm"
                  className="w-full"
                  errorMessage="Las contraseñas no coinciden"
                  isClearable
                  isRequired
                />
              </div>
            </fieldset>

            <AcceptButton />
            <div
              className="mt-2 flex gap-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {state?.errors.password && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-danger-400" />
                  <p className="text-sm text-danger-400">
                    {state.errors.password}
                  </p>
                </>
              )}
            </div>
            <div
              className="mt-2 flex gap-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {state?.errors.passwordConfirm && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-danger-400" />
                  <p className="text-sm text-danger-400">
                    {state.errors.passwordConfirm}
                  </p>
                </>
              )}
            </div>
          </form>
        </>
      )}
      {state?.done && (
        <>
          <div className="mb-2 items-center md:flex">
            <CheckCircleIcon
              width={30}
              className="mr-2 flex text-primary-500"
            />
            <h2 className="text-2xl">Contraseña actualizada</h2>
          </div>
          <p className="mb-6 text-gray-500">
            ¡Felicidades! Haz terminado el proceso, hora puedes iniciar sesión
            con tu nueva contraseña.
          </p>
          <Button
            className="relative m-auto"
            href="/login"
            color="primary"
            size="lg"
            variant="shadow"
            as={Link}
            fullWidth
          >
            Iniciar sesión
            <ArrowLongRightIcon className="absolute right-4 ml-auto w-6 " />
          </Button>
        </>
      )}
    </>
  );
}
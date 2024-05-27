import { hasItems } from '../lib/utils';

export function FormErrors({ errors }: { errors: string[] | undefined }) {
  return (
    <>
      {hasItems(errors ?? []) && (
        <p className="mt-1 text-xs text-danger">{errors?.join(', ')}</p>
      )}
    </>
  );
}

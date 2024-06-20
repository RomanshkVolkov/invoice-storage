/**
 * A basic form component. It has aria-describedby set to "form-error" to use with FormError component.
 */

export default function Form({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.HTMLProps<HTMLFormElement>) {
  return (
    <form
      aria-describedby="form-error"
      className="rounded-xl border bg-white px-12 py-8 shadow-xl dark:border-none dark:bg-black dark:shadow-black"
      noValidate
      {...props}
    >
      {children}
    </form>
  );
}

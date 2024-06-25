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
      className="rounded-xl border bg-white p-6 shadow-xl  dark:border-none dark:bg-black dark:shadow-black md:px-10 md:py-8"
      noValidate
      {...props}
    >
      {children}
    </form>
  );
}

/**
 * A legend for a form fieldset.
 */

export default function FormLegend({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
}) {
  const Icon = icon;
  return (
    <>
      <Icon className="mr-2 w-8 text-primary-500" />
      <legend className="text-lg text-primary-500">{children}</legend>
    </>
  );
}

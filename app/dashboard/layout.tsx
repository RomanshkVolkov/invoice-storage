import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout({
  delete: deleteModal,
  children,
}: {
  delete: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none bg-white dark:bg-black md:w-64">
        <SideNav />
      </div>
      <div className="relative flex-grow p-6 md:overflow-y-auto md:p-12">
        {children}
      </div>
      <div>{deleteModal}</div>
    </div>
  );
}

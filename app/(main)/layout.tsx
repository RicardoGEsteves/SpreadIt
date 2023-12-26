import Navbar from "@/components/navigation/navbar";

type MainLayoutProps = {
  children: React.ReactNode;
  authModal?: React.ReactNode;
};

const MainLayout = ({ children, authModal }: MainLayoutProps) => {
  return (
    <>
      <Navbar />

      {authModal}
      <div
        className="container max-w-7xl mx-auto h-full pt-12"
        suppressHydrationWarning
      >
        {children}
      </div>
    </>
  );
};

export default MainLayout;

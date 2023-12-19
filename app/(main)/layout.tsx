import Navbar from "@/components/navigation/navbar";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Navbar />
      <div className="container max-w-7xl mx-auto h-full pt-12">{children}</div>
    </>
  );
};

export default MainLayout;

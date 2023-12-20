import CloseModal from "@/components/close-modal";
import SignIn from "../../(auth)/sign-in/_components/sign-in";

const InterceptSignInPage = () => {
  return (
    <div className="fixed inset-0 bg-foreground/20 z-10">
      <div className="container flex items-center h-full max-w-lg mx-auto">
        <div className="relative bg-background w-full h-fit py-20 px-2 rounded-lg">
          <div className="absolute top-4 right-4">
            <CloseModal />
          </div>

          <SignIn />
        </div>
      </div>
    </div>
  );
};

export default InterceptSignInPage;

import React from "react";
import SignupFlow from "@/components/SignupFlow";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white py-4 md:py-8">
      <div className="container max-w-md px-4 mx-auto">
        <SignupFlow />
      </div>
    </div>
  );
};

export default Index;

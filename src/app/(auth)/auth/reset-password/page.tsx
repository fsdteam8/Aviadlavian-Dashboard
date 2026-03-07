import { Suspense } from "react";
import ResetPasswordForm from "@/features/auth/reset-password/components/reset-password-form";

const page = () => {
  return (
    <div>
      <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default page;

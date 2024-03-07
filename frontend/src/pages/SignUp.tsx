import { Quote } from "../components/Quote";
import { Auth } from "../components/Auth";
import { useEffect } from "react";
export const SignUp = () => {
  useEffect(() => {
    document.title = "Blogify | Sign Up";
  }, []);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div>
        <Auth type="signup" />
      </div>
      <div className="hidden lg:block">
        <Quote />
      </div>
    </div>
  );
};

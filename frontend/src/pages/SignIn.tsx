import { Quote } from "../components/Quote";
import { Auth } from "../components/Auth";
import { useEffect } from "react";
export const SignIn = () => {
  useEffect(() => {
    document.title = "Blogify | Log In";
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div>
        <Auth type="signin" />
      </div>
      <div className="hidden lg:block">
        <Quote />
      </div>
    </div>
  );
};

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Blog } from "./pages/Blog";
import { Blogs } from "./pages/Blogs";
import { CreateBlog } from "./pages/CreateBlog";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/blog/:id" element={<Blog />}></Route>
          <Route path="/user/:id" element={<Blog />}></Route>
          <Route path="/blogs" element={<Blogs />}></Route>
          <Route path="/create" element={<CreateBlog />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

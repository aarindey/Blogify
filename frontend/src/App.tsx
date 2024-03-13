import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Blog } from "./pages/Blog";
import { Blogs } from "./pages/Blogs";
import { CreateBlog } from "./pages/CreateBlog";
import { Topic } from "./pages/Topic";
import { User } from "./pages/User";
import { UpdateBlog } from "./pages/UpdateBlog";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/blog/:id" element={<Blog />}></Route>
          <Route path="/topic/:id" element={<Topic />}></Route>
          <Route path="/user/:id" element={<User />}></Route>
          <Route path="/blogs" element={<Blogs />}></Route>
          <Route path="/create" element={<CreateBlog />}></Route>
          <Route path="/update/:id" element={<UpdateBlog />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

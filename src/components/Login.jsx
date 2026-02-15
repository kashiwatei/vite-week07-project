import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const handleLoginSubmit = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = token;
      // alert("登入成功");
      navigate("/admin/products")
    } catch (error) {
      alert("登入失敗: " + error.response.data.message);
    }
  };

  return (
    <>
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form
                id="form"
                className="form-signin"
                onSubmit={handleSubmit(handleLoginSubmit)}
              >
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    placeholder="name@example.com"
                    {...register("username", {
                      required: "請輸入 Email",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Email 格式不正確",
                      },
                    })}
                  />
                  <label htmlFor="username">Email address</label>
                  {errors.username && (
                    <p className="text-danger">{errors.username.message}</p>
                  )}
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    {...register("password", {
                      required: "請輸入密碼",
                      minLength: {
                        value: 6,
                        message: "密碼長度至少需 6 碼",
                      },
                    })}
                  />
                  <label htmlFor="password">Password</label>
                  {errors.password && (
                    <p className="text-danger">{errors.password.message}</p>
                  )}
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2026~∞ - 六角學院</p>
        </div>
    </>
  );
}

export default Login;

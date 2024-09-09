import React, { useState } from "react";

const LogIn = () => {
  // const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: null,
    password: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogIn = (e) => {
    e.preventDefault();
    setError({ email: null, password: null });
    console.log(form);
    if (form.email.trim() === "") {
      setError((prevError) => ({ ...prevError, email: "email is required" }));
    }
    if (form.password.trim() === "") {
      setError((prevError) => ({ ...prevError, password: "password is required" }));
    }
    //   navigate("/");
  };

  return (
    <>
      <form onSubmit={handleLogIn}>
        <div className="text-black  flex justify-center flex-col items-center">
          <label className="w-1/4 m-3 input input-bordered flex items-center gap-2">
            Email
            <input
              onChange={handleChange}
              value={form.email}
              id="email"
              name="email"
              type="text"
              className="grow"
              placeholder=" user@site.com "
            />
          </label>
          {error.email && <span className="text-red-700  ">email is required </span>}{" "}
          <label className="w-1/4 m-3 input input-bordered flex items-center gap-2">
            Password
            <input
              id="password"
              onChange={handleChange}
              value={form.password}
              name="password"
              type="password"
              className="grow"
              placeholder="Please Enter your password here"
            />
          </label>
          {error.password && <span className="text-red-700  ">password is required </span>}{" "}
          <button className="btn bg-slate-600 text-white hover:bg-slate-400 hover:text-black mt-5">
            Login
          </button>
        </div>
      </form>
      ;
    </>
  );
};

export default LogIn;

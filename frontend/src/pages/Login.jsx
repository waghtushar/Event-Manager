import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      toast.error("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      toast.success("Successfully logged in!");
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-teal-400">
      <div className="bg-white p-8 shadow-xl rounded-lg w-96 max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Welcome Back
        </h2>

        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-gray-600 font-medium mb-2"
            >
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <HiOutlineMail className="text-gray-400 mr-2 w-5 h-5" />
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-gray-600 font-medium mb-2"
            >
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <HiOutlineLockClosed className="text-gray-400 mr-2 w-5 h-5" />
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all focus:outline-none"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="text-center mt-6">
          <span className="text-gray-600">Don't have an account? </span>
          <Link
            to="/register"
            className="text-teal-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

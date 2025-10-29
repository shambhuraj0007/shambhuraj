import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handleError, handleSuccess } from '../utils'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  })

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setLoginInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const { email, password } = loginInfo
    if (!email || !password) {
      return handleError('Email and password are required')
    }
    try {
      const result = await login({ email, password })
      if (result.success) {
        handleSuccess('Login successful')
        navigate('/home')
      }
    } catch (err) {
      handleError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email" 
              type="email"
              name="email"
              autoComplete="email" 
              placeholder="Enter your email..."
              value={loginInfo.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password..."
              value={loginInfo.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Login
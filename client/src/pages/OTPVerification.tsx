import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BACKEND_URL } from '../config'

export default function OTPVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(300) // 5 minutes countdown
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer)
          return 0
        }
        return prevCountdown - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(parseInt(element.value))) return false

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])

    if (element.nextSibling && element.value !== '') {
      (element.nextSibling as HTMLInputElement).focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
  
    const otpValue = otp.join('')
  
    try {
      console.log("reaced to verify otp")
      const response = await axios.post<{ token: string }>(`${BACKEND_URL}/api/v1/user/verify-otp`, { otp: otpValue })
      const token = response.data.token // Now token is typed as string
      console.log(token)
      localStorage.setItem('token', token)
      setSuccess(true)
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error: any) {
        setError('An error occurred during OTP verification. Please try again.')
    }
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-slate-600 via-red-400 to-cyan-500 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gradient-to-br from-teal-500 via-slate-400 via-red-200 to-cyan-500 p-10 rounded-xl shadow-2xl transform transition-all duration-500 ease-in-out hover:scale-105">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a code to your email. Please enter it below.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                className="w-12 h-12 border-2 rounded-lg text-center text-2xl font-bold text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300"
              />
            ))}
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105"
              disabled={countdown === 0}
            >
              Verify OTP
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> OTP verified successfully. Redirecting to dashboard...</span>
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Time remaining: <span className="font-bold text-indigo-600">{formatTime(countdown)}</span>
          </p>
        </div>

        <div className="mt-4 text-center">
          <button 
            className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
            onClick={() => {/* Implement resend OTP logic here */}}
          >
            Didn't receive the code? Resend
          </button>
        </div>
      </div>
    </div>
  )
}
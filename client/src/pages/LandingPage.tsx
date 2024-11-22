import { ArrowRight, Lock, Shield, Smartphone } from 'lucide-react'
import Topbar from '../components/Topbar'
import HoverComp from '../components/HoverComp'

export default function LandingPage({children}: {children : React.ReactNode}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-slate-400 via-black-200 to-cyan-500 opacity-90">
      <header className="container mx-auto py-2">
        <Topbar/>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div>
          <div>
            {children}
            {/* <HoverComp></HoverComp> */}
          </div>
        </div>
        <section>
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-teal-800 mb-4">Secure Your Digital Life</h1>
          <p className="text-xl text-teal-600 mb-8">Store, manage, and protect your files with military-grade encryption</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button  className="border-teal-600 text-teal-600 hover:bg-teal-50">Learn More</button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="relative bg-white p-6 rounded-lg shadow-md">
            <Lock className="h-16 text-teal-600 mb-4 mx-24 w-1/2" />
            <h2 className="text-xl font-semibold text-teal-800 mb-2 mx-32 w-1/2">Secure Storage</h2>
            <p className="absolute rounded-lg shadow-md inset-0 bg-white bg-opacity-100 text-teal-600 text-2xl flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 p-4">
            Your files are encrypted and stored securely in our state-of-the-art data centers.
            </p>
          </div>
          <div className="relative bg-white p-6 rounded-lg shadow-md">
            <Shield className="h-16 text-teal-600 mb-4 mx-24 w-1/2" />
            <h2 className="text-xl font-semibold text-teal-800 mb-2 mx-36 w-1/2">Privacy First</h2>
            <p className="absolute rounded-lg shadow-md inset-0 bg-white bg-opacity-100 text-teal-600 text-2xl flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 p-4">
            We prioritize your privacy with end-to-end encryption and zero-knowledge architecture.
            </p>
          </div>
          <div className="relative bg-white p-6 rounded-lg shadow-md">
            <Smartphone className="h-16 text-teal-600 mb-4 mx-24 w-1/2" />
            <h2 className="text-xl font-semibold text-teal-800 mb-2 mx-32 w-1/2">Access Anywhere</h2>
            <p className="absolute rounded-lg shadow-md inset-0 bg-white bg-opacity-100 text-teal-600 text-2xl flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 p-4">
            Access your files from any device, anytime, with our user-friendly mobile and web apps.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-teal-800 mb-4 text-center">Join SecureVault Today</h2>
          <p className="text-teal-600 mb-6 text-center">Sign up for our newsletter and be the first to know about our launch!</p>
          <form className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="max-w-sm border-teal-300 focus:border-teal-500 focus:ring-teal-500 p-1"
            />
            <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg p-1">
              Subscribe
            </button>
          </form>
        </div>  
        </section>
      </main>

      <footer className="bg-teal-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 SecureVault. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <a href="#" className="text-teal-200 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-teal-200 hover:text-white">Terms of Service</a>
            <a href="#" className="text-teal-200 hover:text-white">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
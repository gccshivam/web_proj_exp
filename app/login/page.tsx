"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "../contexts/AuthContext"
import type React from "react"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")
  const [isLoading, setIsLoading] = useState(false)
  const { login, signup } = useAuth()
  const router = useRouter()

  useEffect(() => {
    gsap.from(".login-content", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.2,
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (isLogin) {
        await login(username, password)
        // For login, route based on role from auth context or user data
        // You might need to get the user's role from your auth context
        if (role === "doctor") {
          router.push("/dashboard/doctor")  // Doctor dashboard
        } else {
          router.push("/dashboard/patient") // Patient dashboard
        }
      } else {
        await signup(username, password, role)
        // For signup, route based on selected role
        if (role === "doctor") {
          router.push("/dashboard/doctor")  // Doctor dashboard
        } else {
          router.push("/dashboard/patient") // Patient dashboard
        }
      }
    } catch (error) {
      console.error("Authentication error:", error)
      // Handle error here (maybe show an error message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-white">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="login-content text-2xl font-bold text-center mb-6">
          {isLogin ? "Login to HealthBuddy" : "Sign Up for HealthBuddy"}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="login-content">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="login-content">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {!isLogin && (
            <div className="login-content">
              <Label>Register as</Label>
              <RadioGroup value={role} onValueChange={setRole}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user">User</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="doctor" id="doctor" />
                  <Label htmlFor="doctor">Doctor</Label>
                </div>
              </RadioGroup>
            </div>
          )}
          <Button 
            className="login-content w-full" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              isLogin ? "Login" : "Sign Up"
            )}
          </Button>
        </form>
        <p className="login-content text-center mt-4">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            className="text-sky-600 hover:underline" 
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  )
}

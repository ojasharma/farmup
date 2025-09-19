// LoginPage.tsx

"use client"

import { useState } from "react"
// ✅ 1. Import useRouter from next/navigation
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, Phone, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [language, setLanguage] = useState("en")
  const [isLoading, setIsLoading] = useState(false)
  
  // ✅ 2. Initialize the router
  const router = useRouter()

  const handleSendOTP = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setStep("otp")
    setIsLoading(false)
  }

  const handleVerifyOTP = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // ✅ 3. Use router.push() for a smooth, client-side redirect
    router.push("/welcome")
  }

  const languages = [
    { value: "en", label: "English" },
    { value: "hi", label: "हिंदी" },
    { value: "or", label: "ଓଡ଼ିଆ" },
    { value: "pa", label: "ਪੰਜਾਬੀ" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-lime-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-green-600 rounded-full p-4 shadow-lg shadow-green-500/20">
              <Leaf className="h-10 w-10 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-green-900">Welcome to FarmUP</h1>
            <p className="text-green-700/90">Your smart farming companion</p>
          </div>
        </div>

        {/* Login & Language Cards */}
        <Card className="bg-white/60 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg">
          <CardContent className="pt-6 space-y-6">
            {/* Language Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-green-900/80">Choose your language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-white/80 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Separator */}
            <div className="border-t border-green-200/80"></div>

            {/* Phone Number Input */}
            {step === "phone" ? (
              <div className="space-y-4">
                <div className="space-y-2 text-center">
                  <h3 className="font-semibold text-lg text-green-900">Get Started</h3>
                  <p className="text-sm text-green-800/80">Enter your phone number to continue</p>
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-base pl-10 py-6 bg-white/50 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <Button onClick={handleSendOTP} disabled={!phoneNumber || isLoading} className="w-full py-6 text-base font-bold bg-green-600 hover:bg-green-700 text-white">
                  {isLoading ? "Sending OTP..." : "Send Verification Code"}
                </Button>
              </div>
            ) : (
              // OTP Verification
              <div className="space-y-4">
                 <div className="space-y-2 text-center">
                  <h3 className="font-semibold text-lg text-green-900">Verify Your Number</h3>
                  <p className="text-sm text-green-800/80">Enter the 6-digit code sent to <strong>{phoneNumber}</strong></p>
                </div>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="______"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="text-2xl text-center tracking-[0.5em] font-mono py-6 bg-white/50 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    maxLength={6}
                  />
                </div>
                <Button onClick={handleVerifyOTP} disabled={otp.length !== 6 || isLoading} className="w-full py-6 text-base font-bold bg-green-600 hover:bg-green-700 text-white group">
                  {isLoading ? "Verifying..." : "Verify & Continue"}
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
                 <div className="flex justify-between items-center text-sm">
                   <Button variant="ghost" onClick={() => setStep("phone")} className="text-green-700 hover:text-green-900">
                    Back
                  </Button>
                   <Button variant="link" onClick={handleSendOTP} className="text-green-700 hover:text-green-900" disabled={isLoading}>
                    Resend Code
                  </Button>
                 </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-green-800/60 px-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
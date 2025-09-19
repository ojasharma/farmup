"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, Phone, MessageSquare } from "lucide-react"

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [language, setLanguage] = useState("en")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendOTP = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStep("otp")
    setIsLoading(false)
  }

  const handleVerifyOTP = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // Redirect to welcome or dashboard
    window.location.href = "/welcome"
    setIsLoading(false)
  }

  const languages = [
    { value: "en", label: "English" },
    { value: "hi", label: "हिंदी" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary rounded-full p-3">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-balance">Welcome to FarmUP</h1>
            <p className="text-muted-foreground text-pretty">Your smart farming companion for better harvests</p>
          </div>
        </div>

        {/* Language Selector */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Choose your language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
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
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === "phone" ? (
                <>
                  <Phone className="h-5 w-5" />
                  Enter your phone number
                </>
              ) : (
                <>
                  <MessageSquare className="h-5 w-5" />
                  Verify OTP
                </>
              )}
            </CardTitle>
            <CardDescription>
              {step === "phone"
                ? "We'll send you a verification code to get started"
                : `Enter the 6-digit code sent to ${phoneNumber}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === "phone" ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <Button onClick={handleSendOTP} disabled={!phoneNumber || isLoading} className="w-full" size="lg">
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Verification Code</label>
                  <Input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="text-lg text-center tracking-widest"
                    maxLength={6}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("phone")} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleVerifyOTP} disabled={otp.length !== 6 || isLoading} className="flex-1">
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                  </Button>
                </div>
                <Button variant="ghost" onClick={handleSendOTP} className="w-full text-sm" disabled={isLoading}>
                  Didn't receive code? Resend
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground text-pretty">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

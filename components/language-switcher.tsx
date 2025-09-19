"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"

interface LanguageSwitcherProps {
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

export function LanguageSwitcher({ value = "en", onValueChange, className }: LanguageSwitcherProps) {
  const [language, setLanguage] = useState(value)

  const languages = [
    { value: "en", label: "English", flag: "🇺🇸" },
    { value: "hi", label: "हिंदी", flag: "🇮🇳" },
    { value: "es", label: "Español", flag: "🇪🇸" },
    { value: "fr", label: "Français", flag: "🇫🇷" },
    { value: "pt", label: "Português", flag: "🇧🇷" },
    { value: "ar", label: "العربية", flag: "🇸🇦" },
  ]

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    onValueChange?.(newLanguage)
  }

  return (
    <div className={className}>
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

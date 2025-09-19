// WelcomePage.tsx

"use client"

// ✅ Using useRouter for client-side navigation
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, MapPin, Plus, ArrowRight } from "lucide-react"

export default function WelcomePage() {
  // ✅ Initialize router for smooth navigation
  const router = useRouter()

  const handleAddFarm = () => {
    // ✅ Use router.push to navigate without a full page reload
    router.push("/add-farm")
  }

  return (
    // ✅ Consistent vibrant gradient background
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-lime-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            {/* ✅ Enhanced logo with shadow */}
            <div className="bg-green-600 rounded-full p-4 shadow-lg shadow-green-500/20">
              <Leaf className="h-12 w-12 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-green-900">Welcome to FarmUP!</h1>
            <p className="text-lg text-green-700/90 mt-2">
              Let's get started by mapping your first farm
            </p>
          </div>
        </div>

        {/* Welcome Card */}
        {/* ✅ Glassmorphism effect for the card */}
        <Card className="bg-white/60 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg overflow-hidden">
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              {/* ✅ Softer, more integrated icon style */}
              <div className="bg-green-100/70 rounded-full p-6 border border-green-200/80">
                <MapPin className="h-16 w-16 text-green-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-green-900">Map Your Farm Boundaries</h2>
              <p className="text-gray-600">
                Define your farm's layout to unlock personalized recommendations and insights.
              </p>
            </div>

            {/* ✅ Restyled "What you'll do" section for better clarity */}
            <div className="bg-green-50/80 rounded-lg p-4 text-left border border-green-200/60">
              <h3 className="font-semibold text-green-900 mb-2">Here's how it works:</h3>
              <ul className="space-y-2">
                {[
                  "Find your farm's location on the map",
                  "Draw the boundaries of your fields",
                  "Name your farm for easy identification",
                  "Receive tailored insights instantly",
                ].map((item, i) => (
                   <li key={i} className="flex items-start text-sm text-green-800/90">
                     <span className="text-green-500 mr-2 mt-1">✔</span>
                     {item}
                   </li>
                ))}
              </ul>
            </div>

            {/* ✅ Updated button with an icon for better affordance */}
            <Button onClick={handleAddFarm} size="lg" className="w-full text-lg py-7 font-bold bg-green-600 hover:bg-green-700 text-white group">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Farm
              <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-green-800/70">
          You can always add more farms from your dashboard later.
        </p>
      </div>
    </div>
  )
}
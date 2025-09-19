"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, MapPin, Plus } from "lucide-react"

export default function WelcomePage() {
  const handleAddFarm = () => {
    window.location.href = "/add-farm"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary rounded-full p-4">
              <Leaf className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-balance">Welcome to FarmUP!</h1>
            <p className="text-lg text-muted-foreground text-pretty mt-2">
              Let's get started by mapping your first farm
            </p>
          </div>
        </div>

        {/* Welcome Card */}
        <Card className="border-2 border-dashed border-primary/20">
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-secondary/10 rounded-full p-6">
                <MapPin className="h-16 w-16 text-secondary" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-balance">Map Your Farm Boundaries</h2>
              <p className="text-muted-foreground text-pretty">
                Use our interactive mapping tool to define your farm's boundaries. This helps us provide personalized
                recommendations and insights.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h3 className="font-medium">What you'll do:</h3>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li>• Search for your farm location</li>
                <li>• Draw your farm boundaries on the map</li>
                <li>• Name your farm for easy identification</li>
                <li>• Start receiving personalized insights</li>
              </ul>
            </div>

            <Button onClick={handleAddFarm} size="lg" className="w-full text-lg py-6">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Farm
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground text-pretty">
          You can add multiple farms later from your dashboard
        </p>
      </div>
    </div>
  )
}

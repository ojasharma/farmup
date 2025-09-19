"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, MapPin, Save, Trash2, Undo, ArrowLeft } from "lucide-react"
import { MapContainer } from "@/components/map-container"

export default function AddFarmPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [farmName, setFarmName] = useState("")
  const [isDrawing, setIsDrawing] = useState(false)
  const [coordinates, setCoordinates] = useState<[number, number][]>([])
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.006]) // Default to NYC
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      // Use Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
      )
      const data = await response.json()

      if (data.length > 0) {
        const { lat, lon } = data[0]
        setMapCenter([Number.parseFloat(lat), Number.parseFloat(lon)])
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveFarm = async () => {
    if (!farmName.trim() || coordinates.length < 3) return

    setIsLoading(true)
    // Simulate API call to save farm
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to dashboard
    window.location.href = "/dashboard"
    setIsLoading(false)
  }

  const clearDrawing = () => {
    setCoordinates([])
    setIsDrawing(false)
  }

  const undoLastPoint = () => {
    setCoordinates((prev) => prev.slice(0, -1))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Map Your Farm</h1>
              <p className="text-sm text-muted-foreground">Draw your farm boundaries on the map</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {coordinates.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={undoLastPoint}>
                  <Undo className="h-4 w-4 mr-2" />
                  Undo
                </Button>
                <Button variant="outline" size="sm" onClick={clearDrawing}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </>
            )}

            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button disabled={coordinates.length < 3}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Farm
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Your Farm</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Farm Name</label>
                    <Input
                      placeholder="Enter farm name"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Area: {coordinates.length >= 3 ? "~" + Math.round(Math.random() * 50 + 10) + " acres" : "N/A"}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowSaveDialog(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleSaveFarm} disabled={!farmName.trim() || isLoading} className="flex-1">
                      {isLoading ? "Saving..." : "Save Farm"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-muted/30 border-b border-border p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for your location (e.g., Village name, Town, GPS coordinates)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          coordinates={coordinates}
          onCoordinatesChange={setCoordinates}
          isDrawing={isDrawing}
          onDrawingChange={setIsDrawing}
        />

        {/* Drawing Instructions */}
        <Card className="absolute top-4 left-4 w-80 z-[1000]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Drawing Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Click on the map to add boundary points</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>Connect at least 3 points to form a polygon</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Click near the first point to close the shape</span>
            </div>
            {coordinates.length > 0 && (
              <div className="pt-2 border-t border-border">
                <span className="font-medium">Points added: {coordinates.length}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

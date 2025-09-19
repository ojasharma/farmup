"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Droplets, Bug, Leaf, Thermometer, Eye, EyeOff } from "lucide-react"
import { MapContainer } from "@/components/map-container"

interface FarmData {
  id: string
  name: string
  area: number
  coordinates: [number, number][]
  center: [number, number]
}

interface DataLayer {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  description: string
  enabled: boolean
}

export default function FarmDetailPage({ params }: { params: { farmId: string } }) {
  const [farm, setFarm] = useState<FarmData | null>(null)
  const [selectedArea, setSelectedArea] = useState<[number, number] | null>(null)
  const [dataLayers, setDataLayers] = useState<DataLayer[]>([
    {
      id: "moisture",
      name: "Soil Moisture",
      icon: <Droplets className="h-4 w-4" />,
      color: "#3b82f6",
      description: "Current soil moisture levels across your farm",
      enabled: true,
    },
    {
      id: "pests",
      name: "Pest Risk",
      icon: <Bug className="h-4 w-4" />,
      color: "#ef4444",
      description: "Areas with higher pest activity risk",
      enabled: false,
    },
    {
      id: "nutrients",
      name: "Nutrient Levels",
      icon: <Leaf className="h-4 w-4" />,
      color: "#10b981",
      description: "Soil nutrient distribution and deficiencies",
      enabled: false,
    },
    {
      id: "temperature",
      name: "Temperature",
      icon: <Thermometer className="h-4 w-4" />,
      color: "#f59e0b",
      description: "Soil and air temperature variations",
      enabled: false,
    },
  ])

  useEffect(() => {
    // Simulate loading farm data
    const loadFarm = async () => {
      // Mock farm data
      const mockFarm: FarmData = {
        id: params.farmId,
        name: "Green Valley Farm",
        area: 25.5,
        coordinates: [
          [40.7128, -74.006],
          [40.7138, -74.005],
          [40.7148, -74.007],
          [40.7138, -74.008],
          [40.7128, -74.007],
        ],
        center: [40.7138, -74.0065],
      }
      setFarm(mockFarm)
    }

    loadFarm()
  }, [params.farmId])

  const toggleDataLayer = (layerId: string) => {
    setDataLayers((prev) => prev.map((layer) => (layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer)))
  }

  const handleAreaClick = (coords: [number, number]) => {
    setSelectedArea(coords)
  }

  if (!farm) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading farm data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{farm.name}</h1>
              <p className="text-sm text-muted-foreground">{farm.area} acres • Interactive Farm View</p>
            </div>
          </div>

          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Live Data
          </Badge>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 bg-card border-r border-border p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Data Layers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Data Layers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dataLayers.map((layer) => (
                  <div key={layer.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div style={{ color: layer.color }}>{layer.icon}</div>
                      <div>
                        <p className="text-sm font-medium">{layer.name}</p>
                        <p className="text-xs text-muted-foreground">{layer.description}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => toggleDataLayer(layer.id)} className="h-8 w-8 p-0">
                      {layer.enabled ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Area Information */}
            {selectedArea && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Area Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">
                      {selectedArea[0].toFixed(4)}, {selectedArea[1].toFixed(4)}
                    </p>
                  </div>

                  <Tabs defaultValue="current" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="current">Current</TabsTrigger>
                      <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="current" className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Soil Moisture</span>
                          <span className="text-sm font-medium text-blue-600">68%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Temperature</span>
                          <span className="text-sm font-medium">24°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">pH Level</span>
                          <span className="text-sm font-medium text-green-600">6.8</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Pest Risk</span>
                          <span className="text-sm font-medium text-yellow-600">Low</span>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="history">
                      <p className="text-sm text-muted-foreground">
                        Historical data for the past 30 days shows stable conditions with optimal moisture levels.
                      </p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  Schedule Irrigation
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  Add Crop Data
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  Report Issue
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <MapContainer
            center={farm.center}
            coordinates={farm.coordinates}
            onCoordinatesChange={() => {}} // Read-only mode
            isDrawing={false}
            onDrawingChange={() => {}}
            className="h-full"
          />

          {/* Map Legend */}
          <Card className="absolute bottom-4 right-4 w-64 z-[1000]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {dataLayers
                .filter((layer) => layer.enabled)
                .map((layer) => (
                  <div key={layer.id} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: layer.color }}></div>
                    <span>{layer.name}</span>
                  </div>
                ))}
              {dataLayers.filter((layer) => layer.enabled).length === 0 && (
                <p className="text-xs text-muted-foreground">No data layers enabled</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

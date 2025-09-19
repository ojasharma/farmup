"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Sprout, Calendar, MapPin, Star, CheckCircle } from "lucide-react"

interface CropRecommendation {
  id: string
  name: string
  variety: string
  suitabilityScore: number
  profitPotential: number
  season: string
  plantingTime: string
  harvestTime: string
  waterRequirement: string
  soilType: string
  marketDemand: "High" | "Medium" | "Low"
  image: string
}

interface ResourceTask {
  id: string
  type: "irrigation" | "fertilization" | "pest-control"
  title: string
  description: string
  priority: "High" | "Medium" | "Low"
  dueDate: string
  estimatedTime: string
  completed: boolean
}

export default function RecommendationsPage({ params }: { params: { farmId: string } }) {
  const [activeTab, setActiveTab] = useState("crops")

  const cropRecommendations: CropRecommendation[] = [
    {
      id: "1",
      name: "Wheat",
      variety: "HD-2967",
      suitabilityScore: 92,
      profitPotential: 85,
      season: "Rabi",
      plantingTime: "Nov - Dec",
      harvestTime: "Apr - May",
      waterRequirement: "Medium",
      soilType: "Loamy",
      marketDemand: "High",
      image: "/placeholder-9zvm7.png",
    },
    {
      id: "2",
      name: "Mustard",
      variety: "Pusa Bold",
      suitabilityScore: 88,
      profitPotential: 78,
      season: "Rabi",
      plantingTime: "Oct - Nov",
      harvestTime: "Feb - Mar",
      waterRequirement: "Low",
      soilType: "Sandy Loam",
      marketDemand: "Medium",
      image: "/mustard-crop-yellow-flowers.jpg",
    },
    {
      id: "3",
      name: "Chickpea",
      variety: "Kabuli",
      suitabilityScore: 85,
      profitPotential: 82,
      season: "Rabi",
      plantingTime: "Nov - Dec",
      harvestTime: "Mar - Apr",
      waterRequirement: "Low",
      soilType: "Well-drained",
      marketDemand: "High",
      image: "/placeholder-oos00.png",
    },
  ]

  const resourceTasks: ResourceTask[] = [
    {
      id: "1",
      type: "irrigation",
      title: "Morning Irrigation - Zone A",
      description: "Water the wheat crop in the northern section. Soil moisture is at 45%.",
      priority: "High",
      dueDate: "Today, 6:00 AM",
      estimatedTime: "1.5 hours",
      completed: false,
    },
    {
      id: "2",
      type: "fertilization",
      title: "NPK Application",
      description: "Apply balanced NPK fertilizer (12:32:16) to mustard crop.",
      priority: "Medium",
      dueDate: "Tomorrow",
      estimatedTime: "2 hours",
      completed: false,
    },
    {
      id: "3",
      type: "pest-control",
      title: "Aphid Treatment",
      description: "Spray neem oil solution on chickpea plants showing aphid infestation.",
      priority: "High",
      dueDate: "Today, 4:00 PM",
      estimatedTime: "45 minutes",
      completed: true,
    },
    {
      id: "4",
      type: "irrigation",
      title: "Evening Irrigation - Zone B",
      description: "Light watering for recently planted mustard seedlings.",
      priority: "Medium",
      dueDate: "Today, 6:00 PM",
      estimatedTime: "1 hour",
      completed: false,
    },
  ]

  const toggleTaskCompletion = (taskId: string) => {
    // In a real app, this would update the backend
    console.log(`Toggle task ${taskId}`)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "irrigation":
        return "💧"
      case "fertilization":
        return "🌱"
      case "pest-control":
        return "🐛"
      default:
        return "📋"
    }
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
              <h1 className="text-xl font-semibold">AI Recommendations</h1>
              <p className="text-sm text-muted-foreground">Personalized insights for your farm</p>
            </div>
          </div>

          <Badge variant="secondary" className="bg-primary/10 text-primary">
            AI Powered
          </Badge>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="crops">Crop Recommendations</TabsTrigger>
            <TabsTrigger value="resources">Resource Management</TabsTrigger>
            <TabsTrigger value="planning">Farm Planning</TabsTrigger>
          </TabsList>

          {/* Crop Recommendations */}
          <TabsContent value="crops" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5" />
                  Recommended Crops for Your Farm
                </CardTitle>
                <p className="text-sm text-muted-foreground">Based on your soil type, climate, and market conditions</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {cropRecommendations.map((crop) => (
                    <Card key={crop.id} className="border-2 hover:border-primary/20 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <img
                            src={crop.image || "/placeholder.svg"}
                            alt={crop.name}
                            className="w-24 h-24 rounded-lg object-cover"
                          />

                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold">{crop.name}</h3>
                                <p className="text-sm text-muted-foreground">Variety: {crop.variety}</p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  <span className="font-medium">{crop.suitabilityScore}% suitable</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {crop.profitPotential}% profit potential
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="font-medium">Season</p>
                                <p className="text-muted-foreground">{crop.season}</p>
                              </div>
                              <div>
                                <p className="font-medium">Planting</p>
                                <p className="text-muted-foreground">{crop.plantingTime}</p>
                              </div>
                              <div>
                                <p className="font-medium">Harvest</p>
                                <p className="text-muted-foreground">{crop.harvestTime}</p>
                              </div>
                              <div>
                                <p className="font-medium">Water Need</p>
                                <p className="text-muted-foreground">{crop.waterRequirement}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">Market: {crop.marketDemand}</Badge>
                                <Badge variant="outline">{crop.soilType} soil</Badge>
                              </div>
                              <Button size="sm">View Details</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resource Management */}
          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Resource Management Tasks
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Scheduled irrigation, fertilization, and pest control activities
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resourceTasks.map((task) => (
                    <Card
                      key={task.id}
                      className={`border-l-4 ${
                        task.completed
                          ? "border-l-green-500 bg-green-50/50"
                          : task.priority === "High"
                            ? "border-l-red-500"
                            : task.priority === "Medium"
                              ? "border-l-yellow-500"
                              : "border-l-green-500"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{getTaskIcon(task.type)}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3
                                  className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                                >
                                  {task.title}
                                </h3>
                                {task.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span>Due: {task.dueDate}</span>
                                <span>Est. time: {task.estimatedTime}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleTaskCompletion(task.id)}
                              disabled={task.completed}
                            >
                              {task.completed ? "Completed" : "Mark Done"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Farm Planning */}
          <TabsContent value="planning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Optimal Farm Layout Planning
                </CardTitle>
                <p className="text-sm text-muted-foreground">AI-suggested crop placement and resource optimization</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Planning Map Placeholder */}
                  <div className="bg-muted/30 rounded-lg p-8 text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Interactive Planning Map</h3>
                    <p className="text-muted-foreground mb-4">
                      View AI-generated suggestions for optimal crop placement and resource allocation
                    </p>
                    <Button onClick={() => (window.location.href = `/my-farm/${params.farmId}`)}>Open Farm Map</Button>
                  </div>

                  {/* Planning Recommendations */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Crop Rotation Plan</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Zone A (North)</span>
                          <Badge variant="outline">Wheat → Mustard</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Zone B (South)</span>
                          <Badge variant="outline">Chickpea → Wheat</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Zone C (East)</span>
                          <Badge variant="outline">Fallow → Mustard</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Resource Optimization</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Water Usage</span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            -15% optimized
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Fertilizer Efficiency</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            +22% improved
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Yield Potential</span>
                          <Badge variant="outline" className="bg-orange-50 text-orange-700">
                            +18% increase
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

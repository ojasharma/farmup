"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert as UIAlert, AlertDescription } from "@/components/ui/alert"
import { Plus, MapPin, AlertTriangle, TrendingUp, Calendar, Leaf, Bug, Sprout } from "lucide-react"
import { WeatherWidget } from "@/components/weather-widget"
import { FarmSelector } from "@/components/farm-selector"

interface Farm {
  id: string
  name: string
  area: number
  location: string
  lastUpdated: string
}

interface FarmAlert {
  id: string
  type: "warning" | "info" | "success"
  title: string
  message: string
  timestamp: string
}

export default function DashboardPage() {
  const [selectedFarm, setSelectedFarm] = useState<string>("farm-1")
  const [farms, setFarms] = useState<Farm[]>([
    {
      id: "farm-1",
      name: "Green Valley Farm",
      area: 25.5,
      location: "Punjab, India",
      lastUpdated: "2 hours ago",
    },
    {
      id: "farm-2",
      name: "Sunrise Fields",
      area: 18.2,
      location: "Haryana, India",
      lastUpdated: "5 hours ago",
    },
  ])

  const [alerts, setAlerts] = useState<FarmAlert[]>([
    {
      id: "1",
      type: "warning",
      title: "Irrigation Needed",
      message: "Soil moisture in Zone A is below optimal levels",
      timestamp: "1 hour ago",
    },
    {
      id: "2",
      type: "info",
      title: "Weather Update",
      message: "Light rain expected tomorrow - good for recently planted crops",
      timestamp: "3 hours ago",
    },
    {
      id: "3",
      type: "warning",
      title: "Pest Alert",
      message: "Increased aphid activity reported in nearby farms",
      timestamp: "6 hours ago",
    },
  ])

  const currentFarm = farms.find((farm) => farm.id === selectedFarm)

  const quickActions = [
    {
      title: "View Farm Map",
      description: "Interactive 2D farm visualization",
      icon: <MapPin className="h-5 w-5" />,
      href: `/my-farm/${selectedFarm}`,
      color: "bg-blue-500",
    },
    {
      title: "Get Recommendations",
      description: "AI-powered farming insights",
      icon: <Sprout className="h-5 w-5" />,
      href: `/recommendations/${selectedFarm}`,
      color: "bg-green-500",
    },
    {
      title: "Market Prices",
      description: "Current crop and supply prices",
      icon: <TrendingUp className="h-5 w-5" />,
      href: "/market",
      color: "bg-orange-500",
    },
    {
      title: "Community",
      description: "Connect with other farmers",
      icon: <Leaf className="h-5 w-5" />,
      href: "/community",
      color: "bg-purple-500",
    },
  ]

  const farmStats = [
    {
      title: "Total Area",
      value: currentFarm?.area + " acres" || "N/A",
      icon: <MapPin className="h-4 w-4" />,
      trend: "+2.5%",
    },
    {
      title: "Active Crops",
      value: "3 types",
      icon: <Sprout className="h-4 w-4" />,
      trend: "+1 new",
    },
    {
      title: "Soil Health",
      value: "Good",
      icon: <Leaf className="h-4 w-4" />,
      trend: "Stable",
    },
    {
      title: "Pest Risk",
      value: "Low",
      icon: <Bug className="h-4 w-4" />,
      trend: "Improving",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Farm Dashboard</h1>
            <p className="text-muted-foreground">Monitor and manage your farming operations</p>
          </div>

          <div className="flex items-center gap-4">
            <FarmSelector farms={farms} selectedFarm={selectedFarm} onFarmChange={setSelectedFarm} />
            <Button onClick={() => (window.location.href = "/add-farm")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Farm
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Current Farm Info */}
        {currentFarm && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{currentFarm.name}</h2>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    {currentFarm.location} • {currentFarm.area} acres
                  </p>
                </div>
                <Badge variant="secondary">Updated {currentFarm.lastUpdated}</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {farmStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
                  </div>
                  <div className="text-muted-foreground">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weather Widget */}
          <div className="lg:col-span-1">
            <WeatherWidget farmLocation={currentFarm?.location || "Punjab, India"} />
          </div>

          {/* Alerts */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.slice(0, 3).map((alert) => (
                  <UIAlert
                    key={alert.id}
                    className={
                      alert.type === "warning"
                        ? "border-orange-200 bg-orange-50"
                        : alert.type === "success"
                          ? "border-green-200 bg-green-50"
                          : "border-blue-200 bg-blue-50"
                    }
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{alert.title}</p>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                      </div>
                    </AlertDescription>
                  </UIAlert>
                ))}

                {alerts.length > 3 && (
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View All Alerts ({alerts.length})
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent"
                  onClick={() => (window.location.href = action.href)}
                >
                  <div className={`p-2 rounded-md ${action.color} text-white`}>{action.icon}</div>
                  <div className="text-left">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Morning irrigation - Zone A</p>
                  <p className="text-sm text-muted-foreground">6:00 AM - 7:30 AM</p>
                </div>
                <Badge variant="outline">Scheduled</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Soil testing - Zone B</p>
                  <p className="text-sm text-muted-foreground">10:00 AM - 11:00 AM</p>
                </div>
                <Badge variant="outline">In Progress</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Fertilizer application</p>
                  <p className="text-sm text-muted-foreground">2:00 PM - 4:00 PM</p>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

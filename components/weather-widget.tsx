"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sun, Cloud, CloudRain, Thermometer, Droplets, Wind, Eye } from "lucide-react"

interface WeatherData {
  current: {
    temperature: number
    condition: string
    humidity: number
    windSpeed: number
    visibility: number
    uvIndex: number
    icon: string
  }
  forecast: Array<{
    day: string
    high: number
    low: number
    condition: string
    precipitation: number
    icon: string
  }>
}

interface WeatherWidgetProps {
  farmLocation: string
}

export function WeatherWidget({ farmLocation }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate weather API call
    const loadWeather = async () => {
      setIsLoading(true)

      // Mock weather data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockWeather: WeatherData = {
        current: {
          temperature: 28,
          condition: "Partly Cloudy",
          humidity: 65,
          windSpeed: 12,
          visibility: 10,
          uvIndex: 6,
          icon: "partly-cloudy",
        },
        forecast: [
          {
            day: "Today",
            high: 32,
            low: 22,
            condition: "Sunny",
            precipitation: 0,
            icon: "sunny",
          },
          {
            day: "Tomorrow",
            high: 29,
            low: 20,
            condition: "Light Rain",
            precipitation: 60,
            icon: "rain",
          },
          {
            day: "Wed",
            high: 26,
            low: 18,
            condition: "Cloudy",
            precipitation: 20,
            icon: "cloudy",
          },
          {
            day: "Thu",
            high: 30,
            low: 21,
            condition: "Sunny",
            precipitation: 5,
            icon: "sunny",
          },
        ],
      }

      setWeather(mockWeather)
      setIsLoading(false)
    }

    loadWeather()
  }, [farmLocation])

  const getWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "partly-cloudy":
        return <Cloud className="h-6 w-6 text-gray-500" />
      case "rain":
        return <CloudRain className="h-6 w-6 text-blue-500" />
      case "cloudy":
        return <Cloud className="h-6 w-6 text-gray-400" />
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weather) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5" />
          Weather
        </CardTitle>
        <p className="text-sm text-muted-foreground">{farmLocation}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            {getWeatherIcon(weather.current.icon)}
            <div>
              <p className="text-3xl font-bold">{weather.current.temperature}°C</p>
              <p className="text-sm text-muted-foreground">{weather.current.condition}</p>
            </div>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span>{weather.current.humidity}% humidity</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <span>{weather.current.windSpeed} km/h</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-gray-500" />
            <span>{weather.current.visibility} km</span>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-yellow-500" />
            <span>UV {weather.current.uvIndex}</span>
          </div>
        </div>

        {/* Forecast */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">4-Day Forecast</h4>
          <div className="space-y-2">
            {weather.forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {getWeatherIcon(day.icon)}
                  <span className="w-16">{day.day}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{day.low}°</span>
                  <span className="font-medium">{day.high}°</span>
                  {day.precipitation > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {day.precipitation}%
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Farming Advice */}
        <div className="bg-muted/50 rounded-lg p-3">
          <h4 className="font-medium text-sm mb-1">Farming Advice</h4>
          <p className="text-xs text-muted-foreground">
            {weather.forecast[1].precipitation > 50
              ? "Rain expected tomorrow - delay irrigation and consider covering sensitive crops."
              : "Good weather conditions for field work. Optimal time for irrigation and fertilizer application."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

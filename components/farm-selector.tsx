"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin } from "lucide-react"

interface Farm {
  id: string
  name: string
  area: number
  location: string
  lastUpdated: string
}

interface FarmSelectorProps {
  farms: Farm[]
  selectedFarm: string
  onFarmChange: (farmId: string) => void
}

export function FarmSelector({ farms, selectedFarm, onFarmChange }: FarmSelectorProps) {
  const currentFarm = farms.find((farm) => farm.id === selectedFarm)

  return (
    <Select value={selectedFarm} onValueChange={onFarmChange}>
      <SelectTrigger className="w-64">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {farms.map((farm) => (
          <SelectItem key={farm.id} value={farm.id}>
            <div className="flex flex-col items-start">
              <span className="font-medium">{farm.name}</span>
              <span className="text-xs text-muted-foreground">
                {farm.location} • {farm.area} acres
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

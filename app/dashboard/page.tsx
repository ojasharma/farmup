// app/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert as UIAlert, AlertDescription } from "@/components/ui/alert"
import {
  Plus,
  MapPin,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Leaf,
  Sprout,
  Loader2,
  Wind,
  Sun,
  CloudRain,
  Map,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import dynamic from 'next/dynamic';

// --- Dynamic Import for Map Component ---
const EnhancedFarmMap = dynamic(() => import('@/components/EnhancedFarmMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-200 rounded-lg">
      <div className="text-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto" />
        <p className="text-sm text-gray-600">Loading farm map...</p>
      </div>
    </div>
  ),
});

// --- Type Definitions ---
interface Farm {
  id: string
  name: string
  area: number
  points: { lat: number; lng: number }[]
  center: { lat: number; lng: number }
  createdAt: string
}

interface CropPlan {
  farmId: string;
  crops: Array<{
    cropId: string;
    cropName: string;
    allocatedArea: number;
    color: string;
    percentage: number;
  }>;
  totalArea: number;
  allocatedArea: number;
  remainingArea: number;
  createdAt: string;
}

interface CropZone {
  id: string;
  cropName: string;
  color: string;
  points: Array<{ lat: number; lng: number }>;
  area: number;
  percentage: number;
}

interface FarmAlert {
  id: string
  type: "warning" | "info" | "success"
  title: string
  message: string
  timestamp: string
}

// --- Main Dashboard Component ---
export default function DashboardPage() {
  const router = useRouter()
  const [farms, setFarms] = useState<Farm[]>([])
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [cropPlan, setCropPlan] = useState<CropPlan | null>(null)

  useEffect(() => {
    try {
      const savedFarmsJSON = localStorage.getItem("farms")
      const loadedFarms: Farm[] = savedFarmsJSON ? JSON.parse(savedFarmsJSON) : []
      setFarms(loadedFarms)
      if (loadedFarms.length > 0) {
        setSelectedFarmId(loadedFarms[0].id)
      }
    } catch (error) {
      console.error("Failed to load farms from localStorage", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedFarmId) {
      try {
        const savedCropPlan = localStorage.getItem(`cropPlan_${selectedFarmId}`)
        setCropPlan(savedCropPlan ? JSON.parse(savedCropPlan) : null)
      } catch (error) {
        console.error("Failed to load crop plan", error)
        setCropPlan(null)
      }
    }
  }, [selectedFarmId])

  const currentFarm = farms.find((farm) => farm.id === selectedFarmId)

  const generateCropZones = (farm: Farm, plan: CropPlan): CropZone[] => {
      if (!plan || plan.crops.length === 0 || !farm.points || farm.points.length < 3) return [];
      
      let { minLat, maxLat, minLng, maxLng } = farm.points.reduce((acc, p) => ({
          minLat: Math.min(acc.minLat, p.lat), maxLat: Math.max(acc.maxLat, p.lat),
          minLng: Math.min(acc.minLng, p.lng), maxLng: Math.max(acc.maxLng, p.lng),
      }), { minLat: Infinity, maxLat: -Infinity, minLng: Infinity, maxLng: -Infinity });

      let currentRect = { minLat, maxLat, minLng, maxLng };
      let remainingArea = plan.totalArea;
      const zones: CropZone[] = [];

      plan.crops.forEach((crop, index) => {
          if (remainingArea <= 0) return;
          const isLast = index === plan.crops.length - 1;
          const latRange = currentRect.maxLat - currentRect.minLat;
          const lngRange = currentRect.maxLng - currentRect.minLng;
          const proportion = isLast ? 1 : crop.allocatedArea / remainingArea;

          let newZonePoints: Array<{ lat: number; lng: number }>;

          if (latRange > lngRange) { // Split horizontally (taller than wide)
              const splitLat = currentRect.minLat + latRange * proportion;
              newZonePoints = [
                  { lat: currentRect.minLat, lng: currentRect.minLng }, { lat: currentRect.minLat, lng: currentRect.maxLng },
                  { lat: splitLat, lng: currentRect.maxLng }, { lat: splitLat, lng: currentRect.minLng },
              ];
              currentRect.minLat = splitLat;
          } else { // Split vertically (wider than tall)
              const splitLng = currentRect.minLng + lngRange * proportion;
              newZonePoints = [
                  { lat: currentRect.minLat, lng: currentRect.minLng }, { lat: currentRect.minLat, lng: splitLng },
                  { lat: currentRect.maxLat, lng: splitLng }, { lat: currentRect.maxLat, lng: currentRect.minLng },
              ];
              currentRect.minLng = splitLng;
          }

          zones.push({
            id: crop.cropId,
            cropName: crop.cropName,
            color: crop.color,
            points: newZonePoints,
            area: crop.allocatedArea,
            percentage: crop.percentage
          });

          remainingArea -= crop.allocatedArea;
      });
      return zones;
  };
  
  const cropZones = currentFarm && cropPlan ? generateCropZones(currentFarm, cropPlan) : [];
  
  const currentMonth = new Date().getMonth(); // September is 8
  
  // Data for the current time (September)
  const alerts: FarmAlert[] = [
    { id: "1", type: "success", title: "Harvest Ready", message: "Sweet Corn in Zone B is at optimal maturity for harvesting.", timestamp: "Today", },
    { id: "2", type: "info", title: "Market Price Alert", message: "Local mandi prices for corn have increased by 5%.", timestamp: "1h ago", },
    { id: "3", type: "warning", title: "Field Prep Reminder", message: "Prepare fields for upcoming Rabi (Wheat) sowing.", timestamp: "2 days ago", },
  ]
  const schedule = [
    { time: "8:00 AM", task: "Harvest Sweet Corn - Zone B", status: "In Progress" },
    { time: "1:00 PM", task: "Transport produce to local market", status: "Scheduled" },
    { time: "4:00 PM", task: "Begin ploughing fields for Wheat", status: "Scheduled" },
  ]

  const farmStats = [
    { title: "Total Area", value: `${currentFarm?.area?.toFixed(2) || '0.00'} ha`, icon: <MapPin className="h-6 w-6 text-blue-500" />, borderColor: "border-blue-500", },
    { title: "Crop Varieties", value: `${cropPlan?.crops.length || 0} Types`, icon: <Sprout className="h-6 w-6 text-green-500" />, borderColor: "border-green-500", },
    { title: "Planted Area", value: `${cropPlan?.allocatedArea?.toFixed(2) || '0.00'} ha`, icon: <Leaf className="h-6 w-6 text-yellow-500" />, borderColor: "border-yellow-500", },
    { title: "Available Area", value: `${(cropPlan?.remainingArea ?? currentFarm?.area)?.toFixed(2) || '0.00'} ha`, icon: <Map className="h-6 w-6 text-gray-500" />, borderColor: "border-gray-500", },
  ]
  const quickActions = [
    { title: "AI Recommendations", description: "Get smart farming insights", icon: <Sprout className="h-6 w-6" />, color: "bg-green-500", href: `/recommendations/${selectedFarmId}`, },
    { title: "Market Prices", description: "Check current crop prices", icon: <TrendingUp className="h-6 w-6" />, color: "bg-orange-500", href: "/market", },
    { title: "Farming Community", description: "Connect with other farmers", icon: <Leaf className="h-6 w-6" />, color: "bg-purple-500", href: "/community", },
  ]

  if (isLoading) { return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-green-600" /></div> }
  if (farms.length === 0) { return (
    <div className="flex h-screen flex-col items-center justify-center p-6 text-center">
      <Sprout className="h-24 w-24 text-green-400" />
      <h1 className="mt-6 text-4xl font-bold text-green-900">Welcome to FarmUP!</h1>
      <Button size="lg" className="mt-8 bg-green-600 text-lg hover:bg-green-700" onClick={() => router.push("/add-farm")}>
        <Plus className="mr-2 h-5 w-5" /> Add Your First Farm
      </Button>
    </div>
  )}

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-background to-blue-50/50">
      <header className="sticky top-0 z-10 border-b bg-white/80 p-4 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Sprout className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedFarmId ?? ""} onValueChange={setSelectedFarmId}>
              <SelectTrigger className="w-[200px] bg-white"><SelectValue placeholder="Select a farm" /></SelectTrigger>
              <SelectContent>{farms.map((farm) => <SelectItem key={farm.id} value={farm.id}>{farm.name}</SelectItem>)}</SelectContent>
            </Select>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push("/add-farm")}>
              <Plus className="mr-2 h-4 w-4" /> Add New Farm
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6 space-y-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 overflow-hidden bg-white shadow-lg">
            <CardHeader className="pb-2"><CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Map className="h-5 w-5 text-green-600" />{currentFarm?.name || 'Farm'} - Crop Zones</div>
                {!cropPlan && <Button size="sm" onClick={() => router.push(`/crop-recommendations?farmId=${selectedFarmId}`)} className="bg-green-600 hover:bg-green-700"><Plus className="h-4 w-4 mr-1" />Plan Crops</Button>}
            </CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="h-96 w-full">
                {currentFarm && <EnhancedFarmMap center={[currentFarm.center.lat, currentFarm.center.lng]} zoom={16} farmBoundary={currentFarm.points} cropZones={cropZones}/>}
              </div>
              {cropPlan && (
                <div className="p-4 bg-gray-50 border-t">
                  <div className="flex items-center justify-between text-sm"><span className="font-medium">Crop Distribution:</span><span className="text-gray-600">{cropPlan.allocatedArea.toFixed(1)}ha planted / {cropPlan.totalArea}ha total</span></div>
                  <div className="mt-2 flex gap-1 h-2 rounded-full overflow-hidden">
                    {cropPlan.crops.map(c => <div key={c.cropId} style={{ backgroundColor: c.color, width: `${c.percentage}%` }} title={`${c.cropName}: ${c.percentage}%`} />)}
                    {cropPlan.remainingArea > 0 && <div className="bg-gray-300" style={{ width: `${(cropPlan.remainingArea / cropPlan.totalArea) * 100}%` }} title={`Available: ${Math.round((cropPlan.remainingArea / cropPlan.totalArea) * 100)}%`} />}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="space-y-4">{farmStats.map((stat, i) => <Card key={i} className={`overflow-hidden border-t-4 bg-white ${stat.borderColor} shadow-sm hover:-translate-y-1 transition-transform`}><CardContent className="p-4"><div className="flex items-center justify-between"><p className="text-sm font-medium text-gray-500">{stat.title}</p>{stat.icon}</div><p className="mt-2 text-2xl font-bold text-gray-800">{stat.value}</p></CardContent></Card>)}</div>
        </div>
        
        {cropPlan && <CropLifecycleSection cropPlan={cropPlan} />}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1 bg-white shadow-sm">
            <CardHeader><CardTitle className="flex items-center gap-2 text-gray-700"><Sun className="h-5 w-5 text-orange-500" />Weather</CardTitle></CardHeader>
            <CardContent className="space-y-4"><div className="text-center"><p className="text-5xl font-bold">30°C</p><p className="text-gray-500">Clear Skies</p></div><div className="flex justify-around text-center"><div><Wind className="mx-auto h-6 w-6" /><p>8 km/h</p></div><div><CloudRain className="mx-auto h-6 w-6" /><p>5%</p></div></div></CardContent>
          </Card>
          <Card className="lg:col-span-2 bg-white shadow-sm">
            <CardHeader><CardTitle className="flex items-center gap-2 text-gray-700"><AlertTriangle className="h-5 w-5 text-orange-600" />Recent Alerts</CardTitle></CardHeader>
            <CardContent className="space-y-3">{alerts.map((a) => <UIAlert key={a.id} className={a.type === 'warning' ? 'border-orange-500/50 bg-orange-50' : a.type === 'success' ? 'border-green-500/50 bg-green-50' : 'border-blue-500/50 bg-blue-50'}><AlertTriangle className="h-4 w-4" /><AlertDescription><span className="font-bold">{a.title}: </span>{a.message}</AlertDescription></UIAlert>)}</CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">{quickActions.map((a) => <Card key={a.title} className="group cursor-pointer bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-1" onClick={() => router.push(a.href)}><CardContent className="p-6 flex items-center gap-4"><div className={`rounded-lg p-3 text-white ${a.color}`}>{a.icon}</div><div><p className="font-semibold">{a.title}</p><p className="text-sm text-gray-500">{a.description}</p></div></CardContent></Card>)}</div>
        </div>

        <Card className="bg-white shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-2 text-gray-700"><Calendar className="h-5 w-5" />Today's Schedule (Sep 19)</CardTitle></CardHeader>
          <CardContent className="space-y-3">{schedule.map(s => <div key={s.task} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"><div className="w-2 h-2 bg-blue-500 rounded-full"></div><div className="flex-1"><p className="font-medium">{s.task}</p><p className="text-sm text-muted-foreground">{s.time}</p></div><Badge variant={s.status === 'In Progress' ? 'default' : 'outline'}>{s.status}</Badge></div>)}</CardContent>
        </Card>
      </main>
    </div>
  )
}

// --- Crop Lifecycle Section & Child Components ---
const CropLifecycleSection = ({ cropPlan }: { cropPlan: CropPlan }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-2xl font-bold text-gray-800">Crop Lifecycle Tracker</h3>
      <p className="text-md text-gray-500">Current growth stage of your planted crops.</p>
    </div>
    <div className="grid grid-cols-1 gap-6">
      {cropPlan.crops.map((crop) => <CropLifecycle key={crop.cropId} cropName={crop.cropName} cropColor={crop.color} />)}
    </div>
  </div>
);

const getCropLifecycleData = (cropName: string) => {
  const name = cropName.toLowerCase();
  if (name.includes('wheat')) return {
    emoji: "🌾", name: "Winter Wheat", type: "Rabi Crop", stages: [
      { name: "Field Prep", period: "Sep - Oct", icon: "🚜" }, { name: "Sowing", period: "Nov - Dec", icon: "🌱" },
      { name: "Growth", period: "Dec - Feb", icon: "🌿" }, { name: "Flowering", period: "Feb - Mar", icon: "🌸" },
      { name: "Maturity", period: "Mar - Apr", icon: "🌾" }, { name: "Harvest", period: "Apr - May", icon: "🚜" }
    ]
  };
  if (name.includes('corn')) return {
    emoji: "🌽", name: "Sweet Corn", type: "Kharif Crop", stages: [
      { name: "Sowing", period: "Jun - Jul", icon: "🌱" }, { name: "Growth", period: "Jul - Aug", icon: "🌿" },
      { name: "Pollination", period: "Aug - Sep", icon: "🌸" }, { name: "Cob Fill", period: "Sep", icon: "🌽" },
      { name: "Harvest", period: "Sep - Oct", icon: "🚜" }
    ]
  };
  return { // Generic fallback
    emoji: "🌱", name: cropName, type: "General Crop", stages: [
      { name: "Sowing", period: "Varies", icon: "🌱" }, { name: "Growth", period: "Varies", icon: "🌿" },
      { name: "Maturity", period: "Varies", icon: "🌸" }, { name: "Harvest", period: "Varies", icon: "🚜" }
    ]
  };
};

const CropLifecycle = ({ cropName, cropColor }: { cropName: string; cropColor: string }) => {
  const lifecycleData = getCropLifecycleData(cropName);
  const currentMonth = new Date().getMonth(); // September is 8

  const getCurrentStageIndex = () => {
    const name = cropName.toLowerCase();
    if (name.includes('wheat')) {
      if (currentMonth >= 8 && currentMonth <= 9) return 0; // Sep-Oct -> Field Prep
      if (currentMonth >= 10 && currentMonth <= 11) return 1; // Nov-Dec -> Sowing
      return -1; // Off-season
    }
    if (name.includes('corn')) {
      if (currentMonth >= 5 && currentMonth <= 6) return 0; // Jun-Jul -> Sowing
      if (currentMonth === 7) return 1; // Aug -> Growth/Pollination
      if (currentMonth === 8) return 3; // Sep -> Cob Fill / Harvest Start
      if (currentMonth === 9) return 4; // Oct -> Harvest End
      return -1; // Off-season
    }
    return 1; // Default to 'Growth' for others
  };
  
  const currentStageIndex = getCurrentStageIndex();

  return (
    <Card className="bg-white shadow-sm border-l-4" style={{ borderLeftColor: cropColor }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="text-2xl">{lifecycleData.emoji}</span>
          <div>
            <h4 className="text-lg font-semibold">{lifecycleData.name}</h4>
            <p className="text-sm text-gray-500">{lifecycleData.type}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 overflow-x-auto">
        <div className="relative pt-8 pb-4 min-w-[600px]">
          <div className="absolute top-10 left-8 right-8 h-1 bg-gray-200 rounded-full">
             <div className="h-full rounded-full transition-all duration-1000" style={{ backgroundColor: cropColor, width: currentStageIndex >= 0 ? `${(currentStageIndex / (lifecycleData.stages.length - 1)) * 100}%` : '0%'}}/>
          </div>
          <div className="flex justify-between relative">
            {lifecycleData.stages.map((stage, index) => {
              const isActive = index === currentStageIndex;
              const isCompleted = index < currentStageIndex;
              return (
                <div key={stage.name} className="flex flex-col items-center text-center w-1/6 px-1">
                  <div className={`relative z-10 w-10 h-10 rounded-full border-4 flex items-center justify-center text-xl transition-all ${isActive ? 'scale-110 shadow-lg' : ''}`} style={{ backgroundColor: isCompleted || isActive ? cropColor : 'white', borderColor: isCompleted || isActive ? cropColor : '#d1d5db' }}>
                    <span style={{ color: isCompleted || isActive ? 'white' : '#6b7280' }}>{stage.icon}</span>
                  </div>
                  <div className="mt-3"><h5 className={`font-semibold text-sm ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>{stage.name}</h5><p className="text-xs text-gray-500">{stage.period}</p></div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Sprout,
  Calendar,
  MapPin,
  Star,
  CheckCircle,
  TrendingUp,
  Droplets,
  Bug,
  Lightbulb,
  Recycle,
  BarChart,
  Bot,
  Send,
  X,
  User,
  Loader2,
} from "lucide-react"
import { useRouter } from "next/navigation"

// --- INTERFACES ---
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
  isToday: boolean
  estimatedTime: string
  completed: boolean
}

// --- DUMMY DATA ---
const initialCropRecommendations: CropRecommendation[] = [
  {
    id: "1",
    name: "Wheat",
    variety: "PBW-343",
    suitabilityScore: 95,
    profitPotential: 88,
    season: "Rabi",
    plantingTime: "Nov - Dec",
    harvestTime: "Apr - May",
    waterRequirement: "Medium",
    soilType: "Alluvial Loam",
    marketDemand: "High",
    image: "https://images.unsplash.com/photo-1542282218-803b3c00b0f2?w=500&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Mustard",
    variety: "Pusa Bold",
    suitabilityScore: 88,
    profitPotential: 82,
    season: "Rabi",
    plantingTime: "Oct - Nov",
    harvestTime: "Feb - Mar",
    waterRequirement: "Low",
    soilType: "Sandy Loam",
    marketDemand: "High",
    image: "https://images.unsplash.com/photo-1627585695962-d3b3c3c13e51?w=500&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Sugarcane",
    variety: "Co-0238",
    suitabilityScore: 82,
    profitPotential: 92,
    season: "Annual",
    plantingTime: "Sep - Oct",
    harvestTime: "Oct - Dec (next year)",
    waterRequirement: "High",
    soilType: "Clay Loam",
    marketDemand: "High",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500&auto=format&fit=crop",
  },
]

const initialResourceTasks: ResourceTask[] = [
  {
    id: "1",
    type: "irrigation",
    title: "Morning Irrigation - Wheat Field (Zone A)",
    description: "Soil moisture is at 45%. Apply 1.5 inches of water.",
    priority: "High",
    dueDate: "6:00 AM",
    isToday: true,
    estimatedTime: "1.5 hours",
    completed: false,
  },
  {
    id: "2",
    type: "pest-control",
    title: "Aphid Scouting - Mustard Crop",
    description: "Check for aphid infestation on 10% of plants. Report findings.",
    priority: "Medium",
    dueDate: "4:00 PM",
    isToday: true,
    estimatedTime: "45 minutes",
    completed: false,
  },
  {
    id: "3",
    type: "fertilization",
    title: "NPK Application - Sugarcane",
    description: "Apply second dose of NPK fertilizer (12:32:16) to the main field.",
    priority: "High",
    dueDate: "Tomorrow",
    isToday: false,
    estimatedTime: "2 hours",
    completed: false,
  },
  {
    id: "4",
    type: "irrigation",
    title: "Drip System Check",
    description: "Ensure all drip emitters in the mustard field are functioning correctly.",
    priority: "Low",
    dueDate: "In 2 days",
    isToday: false,
    estimatedTime: "1 hour",
    completed: false,
  },
]

// --- HELPER COMPONENTS ---
const StatBar = ({ value, colorClass }: { value: number; colorClass: string }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div className={`h-2.5 rounded-full ${colorClass}`} style={{ width: `${value}%` }}></div>
  </div>
)

const TaskCard = ({ task, onToggle }: { task: ResourceTask; onToggle: (id: string) => void }) => {
  const getPriorityClasses = (p: string) => {
    if (task.completed) return "border-l-gray-300 bg-gray-50 text-gray-500"
    switch (p) {
      case "High": return "border-l-red-500 bg-red-50/80"
      case "Medium": return "border-l-yellow-500 bg-yellow-50/80"
      case "Low": return "border-l-green-500 bg-green-50/80"
      default: return "border-l-gray-400 bg-gray-100"
    }
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "irrigation": return <Droplets className="h-6 w-6 text-blue-500" />
      case "fertilization": return <Sprout className="h-6 w-6 text-green-600" />
      case "pest-control": return <Bug className="h-6 w-6 text-red-700" />
      default: return <Calendar className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <Card className={`transition-all border-l-4 ${getPriorityClasses(task.priority)}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {getTaskIcon(task.type)}
            <div>
              <h3 className={`font-semibold ${task.completed ? "line-through" : ""}`}>{task.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span>Due: {task.dueDate}</span>
                <span>Est: {task.estimatedTime}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="secondary" className={`${task.completed ? "bg-gray-200" : ""}`}>
              {task.priority}
            </Badge>
            <Button
              variant={task.completed ? "ghost" : "default"}
              size="sm"
              onClick={() => onToggle(task.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              {task.completed ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" /> Completed
                </>
              ) : (
                "Mark as Complete"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// --- AI CHATBOT COMPONENT ---
const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you with your farm recommendations today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // --- DUMMY AI RESPONSE LOGIC ---
    // In a real application, you would make an API call here.
    // const apiKey = process.env.NEXT_PUBLIC_GEM_API;
    // const response = await fetch('/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message: input, apiKey })
    // });
    // const data = await response.json();
    // const aiResponseText = data.reply;
    
    setTimeout(() => {
        let aiResponseText = "I'm not sure about that. Try asking about Wheat, Mustard, or Sugarcane.";
        const lowerCaseInput = input.toLowerCase();
        
        if (lowerCaseInput.includes("wheat")) {
            aiResponseText = "Wheat (PBW-343) is an excellent choice for this season with 95% suitability. It requires medium watering and prefers Alluvial Loam soil. Market demand is currently high.";
        } else if (lowerCaseInput.includes("mustard")) {
            aiResponseText = "Mustard (Pusa Bold) has an 88% suitability score. It's a great low-water crop for Sandy Loam soil and has strong market demand.";
        } else if (lowerCaseInput.includes("sugarcane")) {
            aiResponseText = "Sugarcane has a very high profit potential (92%) but also high water requirements. It's an annual crop, so plan accordingly.";
        }
        
        const aiMessage = { id: Date.now() + 1, text: aiResponseText, sender: 'ai' };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
        <Button onClick={() => setIsOpen(true)} className="rounded-full w-16 h-16 bg-green-600 hover:bg-green-700 shadow-lg">
          <Bot className="h-8 w-8" />
        </Button>
      </div>

      <div className={`fixed bottom-4 right-4 z-50 w-full max-w-sm transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <Card className="h-[60vh] flex flex-col shadow-2xl">
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-green-500 text-white"><Bot /></AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">FarmAI Assistant</CardTitle>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5"/>
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && <Avatar className="h-8 w-8"><AvatarFallback className="bg-green-100 text-green-700"><Bot className="h-5 w-5"/></AvatarFallback></Avatar>}
                <div className={`max-w-xs rounded-2xl p-3 text-sm ${msg.sender === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                  {msg.text}
                </div>
                {msg.sender === 'user' && <Avatar className="h-8 w-8"><AvatarFallback className="bg-gray-200"><User className="h-5 w-5"/></AvatarFallback></Avatar>}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-end gap-2 justify-start">
                  <Avatar className="h-8 w-8"><AvatarFallback className="bg-green-100 text-green-700"><Bot className="h-5 w-5"/></AvatarFallback></Avatar>
                  <div className="max-w-xs rounded-2xl p-3 bg-gray-100 rounded-bl-none">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </CardContent>
          <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center gap-2">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about crops..."
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-5 w-5"/>
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
};


// --- MAIN PAGE COMPONENT ---
export default function RecommendationsPage({ params }: { params: { farmId: string } }) {
  const router = useRouter()
  const [tasks, setTasks] = useState<ResourceTask[]>(initialResourceTasks)

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const todayTasks = tasks.filter((t) => t.isToday)
  const upcomingTasks = tasks.filter((t) => !t.isToday)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-background to-blue-50/50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white/80 p-4 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">AI Recommendations</h1>
              <p className="text-sm text-muted-foreground">Insights for your farm (ID: {params.farmId})</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-300 text-sm">
            <Lightbulb className="h-4 w-4 mr-2" />
            AI Powered
          </Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="crops" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-green-100/70">
            <TabsTrigger value="crops">Crop Recommendations</TabsTrigger>
            <TabsTrigger value="resources">Resource Management</TabsTrigger>
            <TabsTrigger value="planning">Farm Planning</TabsTrigger>
          </TabsList>

          {/* CROP RECOMMENDATIONS TAB */}
          <TabsContent value="crops" className="mt-6">
            <Card className="bg-white/80 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-green-900">
                  <Sprout /> Top Crop Suggestions
                </CardTitle>
                <p className="text-muted-foreground">Based on soil data, local climate, and market demand.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {initialCropRecommendations.map((crop) => (
                  <Card key={crop.id} className="overflow-hidden transition-all hover:shadow-lg hover:ring-2 hover:ring-green-500">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row gap-6">
                        <img
                          src={crop.image}
                          alt={crop.name}
                          className="w-full h-40 md:w-32 md:h-32 rounded-lg object-cover"
                        />
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold">{crop.name}</h3>
                                {crop.suitabilityScore > 90 && (
                                  <Badge className="bg-yellow-400 text-yellow-900">Top Pick</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">Variety: {crop.variety}</p>
                            </div>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Sprout className="h-4 w-4 mr-2"/>
                              Create Planting Plan
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                            <div>
                              <label className="text-xs font-medium text-gray-600">Suitability</label>
                              <div className="flex items-center gap-2">
                                <StatBar value={crop.suitabilityScore} colorClass="bg-green-500" />
                                <span className="text-sm font-semibold">{crop.suitabilityScore}%</span>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Profit Potential</label>
                              <div className="flex items-center gap-2">
                                <StatBar value={crop.profitPotential} colorClass="bg-blue-500" />
                                <span className="text-sm font-semibold">{crop.profitPotential}%</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap text-xs border-t pt-3">
                            <Badge variant="outline">Season: {crop.season}</Badge>
                            <Badge variant="outline">Plant: {crop.plantingTime}</Badge>
                            <Badge variant="outline">Harvest: {crop.harvestTime}</Badge>
                            <Badge variant="outline">Water: {crop.waterRequirement}</Badge>
                            <Badge variant="outline">Soil: {crop.soilType}</Badge>
                            <Badge variant="outline" className="bg-purple-100 text-purple-800">
                              Market: {crop.marketDemand}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* RESOURCE MANAGEMENT TAB */}
          <TabsContent value="resources" className="mt-6 space-y-6">
            <Card className="bg-white/80 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-blue-900">
                  <Calendar /> Today's Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todayTasks.length > 0 ? (
                  todayTasks.map((task) => <TaskCard key={task.id} task={task} onToggle={toggleTaskCompletion} />)
                ) : (
                  <p className="text-muted-foreground text-center py-4">No tasks scheduled for today.</p>
                )}
              </CardContent>
            </Card>
            <Card className="bg-white/80 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-gray-800">
                  <Calendar /> Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task) => <TaskCard key={task.id} task={task} onToggle={toggleTaskCompletion} />)
                ) : (
                  <p className="text-muted-foreground text-center py-4">No upcoming tasks.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* FARM PLANNING TAB */}
          <TabsContent value="planning" className="mt-6">
            <Card className="bg-white/80 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-purple-900">
                  <MapPin /> Spatial Planning & Optimization
                </CardTitle>
                <p className="text-muted-foreground">AI-suggested crop placement and resource optimization.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="relative bg-gray-900 rounded-lg p-8 text-center text-white overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&auto=format&fit=crop" alt="Farm map background" className="absolute inset-0 w-full h-full object-cover opacity-20"/>
                    <div className="relative z-10">
                        <MapPin className="h-12 w-12 text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Interactive Farm Layout</h3>
                        <p className="text-gray-300 mb-4">
                         Visualize AI-generated plans for crop placement, irrigation lines, and more.
                        </p>
                        <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={() => router.push(`/my-farm/${params.farmId}`)}>Open 2D Farm Map</Button>
                    </div>
                  </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Recycle/> Crop Rotation Plan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                       <p className="text-xs text-muted-foreground">Next Season's Plan to improve soil health.</p>
                       <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                          <span className="font-medium">Zone A (North)</span>
                          <Badge variant="outline">Wheat → Legumes (Fodder)</Badge>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                          <span className="font-medium">Zone B (South)</span>
                          <Badge variant="outline">Sugarcane → Fallow</Badge>
                        </div>
                    </CardContent>
                  </Card>
                   <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><BarChart/> Predicted Gains</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs text-muted-foreground">Estimated improvements with AI plan.</p>
                       <div className="flex justify-between items-center">
                          <span className="text-sm">Water Usage</span>
                          <Badge className="bg-blue-100 text-blue-800">-15%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Fertilizer Efficiency</span>
                           <Badge className="bg-green-100 text-green-800">+22%</Badge>
                        </div>
                         <div className="flex justify-between items-center">
                          <span className="text-sm">Yield Potential</span>
                           <Badge className="bg-yellow-100 text-yellow-800">+18%</Badge>
                        </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* RENDER THE CHATBOT */}
      <AIChatbot />
    </div>
  )
}
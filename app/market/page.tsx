"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Phone, Star, ShoppingCart } from "lucide-react"

interface Product {
  id: string
  name: string
  category: "fertilizer" | "pesticide" | "seeds"
  price: number
  unit: string
  rating: number
  reviews: number
  image: string
  description: string
  vendor: Vendor
  inStock: boolean
}

interface Vendor {
  id: string
  name: string
  location: string
  distance: number
  phone: string
  rating: number
  verified: boolean
}

export default function MarketPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("relevance")

  const products: Product[] = [
    {
      id: "1",
      name: "NPK Fertilizer 12:32:16",
      category: "fertilizer",
      price: 850,
      unit: "50kg bag",
      rating: 4.5,
      reviews: 128,
      image: "/fertilizer-npk-bag.jpg",
      description: "High-quality balanced NPK fertilizer perfect for wheat and mustard crops",
      vendor: {
        id: "v1",
        name: "Green Valley Agro",
        location: "Ludhiana, Punjab",
        distance: 5.2,
        phone: "+91 98765 43210",
        rating: 4.7,
        verified: true,
      },
      inStock: true,
    },
    {
      id: "2",
      name: "Neem Oil Organic Pesticide",
      category: "pesticide",
      price: 320,
      unit: "1 liter",
      rating: 4.8,
      reviews: 89,
      image: "/neem-oil-bottle.jpg",
      description: "100% organic neem oil for effective pest control without harmful chemicals",
      vendor: {
        id: "v2",
        name: "Organic Solutions",
        location: "Amritsar, Punjab",
        distance: 12.8,
        phone: "+91 87654 32109",
        rating: 4.6,
        verified: true,
      },
      inStock: true,
    },
    {
      id: "3",
      name: "HD-2967 Wheat Seeds",
      category: "seeds",
      price: 45,
      unit: "1kg",
      rating: 4.6,
      reviews: 156,
      image: "/wheat-seeds-bag.jpg",
      description: "High-yielding wheat variety suitable for Punjab climate conditions",
      vendor: {
        id: "v3",
        name: "Punjab Seeds Co.",
        location: "Patiala, Punjab",
        distance: 18.5,
        phone: "+91 76543 21098",
        rating: 4.8,
        verified: true,
      },
      inStock: false,
    },
    {
      id: "4",
      name: "Urea Fertilizer",
      category: "fertilizer",
      price: 280,
      unit: "50kg bag",
      rating: 4.3,
      reviews: 203,
      image: "/urea-fertilizer-bag.jpg",
      description: "High-grade urea fertilizer for nitrogen supplementation",
      vendor: {
        id: "v1",
        name: "Green Valley Agro",
        location: "Ludhiana, Punjab",
        distance: 5.2,
        phone: "+91 98765 43210",
        rating: 4.7,
        verified: true,
      },
      inStock: true,
    },
    {
      id: "5",
      name: "Mustard Seeds - Pusa Bold",
      category: "seeds",
      price: 180,
      unit: "1kg",
      rating: 4.7,
      reviews: 94,
      image: "/mustard-seeds-bag.jpg",
      description: "Premium mustard seeds with high oil content and disease resistance",
      vendor: {
        id: "v4",
        name: "Haryana Agri Mart",
        location: "Karnal, Haryana",
        distance: 25.3,
        phone: "+91 65432 10987",
        rating: 4.5,
        verified: false,
      },
      inStock: true,
    },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "distance":
        return a.vendor.distance - b.vendor.distance
      default:
        return 0
    }
  })

  const handleContactVendor = (vendor: Vendor) => {
    window.open(`tel:${vendor.phone}`, "_self")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Agricultural Market</h1>
          <p className="text-muted-foreground">Find fertilizers, pesticides, and seeds from local suppliers</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="fertilizer">Fertilizers</SelectItem>
                  <SelectItem value="pesticide">Pesticides</SelectItem>
                  <SelectItem value="seeds">Seeds</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="distance">Nearest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {!product.inStock && <Badge className="absolute top-2 right-2 bg-red-500">Out of Stock</Badge>}
                {product.vendor.verified && (
                  <Badge className="absolute top-2 left-2 bg-green-500">Verified Seller</Badge>
                )}
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary">₹{product.price}</p>
                    <p className="text-sm text-muted-foreground">per {product.unit}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>
                </div>

                {/* Vendor Info */}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{product.vendor.name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{product.vendor.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{product.vendor.location}</span>
                    <span>•</span>
                    <span>{product.vendor.distance} km away</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleContactVendor(product.vendor)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  <Button size="sm" className="flex-1" disabled={!product.inStock}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? "Order" : "Unavailable"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No products found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}

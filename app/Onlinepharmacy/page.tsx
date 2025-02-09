'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Search, ShoppingCart, Plus, Pill, PillIcon as Capsule, Syringe, Thermometer, Activity, Heart, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

// Types
interface Medicine {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
}

interface CartItem extends Medicine {
  quantity: number
}

// Sample medicine data
const medicines: Medicine[] = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    description: "Pain reliever and fever reducer",
    price: 5.99,
    category: "Pain Relief",
    image: "/placeholder.svg?height=200&width=200"
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    description: "Antibiotic for bacterial infections",
    price: 12.99,
    category: "Antibiotics",
    image: "/placeholder.svg?height=200&width=200"
  },
  // Add more medicines as needed
]

export default function PharmacyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>(medicines)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showNotFound, setShowNotFound] = useState(false)

  // Refs for GSAP animations
  const headerRef = useRef(null)
  const cartButtonRef = useRef(null)
  const searchRef = useRef(null)
  const medicinesRef = useRef<HTMLDivElement[]>([])
  const floatingIconsRef = useRef<HTMLDivElement[]>([])

  // Floating icons array
  const floatingIcons = [Pill, Capsule, Syringe, Thermometer, Activity, Heart]

  // Initialize GSAP animations
  useEffect(() => {
    // Header animation
    gsap.from(headerRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: "power2.out"
    })

    // Cart button animation
    gsap.from(cartButtonRef.current, {
      opacity: 0,
      x: 20,
      duration: 0.8,
      ease: "power2.out"
    })

    // Search bar animation
    gsap.from(searchRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.2,
      ease: "power2.out"
    })

    // Floating icons animations
    floatingIconsRef.current.forEach((icon, index) => {
      gsap.to(icon, {
        y: '-200vh',
        x: `random(0, 100)vw`,
        rotation: 360,
        duration: 20 + Math.random() * 10,
        repeat: -1,
        delay: index * 2,
        ease: "none"
      })
    })

    // Medicine cards animation
    medicinesRef.current.forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        delay: 0.1 * index,
        ease: "power2.out"
      })
    })
  }, [])

  // Filter medicines based on search query
  useEffect(() => {
    const filtered = medicines.filter(medicine =>
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredMedicines(filtered)
    setShowNotFound(searchQuery !== '' && filtered.length === 0)
  }, [searchQuery])

  // Add to cart function
  const addToCart = (medicine: Medicine) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === medicine.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...medicine, quantity: 1 }]
    })
    toast({
      title: "Added to Cart",
      description: `${medicine.name} has been added to your cart`,
      duration: 2000,
    })
  }

  // Remove from cart function
  const removeFromCart = (medicineId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== medicineId))
  }

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Proceed to payment
  const handleCheckout = () => {
    toast({
      title: "Proceeding to Payment",
      description: "Redirecting to secure payment gateway...",
      duration: 3000,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      {/* Floating Background Elements */}
      {floatingIcons.map((Icon, index) => (
        <div
          key={index}
          ref={el => floatingIconsRef.current[index] = el}
          className="absolute text-blue-500/10"
          style={{ top: '100vh' }}
        >
          <Icon size={48} />
        </div>
      ))}

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-repeat opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0v60M60 30H0' stroke='%230000FF' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1
            ref={headerRef}
            className="text-3xl font-bold text-gray-800"
          >
            Online Pharmacy
          </h1>
          <div
            ref={cartButtonRef}
            className="relative"
          >
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-5 h-5" />
              Cart
              {cart.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Search Section */}
        <div
          ref={searchRef}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for medicines..."
              className="w-full pl-10 pr-4 py-3 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Not Found Message */}
        {showNotFound && (
          <div className="text-center my-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              We couldn't find what you're looking for
            </h3>
            <p className="text-gray-600">
              We're sorry, but we couldn't find any medicines matching your search.
              Please try a different search term or browse our categories.
            </p>
          </div>
        )}

        {/* Medicine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.map((medicine, index) => (
            <div
              key={medicine.id}
              ref={el => medicinesRef.current[index] = el}
              className="opacity-0"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={medicine.image}
                  alt={medicine.name}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                />
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{medicine.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{medicine.description}</p>
                  <Badge variant="secondary" className="mb-2">
                    {medicine.category}
                  </Badge>
                  <p className="text-lg font-bold text-blue-600">
                    ${medicine.price.toFixed(2)}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full"
                    onClick={() => addToCart(medicine)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>

        {/* Cart Dialog */}
        <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Your Cart</DialogTitle>
              <DialogDescription>
                Review your items before checkout
              </DialogDescription>
            </DialogHeader>
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-[60vh] overflow-auto">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-blue-600 font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-blue-600">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleCheckout}
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

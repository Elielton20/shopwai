"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Minus, Trash2 } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  image_url: string | null
  vendor_id: string
}

interface CartItem {
  produto_id: string
  quantidade: number
  produto: Product
}

export default function LojaClient({ user, initialProducts }: { user: any; initialProducts: Product[] }) {
  const [products] = useState<Product[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  const loadCart = () => {
    const cartData = localStorage.getItem(`shopwai_cart_${user.id}`)
    if (cartData) {
      setCartItems(JSON.parse(cartData))
    }
  }

  const saveCart = (items: CartItem[]) => {
    localStorage.setItem(`shopwai_cart_${user.id}`, JSON.stringify(items))
    setCartItems(items)
  }

  const addToCart = (product: Product) => {
    loadCart() 
    const cartData = localStorage.getItem(`shopwai_cart_${user.id}`)
    const currentCart: CartItem[] = cartData ? JSON.parse(cartData) : []

    const existingItem = currentCart.find((item) => item.produto_id === product.id)

    if (existingItem) {
      const updatedCart = currentCart.map((item) =>
        item.produto_id === product.id ? { ...item, quantidade: item.quantidade + 1 } : item,
      )
      saveCart(updatedCart)
    } else {
      const newCart = [...currentCart, { produto_id: product.id, quantidade: 1, produto: product }]
      saveCart(newCart)
    }
  }

  const increaseQuantity = (produtoId: string) => {
    const updatedCart = cartItems.map((item) =>
      item.produto_id === produtoId ? { ...item, quantidade: item.quantidade + 1 } : item,
    )
    saveCart(updatedCart)
  }

  const decreaseQuantity = (produtoId: string) => {
    const updatedCart = cartItems.map((item) => {
      if (item.produto_id === produtoId) {
        const newQuantity = item.quantidade - 1
        if (newQuantity <= 0) {
          return null
        }
        return { ...item, quantidade: newQuantity }
      }
      return item
    }).filter(Boolean) as CartItem[]
    
    saveCart(updatedCart)
  }

  const removeFromCart = (produtoId: string) => {
    const updatedCart = cartItems.filter((item) => item.produto_id !== produtoId)
    saveCart(updatedCart)
  }

  const handleLogout = () => {
    localStorage.removeItem("shopwai_current_user")
    window.location.href = "/login"
  }

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const cartTotal = cartItems.reduce((sum, item) => sum + item.produto.price * item.quantidade, 0)

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantidade, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      
      <header className="bg-amber-800 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex items-center justify-between gap-4">
          
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-amber-900 text-white p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-amber-700">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-700 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold">{user?.nome?.[0] || "U"}</span>
                    </div>
                    <div>
                      <p className="font-bold">Olá, {user?.nome || "Usuário"}</p>
                    </div>
                  </div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-amber-800">
                    NOVIDADES
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-amber-800">
                    MAIS VENDIDOS
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-amber-800"
                    onClick={() => window.open("https://wa.me/", "_blank")}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    SUPORTE
                  </Button>
                </nav>
                <div className="p-4 border-t border-amber-700">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-amber-800"
                    onClick={handleLogout}
                  >
                    SAIR
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          
          <div className="flex items-center gap-2 flex-1">
            <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src="logo_shopwai.png" 
                alt="ShopWai Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="font-bold text-xl hidden sm:block">SHOPWAI</span>
          </div>

          
          <div className="flex-1 max-w-md hidden md:block">
            <Input
              type="search"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white"
            />
          </div>

        
          <div className="flex items-center gap-4">
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white relative" onClick={loadCart}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <div className="flex flex-col h-full">
                  <h2 className="text-2xl font-bold mb-4">Carrinho</h2>
                  <div className="flex-1 overflow-y-auto space-y-4">
                    {cartItems.length === 0 ? (
                      <p className="text-center text-gray-500 mt-8">Carrinho vazio</p>
                    ) : (
                      cartItems.map((item) => (
                        <Card key={item.produto_id} className="p-4">
                          <div className="flex gap-4">
                            <div className="relative w-20 h-20 bg-gray-100 rounded flex-shrink-0">
                              {item.produto.image_url && (
                                <Image
                                  src={item.produto.image_url || "/placeholder.svg"}
                                  alt={item.produto.name}
                                  fill
                                  className="object-cover rounded"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold">{item.produto.name}</h3>
                              
                              
                              <div className="flex items-center gap-3 mt-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => decreaseQuantity(item.produto_id)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                
                                <span className="font-bold min-w-[2rem] text-center">{item.quantidade}</span>
                                
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => increaseQuantity(item.produto_id)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                
                                <span className="ml-2 text-sm text-gray-600">
                                  R$ {item.produto.price.toFixed(2)} cada
                                </span>
                              </div>
                              
                              <p className="font-bold text-green-600 mt-2">
                                Total: R$ {(item.produto.price * item.quantidade).toFixed(2)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.produto_id)}
                              className="text-red-500"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                  {cartItems.length > 0 && (
                    <div className="border-t pt-4 space-y-4">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total:</span>
                        <span>R$ {cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-gray-600 text-center">
                        {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'} no carrinho
                      </div>
                      <Button
                        className="w-full bg-green-500 hover:bg-green-600"
                        onClick={() => {
                          alert("Funcionalidade de pagamento disponível quando conectar o Supabase!")
                        }}
                      >
                        FINALIZAR COMPRA
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Button variant="ghost" size="icon" className="text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Button>
          </div>
        </div>

        
        <div className="md:hidden mt-4">
          <Input
            type="search"
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white"
          />
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative w-full aspect-square bg-gray-100">
                {product.image_url && (
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-sm line-clamp-2">{product.name}</h3>
                <p className="text-lg font-bold text-green-600">R$ {product.price.toFixed(2)}</p>
                <Button className="w-full bg-amber-800 hover:bg-amber-900" size="sm" onClick={() => addToCart(product)}>
                  Adicionar
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
          </div>
        )}
      </main>

      <div className="fixed bottom-6 right-6 md:hidden">
        <Button 
          className="rounded-full w-14 h-14 bg-amber-800 hover:bg-amber-900 shadow-lg"
          onClick={() => {
            loadCart()
            setIsCartOpen(true)
          }}
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
        </Button>
      </div>
    </div>
  )
}
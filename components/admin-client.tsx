"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Camera, X, Upload, Plus, Edit, Trash2, LogOut } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  image_url: string | null
  vendor_id: string
}

interface Order {
  id: string
  produto: string
  tipo: string
  quantidade: number
  valor: string
}

export default function AdminClient({ user, initialProducts }: { user: any; initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [osoti, setOsoTi] = useState("")
  const [timson, setTimson] = useState("")
  const [yakenon, setYakenon] = useState("")
  const [eepethiriAhnoro, setEepethiriAhnoro] = useState("")
  const [imagemUrl, setImagemUrl] = useState("")

  const [showCameraDialog, setShowCameraDialog] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [orders] = useState<Order[]>([
    { id: "1", produto: "Jobo silveria", tipo: "Farinha", quantidade: 3, valor: "2" },
    { id: "2", produto: "Banana", tipo: "", quantidade: 2, valor: "312,00" },
  ])

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (error) {
      console.error("Erro ao acessar câmera:", error)
      alert("Não foi possível acessar a câmera. Verifique as permissões.")
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        
        const imageDataUrl = canvasRef.current.toDataURL('image/jpeg')
        setCapturedImage(imageDataUrl)
        setImagemUrl(imageDataUrl)
        stopCamera()
        setShowCameraDialog(false)
      }
    }
  }

  // Parar câmera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  useEffect(() => {
    if (showCameraDialog) {
      initializeCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [showCameraDialog])

  const handleLogout = () => {
    localStorage.removeItem("shopwai_current_user")
    window.location.href = "/login"
  }

  const resetForm = () => {
    setOsoTi("")
    setTimson("")
    setYakenon("")
    setEepethiriAhnoro("")
    setImagemUrl("")
    setCapturedImage(null)
    setEditingProduct(null)
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()

    const newProduct: Product = {
      id: Date.now().toString(),
      name: osoti,
      price: Number.parseFloat(eepethiriAhnoro),
      image_url: imagemUrl || `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(osoti)}`,
      vendor_id: user.id,
    }

    const productsData = localStorage.getItem("shopwai_products")
    const allProducts = productsData ? JSON.parse(productsData) : []

    allProducts.push(newProduct)
    localStorage.setItem("shopwai_products", JSON.stringify(allProducts))

    setProducts([newProduct, ...products])
    resetForm()
  }

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    const updatedProduct = {
      ...editingProduct,
      name: osoti,
      price: Number.parseFloat(eepethiriAhnoro),
      image_url: imagemUrl,
    }

    const productsData = localStorage.getItem("shopwai_products")
    const allProducts = productsData ? JSON.parse(productsData) : []

    const updatedProducts = allProducts.map((p: Product) => (p.id === editingProduct.id ? updatedProduct : p))
    localStorage.setItem("shopwai_products", JSON.stringify(updatedProducts))

    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
    setEditingProduct(null)
    resetForm()
  }

  const handleDeleteProduct = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return

    const productsData = localStorage.getItem("shopwai_products")
    const allProducts = productsData ? JSON.parse(productsData) : []

    const updatedProducts = allProducts.filter((p: Product) => p.id !== id)
    localStorage.setItem("shopwai_products", JSON.stringify(updatedProducts))

    setProducts(products.filter((p) => p.id !== id))
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setOsoTi(product.name)
    setEepethiriAhnoro(product.price.toString())
    setImagemUrl(product.image_url || "")
    setIsAddDialogOpen(true)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setImagemUrl(result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f1eb] to-[#e8dfd5]"> {/* Fundo claro mantido */}
      <div className="bg-gradient-to-r from-[#8B4513] to-[#A0522D] py-4 px-6 border-b border-[#D2B48C]"> {/* Mantém marrom */}
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            
<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8B4513] to-[#5D4037] flex items-center justify-center border-2 border-[#D2B48C] overflow-hidden">
  <img 
    src="logo_shopwai.png"  
    alt="SHOPWAI Logo"
    className="w-15 h-15 object-contain"
    onError={(e) => {
      e.currentTarget.style.display = 'none'
      const parent = e.currentTarget.parentElement
      if (parent) {
        parent.innerHTML = '<span class="text-white font-bold text-lg">SW</span>'
      }
    }}
  />
</div>
            
            
            <div>
              <h1 className="text-2xl font-bold text-white">SHOPWAI - ANTOMANE</h1> 
            </div>
          </div>

          <Button 
            variant="ghost" 
            className="text-white hover:text-white hover:bg-[#A0522D]"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6 justify-center mb-8">
            
            <div className="bg-gradient-to-br from-[#f5f1eb] to-[#e8dfd5] rounded-xl p-6 text-center border-2 border-[#8B4513] shadow-lg w-48"> {/* Fundo claro, borda marrom */}
              <h3 className="text-lg font-bold text-[#8B4513] mb-2">TIMSOM</h3> 
              <div className="w-20 h-20 bg-gradient-to-br from-[#f5f1eb] to-[#e8dfd5] rounded-full flex items-center justify-center border-2 border-[#8B4513] mx-auto"> {/* Fundo claro, borda marrom */}
                <span className="text-3xl font-bold text-[#8B4513]">15</span> 
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#f5f1eb] to-[#e8dfd5] rounded-xl p-6 text-center border-2 border-[#8B4513] shadow-lg w-48"> {/* Fundo claro, borda marrom */}
              <h3 className="text-lg font-bold text-[#8B4513] mb-2">TIMSOM EEKEN</h3> 
              <div className="w-20 h-20 bg-gradient-to-br from-[#f5f1eb] to-[#e8dfd5] rounded-full flex items-center justify-center border-2 border-[#8B4513] mx-auto"> {/* Fundo claro, borda marrom */}
                <span className="text-3xl font-bold text-[#8B4513]">45</span> 
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="space-y-6">
              
              <Card className="bg-gradient-to-r from-[#8B4513] to-[#A0522D] border-2 border-[#D2B48C] rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4 text-center">OSOTI (Produtos)</h3> 
                
                <div className="space-y-4 mb-6">
                  {products.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-[#A0522D] rounded-full flex items-center justify-center border-2 border-[#D2B48C] mx-auto mb-4">
                        <span className="text-2xl text-white">📦</span> 
                      </div>
                      <p className="text-white">Nenhum produto cadastrado</p> 
                      <p className="text-[#D2B48C] text-sm">Clique em ADICIONAR PRODUTO para começar</p>
                    </div>
                  ) : (
                    products.map((product) => (
                      <div key={product.id} className="bg-[#5D4037] rounded-lg p-4 border-2 border-[#D2B48C] hover:border-white transition-all"> {/* Fundo marrom escuro */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            {product.image_url ? (
                              <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-[#D2B48C]">
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-20 h-20 rounded-lg bg-[#A0522D] border-2 border-[#D2B48C] flex items-center justify-center">
                                <span className="text-white text-sm">Imagem</span> 
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-white text-lg mb-1">{product.name}</div> 
                              <div className="text-white text-xl font-bold">R$ {product.price.toFixed(2)}</div> 
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-[#D7CCC8] to-[#BCAAA4] hover:from-[#BCAAA4] hover:to-[#A1887F] text-[#5D4037] border-2 border-[#D2B48C]" /* Botões mantêm mesma cor */
                              onClick={() => openEditDialog(product)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              EDITAR
                            </Button>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-[#A1887F] to-[#8D6E63] hover:from-[#8D6E63] hover:to-[#795548] text-white border-2 border-[#8D6E63]" /* Botões mantêm mesma cor */
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              NENATI
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white text-lg py-6 rounded-xl font-bold shadow-lg border-2 border-emerald-600">
                      <Plus className="mr-2 h-5 w-5" />
                      ADICIONAR PRODUTO
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white border-2 border-[#D2B48C] max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-[#8B4513] text-center text-xl">
                        {editingProduct ? "EDITAR PRODUTO" : "ADICIONAR PRODUTO"}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      
                      <div className="text-center">
                        <div className="relative w-48 h-48 mx-auto mb-4">
                          {imagemUrl ? (
                            <img 
                              src={imagemUrl} 
                              alt="Preview" 
                              className="w-full h-full object-cover rounded-lg border-2 border-[#D2B48C]"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#FAF0E6] to-[#e8dfd5] rounded-lg border-2 border-dashed border-[#D2B48C] flex items-center justify-center">
                              <div className="text-center">
                                <Camera className="h-12 w-12 text-[#8B4513] mx-auto mb-2" />
                                <p className="text-[#8B4513]">Pré-visualização da imagem</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-6">
                        <div>
                          <Label htmlFor="osoti" className="text-[#5D4037] font-semibold text-lg">OSOTI (Nome do Produto)</Label>
                          <Input
                            id="osoti"
                            value={osoti}
                            onChange={(e) => setOsoTi(e.target.value)}
                            required
                            className="bg-[#FAF0E6] border-2 border-[#D2B48C] text-[#5D4037] placeholder-[#A0522D] mt-2 focus:border-[#8B4513] focus:ring-[#8B4513]"
                            placeholder="Ex: Tucumã, Açaí, etc."
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="eepethiriAhnoro" className="text-[#5D4037] font-semibold text-lg">EEPETHIRI-AHNORO (Preço)</Label>
                          <Input
                            id="eepethiriAhnoro"
                            type="number"
                            step="0.01"
                            value={eepethiriAhnoro}
                            onChange={(e) => setEepethiriAhnoro(e.target.value)}
                            required
                            className="bg-[#FAF0E6] border-2 border-[#D2B48C] text-[#5D4037] placeholder-[#A0522D] mt-2 focus:border-[#8B4513] focus:ring-[#8B4513]"
                            placeholder="0.00"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <Label className="text-[#5D4037] font-semibold text-lg">OKOMO (Imagem do Produto)</Label>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          
                            <Button
                              type="button"
                              variant="outline"
                              className="flex flex-col items-center justify-center h-24 border-2 border-[#D2B48C] text-[#8B4513] hover:bg-[#FAF0E6]"
                              onClick={() => setShowCameraDialog(true)}
                            >
                              <Camera className="h-6 w-6 mb-2" />
                              <span className="text-sm">Tirar Foto</span>
                            </Button>

                            
                            <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-[#D2B48C] rounded-md cursor-pointer hover:bg-[#FAF0E6] text-[#8B4513]">
                              <Upload className="h-6 w-6 mb-2" />
                              <span className="text-sm">Upload Imagem</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                              />
                            </label>

                            
                            <div className="col-span-1 md:col-span-1">
                              <Input
                                value={imagemUrl}
                                onChange={(e) => setImagemUrl(e.target.value)}
                                className="bg-[#FAF0E6] border-2 border-[#D2B48C] text-[#5D4037] placeholder-[#A0522D]"
                                placeholder="Cole URL da imagem"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                          <Button 
                            type="button"
                            variant="outline"
                            className="flex-1 border-2 border-[#D2B48C] text-[#8B4513] hover:bg-[#FAF0E6]"
                            onClick={() => {
                              resetForm()
                              setIsAddDialogOpen(false)
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            type="submit" 
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold border-2 border-emerald-600"
                          >
                            {editingProduct ? "ATUALIZAR PRODUTO" : "ADICIONAR PRODUTO"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
              </Card>
            </div>

            
            <div className="space-y-6">
              
              <Card className="bg-white border-2 border-[#D2B48C] rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-[#8B4513]">KARITA CEHSOM</h3> 
                  <span className="text-[#A0522D] text-xl">→</span>
                </div>

                <div className="overflow-x-auto rounded-lg border-2 border-[#8B4513] mb-6">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#8B4513] to-[#A0522D]"> 
                        <th className="py-4 px-6 text-center border-r border-[#D2B48C]"> 
                          <div>
                            <div className="font-bold text-white text-lg">OSOTI</div> 
                            <div className="text-[#D2B48C] text-sm">TIMSON</div> 
                          </div>
                        </th>
                        <th className="py-4 px-6 text-center">
                          <div>
                            <div className="font-bold text-white text-lg">YAKENON</div>
                            <div className="text-[#D2B48C] text-sm">EEPETHIRI-AHNORO</div> 
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-[#FAF0E6]"> 
                        <td className="py-4 px-6 text-center border-r border-[#D2B48C]">
                          <div className="font-bold text-[#5D4037] text-lg">Jobo silveria</div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="font-bold text-[#5D4037] text-lg">Banana</div>
                        </td>
                      </tr>
                      
                      <tr className="bg-white"> 
                        <td className="py-4 px-6 text-center border-r border-[#D2B48C]">
                          <div className="text-[#8B4513]">Farinha</div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="text-[#8B4513]">3</div>
                        </td>
                      </tr>
                      
                      <tr className="bg-[#FAF0E6]">
                        <td className="py-4 px-6 text-center border-r border-[#D2B48C]">
                          <div className="text-[#8B4513]"></div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="text-[#8B4513]">2</div>
                        </td>
                      </tr>
                      
                      <tr className="bg-white">
                        <td className="py-4 px-6 text-center border-r border-[#D2B48C]">
                          <div className="text-[#8B4513]"></div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="font-bold text-[#228B22] text-lg">312,00</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-center">
                  <Button className="bg-gradient-to-r from-[#A1887F] to-[#8D6E63] hover:from-[#8D6E63] hover:to-[#795548] text-white px-8 py-2 rounded-lg font-bold border-2 border-[#8D6E63]">
                    NENATI
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#D2B48C]">
                  <div className="text-center">
                    <div className="font-bold text-[#8B4513] text-lg">OSOTI</div>
                    <div className="text-[#A0522D] text-sm">EPETHIRI</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-[#8B4513] text-lg">YAKENON</div>
                    <div className="text-[#A0522D] text-sm">CITOPO</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {showCameraDialog && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden border-2 border-[#D2B48C]">
            <div className="p-4 border-b border-[#D2B48C] flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[#8B4513]">Tirar Foto</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#8B4513] hover:text-[#A0522D]"
                onClick={() => {
                  setShowCameraDialog(false)
                  stopCamera()
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-4">
              <div className="relative aspect-square bg-black rounded-lg overflow-hidden mb-6 border-2 border-[#D2B48C]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={capturePhoto}
                  className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-6 shadow border-2 border-emerald-600"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Capturar Foto
                </Button>
                
                <Button
                  variant="outline"
                  className="border-2 border-[#D2B48C] text-[#8B4513] hover:bg-[#FAF0E6]"
                  onClick={() => {
                    setShowCameraDialog(false)
                    stopCamera()
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
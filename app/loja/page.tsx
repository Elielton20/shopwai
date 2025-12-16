"use client"

import LojaClient from "@/components/loja-client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function LojaPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("shopwai_current_user")

    if (!userData) {
      window.location.href = "/login"
      return
    }

    const currentUser = JSON.parse(userData)
    setUser(currentUser)

    const productsData = localStorage.getItem("shopwai_products")
    if (productsData) {
      setProducts(JSON.parse(productsData))
    } else {
      const sampleProducts = [
        {
          id: "1",
          name: "Farinha de Mandioca",
          price: 15.0,
          image_url: "/farinha.png",
          vendor_id: "sample",
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Banana",
          price: 5.0,
          image_url: "/ripe-banana.png",
          vendor_id: "sample",
          created_at: new Date().toISOString(),
        },
      ]
      localStorage.setItem("shopwai_products", JSON.stringify(sampleProducts))
      setProducts(sampleProducts)
    }

    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-amber-900 text-lg">Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-amber-900 text-lg">Carregando...</div>
      </div>
    )
  }

  return <LojaClient user={user} initialProducts={products} />
}

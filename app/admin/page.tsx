"use client"

import AdminClient from "@/components/admin-client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminPage() {
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

    if (currentUser.tipo !== "vendedor") {
      window.location.href = "/loja"
      return
    }

    setUser(currentUser)

    const productsData = localStorage.getItem("shopwai_products")
    if (productsData) {
      const allProducts = JSON.parse(productsData)
      const vendorProducts = allProducts.filter((p: any) => p.vendor_id === currentUser.id)
      setProducts(vendorProducts)
    } else {
      setProducts([])
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

  return <AdminClient user={user} initialProducts={products} />
}

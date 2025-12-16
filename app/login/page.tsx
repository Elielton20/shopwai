"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [tipoUsuario, setTipoUsuario] = useState<"cliente" | "vendedor">("cliente")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const isWaiwai = tipoUsuario === "vendedor"
  const translations = {
    title: "LOGIN",
    email: "EMAIL",
    senha: isWaiwai ? "EWKACHO" : "SENHA",
    vendedor: isWaiwai ? "TMME" : "VENDEDOR",
    cliente: isWaiwai ? "ENINE" : "CLIENTE",
    button: isWaiwai ? "ENTRADA" : "ENTRAR",
    link: "Não tem conta? Cadastre-se",
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const usersData = localStorage.getItem("shopwai_users")
      const users = usersData ? JSON.parse(usersData) : []

      const user = users.find((u: any) => u.email === email && u.senha === senha && u.tipo === tipoUsuario)

      if (!user) {
        setError("Email, senha ou tipo de usuário incorreto")
        setIsLoading(false)
        return
      }

      localStorage.setItem("shopwai_current_user", JSON.stringify(user))

      if (tipoUsuario === "vendedor") {
        window.location.href = "/admin"
      } else {
        window.location.href = "/loja"
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao fazer login")
      setIsLoading(false)
    }
  }

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-700 to-amber-900 p-4">
    <Card className="w-full max-w-md bg-amber-800 border-amber-700">
      <CardHeader className="space-y-4">
        <div className="flex justify-center">
          <div className="w-22 h-22 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src="logo_shopwai.png" 
              alt="Logo da Empresa"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <CardTitle className="text-2xl text-center text-white font-bold">{translations.title}</CardTitle>
      </CardHeader>
      <CardContent>
      
       
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-sm">
                {translations.email}
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha" className="text-white text-sm">
                {translations.senha}
              </Label>
              <Input
                id="senha"
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="bg-white"
              />
            </div>

            <RadioGroup value={tipoUsuario} onValueChange={(value) => setTipoUsuario(value as "cliente" | "vendedor")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vendedor" id="vendedor" className="border-white text-white" />
                <Label htmlFor="vendedor" className="text-white cursor-pointer">
                  {translations.vendedor}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cliente" id="cliente" className="border-white text-white" />
                <Label htmlFor="cliente" className="text-white cursor-pointer">
                  {translations.cliente}
                </Label>
              </div>
            </RadioGroup>

            {error && <p className="text-sm text-red-200 bg-red-900/30 p-2 rounded">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold"
              disabled={isLoading}
            >
              {isLoading ? "..." : translations.button}
            </Button>

            <div className="text-center">
              <Link href="/cadastro" className="text-white text-sm underline">
                {translations.link}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

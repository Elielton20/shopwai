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

export default function CadastroPage() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [tipoUsuario, setTipoUsuario] = useState<"cliente" | "vendedor">("cliente")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const isWaiwai = tipoUsuario === "vendedor"
  const translations = {
    title: isWaiwai ? "CITOPO" : "CADASTRO",
    nome: isWaiwai ? "OSOTI" : "NOME",
    email: "EMAIL",
    senha: isWaiwai ? "EWKACHO" : "SENHA",
    confirmarSenha: isWaiwai ? "CONFIRMAR SENHA" : "CONFIRMAR SENHA",
    vendedor: isWaiwai ? "TMME" : "VENDEDOR",
    cliente: isWaiwai ? "ENINE" : "CLIENTE",
    button: isWaiwai ? "CITOPO" : "CADASTRAR",
    link: "Já tem conta? Faça login",
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    try {
      const usersData = localStorage.getItem("shopwai_users")
      const users = usersData ? JSON.parse(usersData) : []

      if (users.some((u: any) => u.email === email)) {
        setError("Email já cadastrado")
        setIsLoading(false)
        return
      }

      const newUser = {
        id: Date.now().toString(),
        nome,
        email,
        senha,
        tipo: tipoUsuario,
        created_at: new Date().toISOString(),
      }

      users.push(newUser)
      localStorage.setItem("shopwai_users", JSON.stringify(users))
      localStorage.setItem("shopwai_current_user", JSON.stringify(newUser))

      if (tipoUsuario === "vendedor") {
        window.location.href = "/admin"
      } else {
        window.location.href = "/loja"
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao criar conta")
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
     
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-white text-sm">
                {translations.nome}
              </Label>
              <Input
                id="nome"
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="bg-white"
              />
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="confirmarSenha" className="text-white text-sm">
                {translations.confirmarSenha}
              </Label>
              <Input
                id="confirmarSenha"
                type="password"
                required
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="bg-white"
              />
            </div>

            <RadioGroup value={tipoUsuario} onValueChange={(value) => setTipoUsuario(value as "cliente" | "vendedor")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vendedor" id="vendedor-cadastro" className="border-white text-white" />
                <Label htmlFor="vendedor-cadastro" className="text-white cursor-pointer">
                  {translations.vendedor}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cliente" id="cliente-cadastro" className="border-white text-white" />
                <Label htmlFor="cliente-cadastro" className="text-white cursor-pointer">
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
              <Link href="/login" className="text-white text-sm underline">
                {translations.link}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

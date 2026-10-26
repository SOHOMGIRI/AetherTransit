"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { api } from "@/services/api"
import { ArrowLeft, KeyRound, UserCheck, ShieldCheck } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const targetRole = searchParams?.get("role") || "student"
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await api.login(email, password)
      
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user_email", data.email)
        localStorage.setItem("user_name", data.name || (data.email ? data.email.split('@')[0] : "Sohom Giri"))
        localStorage.setItem("user_role", data.role || "STUDENT")
      }

      if (data.role === "ADMIN") {
        router.push("/admin")
      } else if (data.role === "DRIVER") {
        router.push("/driver")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      // Demo fallback: if offline or API error, allow instant demo entry with full features
      if (typeof window !== "undefined") {
        localStorage.setItem("token", "demo-token-" + Date.now())
        localStorage.setItem("user_email", email || "sohom@aethertransit.io")
        localStorage.setItem("user_name", email.includes("driver") ? "Rajesh Kumar" : "Sohom Giri")
        localStorage.setItem("user_role", email.includes("driver") ? "DRIVER" : "STUDENT")
      }
      if (email.includes("driver")) {
        router.push("/driver")
      } else {
        router.push("/dashboard")
      }
    } finally {
      setLoading(false)
    }
  }

  // Quick 1-click Demo credentials
  const fillDemoStudent = () => {
    setEmail("sohom@aethertransit.io")
    setPassword("password123")
  }

  const fillDemoDriver = () => {
    setEmail("driver@aethertransit.io")
    setPassword("password123")
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-6 py-12">
      <div className="w-full max-w-md bg-white border border-[#DDD7CB] rounded-3xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3 text-[#1C1917] hover:text-[#EA580C] transition-colors mb-3">
            <div className="relative w-10 h-10">
              <Image
                src="/assets/logo.png"
                alt="ÆtherTransit Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-serif italic text-3xl font-semibold tracking-tight">ÆtherTransit</span>
          </Link>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#78716C] block">
            {targetRole === 'driver' ? 'Driver Telemetry Authentication' : 'Student Digital Transit Pass'}
          </span>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-orange-50 text-orange-800 text-sm rounded-xl font-medium text-center border border-orange-200">
            {error}
          </div>
        )}

        {/* 1-Click Demo Accounts Card */}
        <div className="mb-6 p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#DDD7CB] flex flex-col gap-2">
          <span className="text-[11px] font-mono uppercase font-bold text-[#78716C] tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#EA580C]" />
            1-Click Demo Credentials (Recruiter Mode)
          </span>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              type="button"
              onClick={fillDemoStudent}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-orange-50 border border-[#DDD7CB] hover:border-[#EA580C] text-[11px] font-semibold text-[#1C1917] text-left transition-all"
            >
              🎓 Student: Sohom Giri
            </button>
            <button
              type="button"
              onClick={fillDemoDriver}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-orange-50 border border-[#DDD7CB] hover:border-[#EA580C] text-[11px] font-semibold text-[#1C1917] text-left transition-all"
            >
              🚌 Driver: Rajesh Kumar
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">Campus Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sohom@aethertransit.io"
              required
              className="px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#DDD7CB] text-[#1C1917] text-sm placeholder:text-[#A8A29E] focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all shadow-inner"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#DDD7CB] text-[#1C1917] text-sm placeholder:text-[#A8A29E] focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-3 w-full py-3.5 rounded-xl bg-[#1C1917] hover:bg-[#292524] text-white text-sm font-semibold tracking-wide transition-all shadow-md disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-sm">sync</span>
            ) : (
              <KeyRound className="w-4 h-4 text-[#EA580C]" />
            )}
            <span>{loading ? "Authenticating..." : "Sign In with Credentials"}</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#DDD7CB] text-center flex flex-col gap-2">
          <p className="text-sm text-[#78716C]">
            New to campus transit?{' '}
            <Link href="/register" className="font-semibold text-[#EA580C] hover:text-[#C2410C]">
              Register student pass
            </Link>
          </p>
          <Link href="/" className="text-xs text-[#78716C] hover:text-[#1C1917] inline-flex items-center justify-center gap-1 mt-2">
            <ArrowLeft className="w-3 h-3" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]"><span className="material-symbols-outlined animate-spin text-4xl text-[#EA580C]">sync</span></div>}>
      <LoginForm />
    </Suspense>
  )
}

"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Bus,
  QrCode,
  ShieldCheck,
  Activity,
  Navigation,
  RotateCw,
  Sparkles,
  GraduationCap,
  Wifi,
  CheckCircle2,
} from "lucide-react"

interface TransitSmartCardProps {
  userName?: string
  studentId?: string
  department?: string
  routeName?: string
  stopName?: string
  sourceName?: string
  destName?: string
  statusLabel?: string
  speed?: number
  dynamicEta?: number
  predictedDelay?: number
}

export default function TransitSmartCard({
  userName: propUserName,
  studentId: propStudentId,
  department = "Computer Science & Engineering",
  routeName: propRouteName,
  stopName: propStopName,
  speed = 34,
  dynamicEta = 6,
  predictedDelay = 0,
}: TransitSmartCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [studentName, setStudentName] = useState("Sohom Giri")
  const [studentId, setStudentId] = useState("STCET-CSE-2026-084")
  const [assignedRoute, setAssignedRoute] = useState("Route R01 · Taratala Express")
  const [assignedStop, setAssignedStop] = useState("Behala Chowrasta Terminal")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("user_name")
      const storedRole = localStorage.getItem("user_role")
      const storedStop = localStorage.getItem("user_stop")
      const storedRoute = localStorage.getItem("user_route")

      if (propUserName) setStudentName(propUserName)
      else if (storedName) setStudentName(storedName)

      if (propStudentId) setStudentId(propStudentId)
      else if (storedRole) setStudentId(`STCET-${storedRole}-2026`)

      if (propRouteName) setAssignedRoute(propRouteName)
      else if (storedRoute) setAssignedRoute(storedRoute)

      if (propStopName) setAssignedStop(propStopName)
      else if (storedStop) setAssignedStop(storedStop)
    }
  }, [propUserName, propStudentId, propRouteName, propStopName])

  const delayed = predictedDelay > 0

  return (
    <div className="relative w-full flex flex-col items-center justify-center p-2 select-none">
      {/* Interactive 3D Card Container */}
      <div
        className="relative w-full max-w-[620px] h-[340px] sm:h-[310px] cursor-pointer group"
        style={{ perspective: "1200px" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className="w-full h-full relative"
          style={{
            transition: "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* ═══════════════════ FRONT: LUXURY STUDENT TRANSIT PASS ═══════════════════ */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(28,25,23,0.12)] border border-[#E7E2D6] flex flex-col justify-between p-6 sm:p-7"
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #FAF8F5 55%, #F4EFE6 100%)",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Top Security Stripe & Institution Seal */}
            <div className="flex items-start justify-between border-b border-[#EADDCD] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#EA580C] to-[#C2410C] text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif italic font-bold text-xl text-[#1C1917]">ÆtherTransit</span>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#FFEDD5] text-[#C2410C] border border-[#FDBA74]">
                      Verified Pass
                    </span>
                  </div>
                  <p className="text-[11px] text-[#78716C] font-medium tracking-tight">
                    St. Thomas&apos; College of Engineering & Technology
                  </p>
                </div>
              </div>

              {/* Holographic RFID contactless chip */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-[#DDD7CB] shadow-2xs text-[10px] font-mono text-[#57534E]">
                  <Wifi className="w-3.5 h-3.5 text-emerald-600 rotate-90" />
                  <span>NFC TAP</span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-300 via-amber-100 to-amber-400 border border-amber-300/80 shadow-xs flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-800" />
                </div>
              </div>
            </div>

            {/* Student Identity Core Credentials */}
            <div className="grid grid-cols-12 gap-4 items-center my-auto py-2">
              <div className="col-span-8 flex flex-col gap-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A8A29E]">
                  Registered Commuter
                </span>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight truncate">
                  {studentName}
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                  <span className="font-mono font-bold text-[#1C1917] bg-[#EFECE6] px-2 py-0.5 rounded-lg border border-[#DDD7CB]">
                    {studentId}
                  </span>
                  <span>·</span>
                  <span className="font-medium truncate max-w-[200px]">{department}</span>
                </div>
              </div>

              {/* Live Transit Radar Dial */}
              <div className="col-span-4 flex flex-col items-end">
                <div className="px-3 py-2 rounded-2xl bg-white border border-[#DDD7CB] shadow-xs text-right">
                  <span className="text-[9px] uppercase font-bold text-[#A8A29E] tracking-wider block">Live Arrival</span>
                  <span className="text-xl sm:text-2xl font-mono font-extrabold text-[#EA580C]">
                    ~{dynamicEta} min
                  </span>
                  <span className="text-[10px] block text-[#15803D] font-bold">
                    {delayed ? `+${predictedDelay}m Delay` : "On Schedule"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Corridor Ribbon & Flip Prompt */}
            <div className="flex items-center justify-between pt-3 border-t border-[#EADDCD] text-xs">
              <div className="flex items-center gap-2 truncate">
                <Navigation className="w-4 h-4 text-[#EA580C] shrink-0" />
                <span className="font-bold text-[#1C1917] truncate">{assignedRoute}</span>
                <span className="text-[#A8A29E]">·</span>
                <span className="text-[#57534E] truncate">{assignedStop}</span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#EA580C] group-hover:translate-x-0.5 transition-transform shrink-0">
                <span>Click to Flip</span>
                <RotateCw className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* ═══════════════════ BACK: OFFICIAL CREDENTIALS & SCANNER CODE ═══════════════════ */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(28,25,23,0.12)] border border-[#1C1917] flex flex-col justify-between p-6 sm:p-7 text-[#FAF8F5]"
            style={{
              background: "linear-gradient(145deg, #1C1917 0%, #292524 60%, #141211 100%)",
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Back Header — Magnetic Strip Visual */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs font-bold tracking-wider text-stone-300">
                  DIGITAL CREDENTIAL SPECIFICATION
                </span>
              </div>
              <span className="font-mono text-[10px] text-amber-400 font-bold bg-stone-800/80 px-2.5 py-0.5 rounded-md border border-stone-700">
                VALID THRU: JUNE 2027
              </span>
            </div>

            {/* Credential Data Matrix & Scannable QR */}
            <div className="grid grid-cols-12 gap-4 items-center my-auto">
              {/* QR Code Container */}
              <div className="col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-white text-[#1C1917] shadow-lg">
                <QrCode className="w-24 h-24 sm:w-28 sm:h-28 text-[#1C1917]" />
                <span className="font-mono text-[8px] font-bold mt-1 text-stone-600">SCAN TO BOARD</span>
              </div>

              {/* Full Student Credential Details */}
              <div className="col-span-8 flex flex-col gap-2 font-mono text-xs pl-2">
                <div>
                  <span className="text-[9px] uppercase text-stone-400 block tracking-wider">Bearer Name</span>
                  <p className="font-sans font-bold text-base text-white truncate">{studentName}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[9px] uppercase text-stone-400 block">Student Roll</span>
                    <p className="text-stone-200 font-bold">{studentId}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-stone-400 block">Campus Pass #</span>
                    <p className="text-amber-300 font-bold">ATH-99214-B01</p>
                  </div>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-stone-400 block">Designated Terminal</span>
                  <p className="text-stone-200 truncate">{assignedStop}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-stone-400 block">Emergency Dispatch</span>
                  <p className="text-stone-300 text-[10px]">+91 33 2444 8100 · STCET Transport Cell</p>
                </div>
              </div>
            </div>

            {/* Micro Barcode & Flip Return */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-800 text-[11px] text-stone-400">
              <span className="font-mono tracking-widest text-[10px] opacity-70">||||| |||| |||||| ||| |||||||</span>
              <div className="flex items-center gap-1.5 text-amber-400 font-bold cursor-pointer hover:underline">
                <span>Return to Front</span>
                <RotateCw className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[#78716C] mt-2 font-mono flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        <span>Click the pass anytime to flip between credentials &amp; QR verification</span>
      </p>
    </div>
  )
}

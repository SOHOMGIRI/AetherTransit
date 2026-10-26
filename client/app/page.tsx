import Hero from "@/components/landing/Hero"
import FleetTicker from "@/components/landing/FleetTicker"
import RouteInspector from "@/components/landing/RouteInspector"
import Features from "@/components/landing/Features"
import HowItWorks from "@/components/landing/HowItWorks"
import About from "@/components/landing/About"
import Contact from "@/components/landing/Contact"

export default function LandingPage() {
  return (
    <main className="flex flex-col flex-1 bg-[#FAF7F2] text-[#1C1917] selection:bg-[#FFEDD5] selection:text-[#C2410C]">
      <Hero />
      <FleetTicker />
      <RouteInspector />
      <Features />
      <HowItWorks />
      <About />
      <Contact />
    </main>
  )
}

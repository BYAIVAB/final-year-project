import { useState, useEffect } from 'react'
import {
  Navbar,
  HeroSection,
  DashboardGrid,
  FeaturesSection,
  HowItWorksSection,
  TestimonialsSection,
  CTASection,
  Footer,
  FloatingChatButton,
  ChatPopup,
  CursorGlow,
  MyAppointmentsSection,
} from '../../features/landing'
import GridBackground from '../../components/Layout/GridBackground'

function LandingPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-arc-navy relative overflow-x-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 z-0">
        <GridBackground />
      </div>

      {/* Cursor Glow Effect */}
      <CursorGlow />

      {/* Navbar */}
      <Navbar scrollY={scrollY} onChatClick={() => setIsChatOpen(true)} />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection onChatClick={() => setIsChatOpen(true)} />

        {/* Dashboard Section - Add ID here since DashboardGrid doesn't have one */}
        <section id="dashboard" className="py-16">
          <DashboardGrid />
        </section>

        {/* Features Section - Component has its own id="features" */}
        <FeaturesSection />

        {/* How It Works Section - Component has its own id="how-it-works" */}
        <HowItWorksSection />

        {/* My Appointments Section - Shows user's upcoming appointments */}
        <MyAppointmentsSection />

        {/* Testimonials Section - Component has its own id="testimonials" */}
        <TestimonialsSection />

        {/* CTA Section */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Chat Button */}
      <FloatingChatButton 
        isOpen={isChatOpen}
        onClick={() => setIsChatOpen(!isChatOpen)} 
      />

      {/* Chat Popup */}
      <ChatPopup 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  )
}

export default LandingPage

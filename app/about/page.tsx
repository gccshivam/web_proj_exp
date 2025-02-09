"use client"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutUsPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    // Create floating particles
    if (particlesRef.current) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div')
        particle.className = 'particle'
        particle.style.setProperty('--x', `${Math.random() * 100}%`)
        particle.style.setProperty('--y', `${Math.random() * 100}%`)
        particle.style.setProperty('--duration', `${Math.random() * 20 + 10}s`)
        particle.style.setProperty('--delay', `-${Math.random() * 20}s`)
        particlesRef.current.appendChild(particle)
      }
    }

    // Animate heading with split text effect
    const heading = document.querySelector('.about-heading')
    if (heading && heading.textContent) {
      const text = heading.textContent
      heading.textContent = ''
      text.split('').forEach((char, i) => {
        const span = document.createElement('span')
        span.textContent = char
        span.style.opacity = '0'
        span.style.display = 'inline-block'
        heading.appendChild(span)
        
        gsap.to(span, {
          opacity: 1,
          rotateY: 360,
          duration: 0.8,
          delay: i * 0.1,
          ease: "back.out(1.7)"
        })
      })
    }

    // Animate cards with 3D effect
    const cards = document.querySelectorAll(".about-card")
    cards.forEach((card, index) => {
      // Initial animation
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=100",
          end: "top center",
          scrub: 1,
        },
        opacity: 0,
        scale: 0.8,
        rotateX: 20, // Reduced from 45
        z: -100, // Reduced from -300
        duration: 1.5,
      })

      // Hover animation setup with reduced rotation
      card.addEventListener('mousemove', (e) => {
        const rect = (card as HTMLElement).getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        // Reduced rotation sensitivity from /10 to /25
        const rotateX = (y - centerY) / 25
        const rotateY = (centerX - x) / 25

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
          duration: 0.5,
          ease: "power2.out"
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: "power2.out"
        })
      })
    })

    // Create morphing background effect
    const bg = document.querySelector('.morphing-bg')
    if (bg) {
      gsap.to(bg, {
        backgroundPosition: '100% 100%',
        duration: 20,
        repeat: -1,
        ease: "none"
      })
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  // Rest of the component remains the same...
  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden perspective">
      {/* Morphing background */}
      <div className="morphing-bg absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-br from-blue-500/30 to-cyan-500/30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 0% 0%, rgba(104, 171, 237, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 100% 0%, rgba(47, 124, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(82, 157, 231, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 0% 100%, rgba(127, 185, 241, 0.1) 0%, transparent 50%)
          `,
          backgroundSize: '200% 200%',
          filter: 'blur(80px)'
        }}
      />

      {/* Floating particles container */}
      <div ref={particlesRef} className="particles-container absolute inset-0 pointer-events-none" />

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="about-heading text-5xl md:text-6xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
          About HealthBuddy
        </h1>

        <div className="space-y-16">
          <Card className="about-card transform-gpu transition-all duration-300 hover:shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                At HealthBuddy, our mission is to revolutionize healthcare accessibility through innovative technology. 
                We believe that quality healthcare should be available to everyone, anywhere, at any time. Through our 
                platform, we're breaking down traditional barriers and creating a seamless connection between patients 
                and healthcare providers.
              </p>
            </CardContent>
          </Card>

          <Card className="about-card transform-gpu transition-all duration-300 hover:shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-500 bg-clip-text text-transparent">
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                We envision a future where healthcare is not just reactive, but proactive and personalized. By leveraging 
                cutting-edge technology and artificial intelligence, we're creating a healthcare ecosystem that anticipates 
                needs, provides timely interventions, and ensures optimal health outcomes for all our users.
              </p>
            </CardContent>
          </Card>

          <Card className="about-card transform-gpu transition-all duration-300 hover:shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Our Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                Behind HealthBuddy stands a diverse team of visionaries, including experienced healthcare professionals, 
                innovative technologists, and dedicated customer experience specialists. Our team combines decades of 
                medical expertise with cutting-edge technical knowledge to deliver a healthcare platform that truly 
                understands and meets your needs.
              </p>
            </CardContent>
          </Card>

          <Card className="about-card transform-gpu transition-all duration-300 hover:shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-500 bg-clip-text text-transparent">
                Our Commitment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                Your health and privacy are our top priorities. We uphold the highest standards of medical ethics and 
                data security, ensuring that your personal health information remains confidential and protected. We're 
                constantly evolving, incorporating user feedback and the latest technological advancements to provide 
                you with the best possible healthcare experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

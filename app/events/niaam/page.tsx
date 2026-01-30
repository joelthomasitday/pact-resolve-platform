"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Award, 
  MapPin, 
  Search, 
  ChevronRight, 
  Scale, 
  GraduationCap, 
  Building2, 
  Users,
  Star,
  Download,
  Calendar,
  Trophy,
  ArrowRight,
  Maximize2,
  X,
  ExternalLink,
  Zap,
  Medal,
  Sparkles
} from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { GrainOverlay } from "@/components/grain-overlay";
import { FadeIn, FadeInUp, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";
import { Footer } from "@/components/footer";
import { MagneticButton } from "@/components/magnetic-button";
import { Collaborators } from "@/components/sections/home/collaborators";
import { cn } from "@/lib/utils";
import { AwardRecipient, NationalImpactAward } from "@/lib/db/schemas";

// --- Reusable Section Header ---
const SectionHeader = ({ subtitle, title, description, light = false, center = false }: { subtitle: string, title: string, description?: string, light?: boolean, center?: boolean }) => (
  <FadeInUp className={cn("mb-8 sm:mb-12 md:mb-20", center ? "flex flex-col items-center text-center" : "")}>
    <div className="inline-flex items-center gap-2 sm:gap-4 mb-3 sm:mb-6 opacity-80">
      <div className={cn("h-px w-8 sm:w-12 bg-gold-500", light ? "bg-gold-500" : "bg-gold-500/50")} />
      <span className={cn("text-[10px] sm:text-[11px] md:text-xs font-mono tracking-[0.2em] sm:tracking-[0.4em] uppercase font-bold", light ? "text-gold-500" : "text-navy-950/60")}>{subtitle}</span>
    </div>
    <h2 className={cn("text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-[5rem] font-light tracking-tight mb-4 sm:mb-6 md:mb-8 leading-[1.1] sm:leading-[0.95]", light ? "text-white" : "text-navy-950")}>
      {title.split(' ').map((word, i) => (
        <span key={i} className={cn(
          word.toLowerCase() === 'awards' || 
          word.toLowerCase() === 'excellence' || 
          word.toLowerCase() === 'impact' || 
          word.toLowerCase() === 'national' ? "text-gold-500 italic font-medium" : ""
        )}>
          {word}{' '}
        </span>
      ))}
    </h2>
    {description && (
      <p className={cn("max-w-4xl text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-light leading-relaxed px-2 sm:px-0", light ? "text-white/70" : "text-navy-950/50")}>
        {description}
      </p>
    )}
  </FadeInUp>
);

export default function NIAAMPage() {
  const [eventData, setEventData] = useState<NationalImpactAward | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch("/api/content/awards-event");
        const result = await res.json();
        if (result.success && result.data && !Array.isArray(result.data)) {
          setEventData(result.data);
        }
      } catch (e) {
        console.error("Failed to fetch awards data", e);
      }
    }
    fetchEvent();
  }, []);

  const awardees: AwardRecipient[] = eventData?.recipients?.length ? eventData.recipients : [
    { name: "Adv. Tanu Mehta", city: "Mumbai", category: "Mediation Education", year: "2025" },
    { name: "Justice Mohan Lal Mehta", city: "New Delhi", category: "Mediation Institution Building", year: "2025" },
    { name: "Raj Panchmatia", city: "Mumbai", category: "Mediation Advocacy", year: "2025" },
    { name: "Adv. Veena Ralli", city: "New Delhi", category: "Mediation Practice", year: "2025" },
    { name: "Adv. J P Sengh", city: "New Delhi", category: "Mediation Practice", year: "2024" },
    { name: "Justice A K Sikri", city: "New Delhi", category: "Mediation Advocacy", year: "2024" },
    { name: "Adv. Pusshp Gupta", city: "New Delhi", category: "Mediation Education", year: "2024" },
    { name: "Adv. Sudhanshu Batra", city: "New Delhi", category: "Mediation Practice", year: "2024" },
    { name: "Justice Kurian Joseph", city: "New Delhi", category: "Mediation Advocacy", year: "2024" },
    { name: "A J Jawad", city: "Hyderabad", category: "Mediation Education", year: "2023" },
    { name: "Justice Tejas Karia", city: "New Delhi", category: "Mediation Advocacy", year: "2023" },
    { name: "Laila Ollapally", city: "Bengaluru", category: "Mediation Practice", year: "2023" },
    { name: "Justice Gita Mittal", city: "New Delhi", category: "Mediation Advocacy", year: "2023" },
    { name: "Chitra Narayan", city: "Chennai", category: "Mediation Education", year: "2023" },
    { name: "Adv. Sadhana Ramachandran", city: "New Delhi", category: "Mediation Practice", year: "2023" },
    { name: "Adv. Sriram Panchu", city: "Chennai", category: "Mediation Practice", year: "2023" },
    { name: "Adv. Niranjan Bhat (Post-humously)", city: "Ahmedabad", category: "Mediation Practice", year: "2023" }
  ];

  const galleryItems = eventData?.gallery?.length ? eventData.gallery : [
    { url: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80", title: "Ceremonial Moment 1", description: "Celebrating the advancement of mediation excellence in India." },
    { url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80", title: "Ceremonial Moment 2", description: "Celebrating the advancement of mediation excellence in India." },
    { url: "https://images.unsplash.com/photo-1523287562758-66c7fc58967f?auto=format&fit=crop&q=80", title: "Ceremonial Moment 3", description: "Celebrating the advancement of mediation excellence in India." },
    { url: "https://images.unsplash.com/photo-1475721027187-4024733923f9?auto=format&fit=crop&q=80", title: "Ceremonial Moment 4", description: "Celebrating the advancement of mediation excellence in India." },
    { url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80", title: "Ceremonial Moment 5", description: "Celebrating the advancement of mediation excellence in India." },
    { url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80", title: "Ceremonial Moment 6", description: "Celebrating the advancement of mediation excellence in India." }
  ];

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-navy-950 text-white">
      <GrainOverlay />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 sm:pt-32 sm:pb-20 md:pt-40 md:pb-32 bg-navy-950 overflow-hidden dark">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80"
            alt="NIAAM Header"
            fill
            className="object-cover opacity-20 scale-105"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-navy-950/40 via-navy-950/90 to-navy-950" />
          <div className="absolute inset-0 bg-linear-to-r from-navy-950 via-transparent to-transparent opacity-80" />
          
          {/* Subtle Accent Glows */}
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gold-500/5 blur-[120px] rounded-full translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full -translate-x-1/2 pointer-events-none" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full">
          <FadeInUp>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-gold-500" />
              <span className="text-gold-500 font-mono text-xs tracking-[0.4em] uppercase font-bold">
                Honouring Excellence
              </span>
            </div>
            <h1 className="text-[12vw] sm:text-[10vw] md:text-[8.5rem] font-extrabold text-white tracking-tighter leading-[0.8] mb-16 select-none italic uppercase">
              NATIONAL <br />
              IMPACT <br />
              <span className="text-gold-500">AWARDS</span> 
            </h1>
            
            <div className="max-w-5xl space-y-12">
              <div className="space-y-8">
                <p className="text-2xl sm:text-3xl md:text-5xl text-white/95 font-light leading-[1.1] tracking-tight">
                  A prestigious platform built to honour individuals who have meaningfully strengthened the growth of mediation in India.
                </p>
                <p className="text-xl md:text-2xl text-white/70 font-light max-w-3xl leading-relaxed">
                  Through advocacy, institution-building, education and practice leadership, these awardees define the benchmark of excellence.
                </p>

                <div className="flex flex-wrap gap-6 pt-12">
                  <MagneticButton variant="primary" size="lg" className="group px-10 py-5">
                    <a href="#about" className="flex items-center gap-3 text-lg">
                       Explore the Award <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </MagneticButton>
                  <MagneticButton variant="secondary" size="lg" className="group px-10 py-5">
                    <a href="#awardees" className="flex items-center gap-3 text-lg">
                       View Hall of Fame <Medal className="w-5 h-5" />
                    </a>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

   {/* About the Award Section */}
      <section id="about" className="py-12 sm:py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none text-navy-950/5">
           <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 blur-[120px] rounded-full opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">
          <SectionHeader 
            subtitle="The Benchmark" 
            title="About the ImPACT Awards" 
            center
            description="The National ImPACT Awards for Advancement of Mediation in India recognizes extraordinary contributions across four core pillars of the mediation ecosystem."
          />

          <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-16">
            {/* Cinematic Feature Image */}
            <FadeInUp className="relative group">
              <div className="absolute -inset-6 sm:-inset-10 bg-gold-500/5 blur-3xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative aspect-video md:aspect-21/9 rounded-2xl sm:rounded-3xl md:rounded-[3rem] lg:rounded-[4rem] overflow-hidden bg-navy-50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] sm:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] ring-1 ring-navy-950/5">
                <Image 
                  src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=80"
                  alt="Ceremony Highlights"
                  fill
                  className="object-cover transition-transform duration-2000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-navy-950/10 to-transparent" />
                
                {/* Niaam Badge - Top Right */}
                <div className="absolute top-3 right-3 sm:top-6 sm:right-6 md:top-8 md:right-8 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full bg-navy-950 flex flex-col items-center justify-center text-center shadow-xl sm:shadow-2xl border-2 sm:border-3 md:border-4 border-gold-500/30">
                   <span className="text-gold-500 font-bold text-[10px] sm:text-sm md:text-xl leading-none italic uppercase">Niaam</span>
                   <span className="text-[4px] sm:text-[5px] md:text-[7px] text-white/40 uppercase tracking-[0.25em] sm:tracking-[0.4em] font-bold mt-0.5 sm:mt-1">Found. 2023</span>
                </div>
              </div>
            </FadeInUp>

            {/* Floating Benchmark Card - OUTSIDE image on mobile, overlapping on desktop */}
            <FadeInUp className="-mt-12 sm:-mt-16 md:-mt-20 px-4 sm:px-6 md:px-0">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative md:ml-12 lg:ml-16 p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-2xl md:rounded-3xl bg-white backdrop-blur-xl border border-navy-950/10 shadow-2xl max-w-full sm:max-w-[320px] md:max-w-[360px]"
              >
                <div className="flex items-center gap-3 sm:gap-4 text-left">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 shadow-lg shrink-0">
                    <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-navy-950/40 font-bold mb-1">Benchmark</p>
                    <p className="text-base sm:text-lg md:text-xl font-bold text-navy-950 tracking-tight leading-tight">Annual Conferment</p>
                  </div>
                </div>
              </motion.div>
            </FadeInUp>

            {/* Four Pillars Grid */}
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {[
                { 
                  icon: Users, 
                  title: "Advocacy", 
                  desc: "Addressing courts, communities, and corporates to explore mediation at all levels." 
                },
                { 
                  icon: Building2, 
                  title: "Institution Building", 
                  desc: "Leading the development of mediation centres and court-annexed programs." 
                },
                { 
                  icon: GraduationCap, 
                  title: "Education", 
                  desc: "Dedication to quality training and teaching modules for future professionals." 
                },
                { 
                  icon: Scale, 
                  title: "Practice", 
                  desc: "Demonstrating excellence and innovation as a mediator across diverse sectors." 
                }
              ].map((item, i) => (
                <StaggerItem key={i}>
                  <div className="group relative h-full p-6 sm:p-7 md:p-8 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] bg-navy-50/50 border border-transparent hover:border-gold-500/30 hover:bg-white hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden text-center flex flex-col items-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center mb-4 sm:mb-5 md:mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 text-gold-500 border border-navy-100">
                      <item.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="text-base sm:text-lg md:text-xl font-bold text-navy-950 tracking-tight leading-none group-hover:text-gold-500 transition-colors uppercase italic">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-navy-950/50 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* NIAAM 2026 Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-navy-950 relative overflow-hidden dark">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image 
            src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80"
            alt="Venue Preview"
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">
          <div className="max-w-4xl mx-auto rounded-3xl sm:rounded-[4rem] bg-white/5 backdrop-blur-xl border border-white/10 p-10 sm:p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 blur-3xl rounded-full" />
              <FadeInUp>
                 <SectionHeader subtitle="Upcoming Edition" title="NIAAM 2026" light center />
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8">
                    {[
                      { label: "Dates", value: "To Be Announced", icon: Calendar },
                      { label: "Venue", value: "To Be Announced", icon: MapPin },
                      { label: "Awardees", value: "To Be Announced", icon: Trophy }
                    ].map((info) => (
                      <div key={info.label} className="flex flex-col items-center gap-4 group">
                         <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-gold-500 border border-white/10 group-hover:scale-110 transition-transform">
                            <info.icon className="w-6 h-6" />
                         </div>
                         <div className="space-y-1">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 font-bold">{info.label}</span>
                            <p className="text-xl font-light text-white italic">{info.value}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </FadeInUp>
          </div>
        </div>
      </section>

      {/* Hall of Honorary Recipients - Interactive Bar */}
      <section id="awardees" className="py-16 sm:py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-10 sm:mb-16">
          <SectionHeader subtitle="Recognition" title="Hall of Honorary Recipients" center />
        </div>
        
        <div className="relative group/hall">
          {/* Subtle gradient edges for the scrollable container */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex overflow-x-auto no-scrollbar pb-8 snap-x scroll-smooth outline-none focus:outline-none scrollbar-thin scrollbar-track-navy-50 scrollbar-thumb-gold-500/50">
             <div className="flex gap-4 sm:gap-6 px-6 sm:px-12 md:px-24">
                {awardees.map((awardee, i) => (
                   <FadeInUp key={i} delay={i * 0.05} className="snap-center">
                      <div className="w-[260px] sm:w-[320px] md:w-[420px] group relative p-5 sm:p-8 rounded-3xl sm:rounded-[3rem] bg-navy-50 border border-navy-100 hover:border-gold-500/50 hover:bg-white hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col justify-between h-[280px] sm:h-[340px] md:h-[380px] overflow-hidden">
                        {/* Background Year Accent */}
                        <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 text-[5rem] sm:text-[8rem] md:text-[10rem] font-black text-navy-950/3 group-hover:text-gold-500/5 transition-colors leading-none italic select-none">
                           {awardee.year}
                        </div>

                        <div className="relative z-10">
                          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
                            <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-gold-500" />
                            <span className="text-[8px] sm:text-[10px] font-mono font-bold text-gold-500 tracking-[0.3em] sm:tracking-[0.4em] uppercase">
                                NIAAM Honoree
                            </span>
                          </div>
                          
                          <h3 className="text-xl sm:text-3xl md:text-5xl font-light text-navy-950 leading-[0.9] tracking-tighter mb-4 italic group-hover:text-gold-500 transition-colors uppercase">
                             {awardee.name.split(' ').map((part, idx) => (
                               <span key={idx} className="block">{part}</span>
                             ))}
                          </h3>
                        </div>

                        <div className="relative z-10 space-y-4 sm:space-y-6">
                           <div className="h-px w-10 sm:w-12 bg-gold-500/30 group-hover:w-full transition-all duration-700" />
                           <div className="flex flex-col gap-1">
                               <span className="text-[9px] sm:text-[10px] font-mono text-navy-950/30 uppercase tracking-[0.2em] font-bold">Category</span>
                               <p className="text-sm sm:text-lg font-light text-navy-950/60 group-hover:text-navy-950 transition-colors">{awardee.category}</p>
                           </div>
                           
                           <div className="flex items-center gap-2 text-navy-950/20 group-hover:text-navy-950/40 transition-colors">
                              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] font-bold">{awardee.city}</span>
                           </div>
                        </div>
                        
                        {/* Interactive Sparkle on Hover */}
                        <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                           <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-gold-500/20 animate-pulse" />
                        </div>
                      </div>
                   </FadeInUp>
                ))}
             </div>
          </div>
          
          {/* Scroll Hint & Custom Scrollbar Indicator */}
          <div className="flex flex-col items-center gap-6 mt-4">
             <div className="flex items-center gap-3 text-navy-950/20 group/hint">
                <div className="h-px w-8 sm:w-12 bg-navy-100 group-hover/hint:w-16 transition-all duration-500" />
                <div className="flex items-center gap-2">
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.3em] font-bold text-navy-950/40">Swipe to explore</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-3 h-3 text-gold-500" />
                  </motion.div>
                </div>
                <div className="h-px w-8 sm:w-12 bg-navy-100 group-hover/hint:w-16 transition-all duration-500" />
             </div>

             {/* Visual Scrollbar Detail */}
             <div className="w-32 h-1 bg-navy-100 rounded-full overflow-hidden relative">
                <motion.div 
                   className="absolute left-0 top-0 h-full bg-gold-500"
                   initial={{ width: "20%" }}
                   whileInView={{ width: "100%" }}
                   transition={{ duration: 2, ease: "easeOut" }}
                />
             </div>
          </div>
        </div>
      </section>

      {/* Ceremonial Clicks Section */}
      <section className="pt-16 md:pt-24 pb-6 sm:pb-12 md:pb-20 bg-white border-t border-navy-100/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-16">
          <SectionHeader subtitle="Gallery" title="Ceremonial Clicks" center />
        </div>
        
        <div className="w-full">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            className="w-full relative group/carousel"
          >
            <CarouselContent className="-ml-4 md:ml-0">
                {galleryItems.map((item, i) => (
                  <CarouselItem key={i} className="pl-4 md:pl-0 basis-[90%] md:basis-[70%] lg:basis-[60%] px-2 md:px-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="w-full text-left group/image relative outline-hidden cursor-pointer">
                          <div className="aspect-16/10 md:aspect-21/9 w-full relative rounded-5xl md:rounded-[4rem] overflow-hidden bg-navy-900/10 shadow-2xl group-hover/image:shadow-gold-500/20 transition-all duration-1000">
                            <Image 
                              src={item.url}
                              alt={item.title || `Ceremony Moment ${i + 1}`}
                              fill
                              className="object-cover transition-transform duration-2000 group-hover/image:scale-105"
                            />
                          <div className="absolute inset-0 bg-navy-950/20 group-hover/image:bg-navy-950/10 transition-colors duration-700" />
                          
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-700 bg-navy-950/30 backdrop-blur-[2px]">
                            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center scale-75 group-hover/image:scale-100 transition-transform duration-700">
                              <Maximize2 className="w-8 h-8 text-white" />
                            </div>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 bg-linear-to-t from-navy-950/80 via-navy-950/40 to-transparent translate-y-6 group-hover/image:translate-y-0 opacity-0 group-hover/image:opacity-100 transition-all duration-700">
                            <span className="text-gold-500 font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold mb-3 block">NIAAM Collection</span>
                            <h4 className="text-2xl md:text-5xl font-bold text-white tracking-tighter leading-none mb-4 italic">{item.title || `Ceremonial Moment ${i + 1}`}</h4>
                            <p className="text-base md:text-xl text-white/70 font-light max-w-2xl line-clamp-1">{item.description || "Celebrating the advancement of mediation excellence in India."}</p>
                          </div>
                        </div>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-none! w-screen h-screen p-0 m-0 border-none bg-black/90 backdrop-blur-3xl shadow-none focus:outline-hidden flex items-center justify-center z-100">
                      <DialogTitle className="sr-only">{item.title || `Ceremony Moment ${i + 1}`}</DialogTitle>
                      <div className="relative w-[96vw] h-[85vh] rounded-4xl md:rounded-[6rem] overflow-hidden bg-navy-950 shadow-[0_0_150px_rgba(0,0,0,0.6)] border border-white/10 group/modal transition-all duration-700">
                        <DialogClose className="absolute top-8 right-8 z-50 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-gold-500 hover:text-navy-950 hover:scale-110 transition-all duration-500 shadow-2xl group/close">
                          <X className="w-8 h-8 group-hover/close:rotate-90 transition-transform duration-500" />
                        </DialogClose>

                          <Image 
                            src={item.url}
                            alt={item.title || `Ceremony Moment ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:modal:scale-105"
                            quality={100}
                          />
                        
                        <div className="absolute inset-x-0 bottom-0 p-10 md:p-24 bg-linear-to-t from-black/90 via-black/20 to-transparent transition-all duration-700 opacity-0 group-hover:modal:opacity-100 translate-y-8 group-hover:modal:translate-y-0">
                           <div className="max-w-7xl mx-auto">
                            <span className="text-gold-500 font-mono text-xs md:text-sm tracking-[0.6em] uppercase font-bold mb-6 block">NIAAM Archive</span>
                            <h3 className="text-4xl md:text-[8rem] font-bold text-white tracking-tighter leading-[0.8] mb-8 italic">National ImPACT Awards</h3>
                            <p className="text-xl md:text-3xl text-white/70 font-light leading-relaxed max-w-4xl">{item.description || "A look back at the moments that define the benchmark of excellence in mediation across India."}</p>
                           </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="flex items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-12 md:mt-16">
              <CarouselPrevious className="static translate-y-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full border-navy-100 bg-navy-50 text-navy-950 hover:bg-gold-500 hover:text-navy-950 hover:border-gold-500 transition-all shadow-xl hover:-translate-x-1" />
              <div className="h-px w-12 sm:w-24 bg-navy-100" />
              <CarouselNext className="static translate-y-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full border-navy-100 bg-navy-50 text-navy-950 hover:bg-gold-500 hover:text-navy-950 hover:border-gold-500 transition-all shadow-xl hover:translate-x-1" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Collaborators Section */}
      <div className="bg-white pb-6 sm:pb-12 md:pb-20">
        <Collaborators />
      </div>

      <Footer />
    </main>
  );
}

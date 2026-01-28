"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Handshake, 
  Lock, 
  Home, 
  MessageSquare, 
  Calendar, 
  Sparkles, 
  Timer, 
  Scale, 
  FileText,
  ArrowRight,
  Plus,
  ArrowUpRight,
  Building2,
  Briefcase,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn, FadeInUp } from "@/components/motion-wrapper";
import { GrainOverlay } from "@/components/grain-overlay";
import { Footer } from "@/components/footer";

// --- Components ---

const SectionHeader = ({ subtitle, title, description, light = false, center = false }: { subtitle: string, title: string, description?: string, light?: boolean, center?: boolean }) => (
  <FadeInUp className={cn("mb-8 md:mb-16", center ? "flex flex-col items-center text-center" : "")}>
    <div className="inline-flex items-center gap-4 mb-4 opacity-70">
      <span className={cn("text-[10px] md:text-xs font-mono tracking-[0.4em] uppercase", light ? "text-white" : "text-navy-950")}>{subtitle}</span>
      <div className={cn("h-px w-8 bg-gold-500/50", light ? "bg-gold-500" : "bg-gold-500")} />
    </div>
    <h2 className={cn("text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter mb-4 sm:mb-6 leading-[1.1]", light ? "text-white" : "text-navy-950")}>
      {title}
    </h2>
    {description && (
      <p className={cn("max-w-2xl text-base sm:text-lg md:text-xl font-light leading-relaxed", light ? "text-white/60" : "text-navy-950/60")}>
        {description}
      </p>
    )}
  </FadeInUp>
);

const WhyMediateHero = () => (
  <section className="relative min-h-[60vh] flex items-center pt-24 pb-16 md:pt-32 md:pb-20 bg-navy-950 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <Image
        src="/hero/hero_mediation.png"
        alt="Why Mediate"
        fill
        className="object-cover opacity-30 scale-105"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-b from-navy-950/40 via-navy-950/90 to-navy-950" />
      <div className="absolute inset-0 bg-linear-to-r from-navy-950 via-transparent to-transparent opacity-80" />
    </div>
    
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 w-full">
      <FadeInUp>
        <div className="flex items-center gap-3 mb-4 sm:mb-6 md:mb-8">
          <div className="h-px w-8 md:w-12 bg-gold-500" />
          <span className="text-gold-500 font-mono text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase">
            Mediation / Why Mediate
          </span>
        </div>
        <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-[8rem] font-bold text-white tracking-tighter leading-[0.9] md:leading-[0.8] mb-8 md:mb-12 select-none italic">
          WHY MEDIATE
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div className="space-y-6 md:space-y-8">
            <p className="text-lg sm:text-2xl md:text-3xl text-white/90 font-light leading-tight tracking-tight">
              A trendsetter in Mediation Process Design, PACT relies on bespoke case management, quality mediators and best practices for client satisfaction.
            </p>
            <div className="h-px w-full bg-white/10" />
            <p className="text-base md:text-lg text-white/70 font-light max-w-xl leading-relaxed">
              Mediation is an effective conflict resolution mechanism that prioritises efficiency, autonomy and confidentiality. It reduces procedural delays, limits adversarial confrontation, and facilitates consensus-driven outcomes. With the support of an impartial mediator, parties can explore practical solutions, protect ongoing relationships, and achieve outcomes that works for everyone involved.
            </p>
          </div>
          <div className="relative group hidden lg:block">
            <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative p-10 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
              <p className="text-xl text-white/70 font-light italic leading-relaxed">
                "With the support of an impartial mediator, parties can explore practical solutions, protect ongoing relationships, and achieve outcomes that work for everyone involved."
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-gold-500" />
                </div>
                <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Global Standards of Practice</span>
              </div>
            </div>
          </div>
        </div>
      </FadeInUp>
    </div>
  </section>
);

const PuzzlePieces = () => {
  const points = [
    { 
      title: "Engage Your Own Neutral Mediator", 
      desc: "Curate and appoint qualified professionals who embody absolute neutrality.", 
      icon: Users 
    },
    { 
      title: "Participate Freely and Voluntarily", 
      desc: "Retain complete autonomy with a process driven by sincere engagement.", 
      icon: Handshake 
    },
    { 
      title: "Keep Conversations Confidential", 
      desc: "A secure environment protected under strict institutional and legal safeguards.", 
      icon: Lock 
    },
    { 
      title: "Choose Your Own Private Venue", 
      desc: "Select a location that suits your needs, from our chambers to your preferred site.", 
      icon: Home 
    },
    { 
      title: "Select Your Mode of Communication", 
      desc: "Adapt the dialogue process to fit the unique communication styles of all parties.", 
      icon: MessageSquare 
    },
    { 
      title: "Decide on a Convenient Time & Date", 
      desc: "Coordinate sessions around your timeline to ensure focused and productive progress.", 
      icon: Calendar 
    },
    { 
      title: "Design Your Own Comfortable Process", 
      desc: "Experience a bespoke resolution framework tailored to your specific case dynamics.", 
      icon: Sparkles 
    },
    { 
      title: "Fix Your Own Timelines and Deadlines", 
      desc: "Stay in control of the clock with schedules that respect your commercial urgencies.", 
      icon: Timer 
    },
    { 
      title: "Create Your Own Legal Solutions", 
      desc: "Maintain sovereignty over the outcome by crafting your own binding agreements.", 
      icon: Scale 
    },
    { 
      title: "Confirm An Affordable Fee Structure", 
      desc: "Benefit from complete financial clarity with a transparent, pre-defined fee model.", 
      icon: FileText 
    }
  ];

  return (
    <section className="pt-12 pb-16 sm:pt-16 sm:pb-24 md:pb-40 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="text-center mb-12 sm:mb-20 md:mb-32">
          <FadeInUp>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-navy-50 border border-navy-100 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
              <span className="text-[10px] md:text-xs font-mono tracking-[0.4em] uppercase text-navy-950/60 font-bold">The PACT Advantage</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-[5.5rem] font-extralight tracking-tight text-navy-950 mb-8 leading-[0.95]">
              Why Mediate at <br />
              <span className="italic font-medium text-gold-500">PACT</span>
            </h2>
            <div className="h-px w-24 bg-gold-500/30 mx-auto mb-8" />
            <p className="text-lg sm:text-xl md:text-2xl text-navy-950/40 font-light max-w-3xl mx-auto leading-relaxed tracking-tight">
              Merging institutional rigour with party-centric flexibility. 
              We provide the framework; you retain the control.
            </p>
          </FadeInUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {points.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <div className="relative h-full px-6 py-8 sm:px-8 sm:py-10 md:py-12 rounded-5xl bg-navy-50/20 border border-navy-100/30 hover:bg-white hover:border-gold-500/20 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col items-center text-center">
                <div className="absolute -bottom-6 -right-4 text-[8rem] font-bold text-navy-950/1.5 group-hover:text-gold-500/4 transition-all duration-1000 italic select-none pointer-events-none">
                  {i + 1 < 10 ? `0${i + 1}` : i + 1}
                </div>
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-3xl bg-white text-navy-950 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-white transition-all duration-500 group-hover:rotate-12 shadow-md border border-navy-100/50">
                    <point.icon className="w-8 h-8" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gold-500 scale-0 group-hover:scale-100 transition-transform duration-500 border-[3px] border-white shadow-sm" />
                </div>
                <div className="grow space-y-4 relative z-10 w-full">
                  <h3 className="text-2xl md:text-3xl font-light text-navy-950 tracking-tighter leading-tight italic group-hover:text-gold-500 transition-colors duration-500 uppercase">
                    {point.title}
                  </h3>
                  <div className="h-px w-10 bg-navy-100 group-hover:w-16 bg-gold-500/30 group-hover:bg-gold-500 transition-all duration-700 mx-auto" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PactProvides = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      title: "CONVENING",
      label: "Meetings to Rebuild Relationships",
      icon: Users,
      description: "PACT accelerates structured and confidential meetings, preserving privacy and confidentiality from the get go. Clear procedural guidelines are established at the outset. The Mediation Convenor works with both sides to build trust with the process, the neutrals and the institution."
    },
    {
      title: "COACHING",
      label: "Parties to follow Collaborative Standards",
      icon: MessageSquare,
      description: "The Mediation Convenor assists parties and counsel in developing a collaborative approach in their communications, especially through the signing of the Mediation Agreement and drafting of the Mediation Brief / Strategy. Measures are employed to maintain fair and safe participation."
    },
    {
      title: "FACILITATING",
      label: "Communication and Identifying Interests",
      icon: Scale,
      description: "The Mediator facilitates discussions to identify underlying interests of the parties. Legal, commercial and relational concerns are explored. Each party is offered a chance to be heard. Key issues are clarified and organised. Respectful expression of emotions is encouraged, and hostile language is reframed."
    },
    {
      title: "EVALUATING",
      label: "Options and Alternatives",
      icon: Briefcase,
      description: "The mediator supports parties in evaluating options against objective standards and practical alternatives. Legal frameworks, risks, and implications are considered. The mediator does not impose outcomes. Parties are assisted in making informed choices. Decision-making is voluntary and reasoned."
    },
    {
      title: "CONSTRUCTING",
      label: "Commitment-Based Solutions",
      icon: Building2,
      description: "The mediator assists parties in developing clear and workable solutions. Agreements are based on voluntary and informed commitments. Outcomes are structured for clarity and implementation. Party autonomy is preserved. This strengthens compliance and durability."
    },
    {
      title: "CLOSING",
      label: "Closing the Process",
      icon: Lock,
      description: "The mediation concludes with a structured review of outcomes. Agreements are confirmed for shared understanding. Future engagement is addressed where appropriate. The process closes with clarity and neutrality. Institutional confidence in mediation is upheld."
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-navy-950 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-500/5 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <SectionHeader 
          subtitle="PACT Provides" 
          title="Total Commitment to Efficient Resolution"
          description="[JAMS Style Resolution Roadmap]"
          light
        />

        <div className="mt-12 space-y-3">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "group relative overflow-hidden rounded-3xl md:rounded-[2rem] border transition-all duration-500",
                activeStep === i 
                  ? "bg-white/10 border-gold-500 shadow-[0_0_30px_-10px_rgba(191,154,102,0.1)]" 
                  : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
              )}
            >
              <button
                onClick={() => setActiveStep(i)}
                className="w-full flex items-center justify-between p-4 sm:p-5 md:p-6 md:pr-8 text-left relative z-10"
              >
                <div className="flex items-center gap-4 md:gap-8 shrink-0">
                  <span className={cn(
                    "font-mono text-lg md:text-2xl transition-colors duration-500",
                    activeStep === i ? "text-gold-500 font-medium" : "text-white/20"
                  )}>
                    {i + 1}.
                  </span>
                  
                  <h3 className={cn(
                    "text-lg sm:text-xl md:text-3xl font-light transition-colors duration-500 tracking-tight",
                    activeStep === i ? "text-white" : "text-white/60 group-hover:text-white/80"
                  )}>
                    {step.title}
                  </h3>
                </div>

                <div className="hidden md:flex items-center gap-6 px-8 grow opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                   <div className={cn("h-px grow transition-all duration-500", activeStep === i ? "bg-gold-500/50" : "bg-white/10")} />
                   <span className={cn(
                     "font-mono text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-colors duration-300",
                     activeStep === i ? "text-gold-500" : "text-white/30"
                   )}>
                     {step.label}
                   </span>
                </div>

                <div className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 shrink-0 ml-4 relative z-20 bg-navy-950 shadow-lg",
                  activeStep === i 
                    ? "bg-gold-500 border-gold-500 text-navy-950 rotate-90 scale-110" 
                    : "text-white/30 group-hover:border-white/30 group-hover:text-white"
                )}>
                  {activeStep === i ? <ArrowRight className="w-4 h-4 md:w-5 md:h-5" /> : <Plus className="w-4 h-4 md:w-5 md:h-5" />}
                </div>
              </button>

              <AnimatePresence>
                {activeStep === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="px-4 md:px-6 pb-6 md:pb-8 pl-4 sm:pl-[3.5rem] md:pl-[6rem]">
                      <div className="h-px w-full bg-white/5 mb-4 md:mb-6" />
                      <p className="text-base md:text-lg text-white/60 font-light leading-relaxed max-w-4xl">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Checklist = () => (
  <section className="pt-16 pb-24 bg-white relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 text-center">
      <SectionHeader 
        subtitle="Write to us: mediation@thepact.in" 
        title="Check If Mediation Makes Sense"
        center
      />

      <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          "First, check if your case is Legally Fit for Mediation?",
          "Next, assess if your case makes business sense?",
          "Finally, Invite the other side to a Mediation orientation with PACT?"
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-3xl bg-navy-50/50 border border-navy-100 flex flex-col items-center gap-6 group hover:bg-white hover:border-gold-500 transition-all duration-500"
          >
            <div className="w-12 h-12 rounded-full bg-navy-950 text-white flex items-center justify-center font-mono font-bold group-hover:bg-gold-500 transition-colors">
              0{i+1}
            </div>
            <p className="text-lg text-navy-950 font-light leading-relaxed">
              {item}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-20">
        <a 
          href="mailto:mediation@thepact.in"
          className="inline-flex items-center gap-4 bg-gold-500 text-navy-950 px-8 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-navy-950 hover:text-white transition-all duration-300 shadow-xl group"
        >
          <span>Get in Touch</span>
          <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </a>
      </div>
    </div>
  </section>
);

export default function WhyMediatePage() {
  return (
    <main className="relative min-h-screen w-full bg-white overflow-x-hidden">
      <GrainOverlay />
      <WhyMediateHero />
      <PuzzlePieces />
      <PactProvides />
      <Checklist />
      <Footer />
    </main>
  );
}

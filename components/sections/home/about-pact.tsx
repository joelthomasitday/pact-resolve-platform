"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AboutPactSettings } from "@/lib/db/schemas";
import { Skeleton } from "@/components/ui/skeleton";

export function AboutPact() {
  const [settings, setSettings] = useState<AboutPactSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/content/about-pact");
        const result = await res.json();
        if (result.success && result.data) {
          setSettings(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch about settings", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  if (isLoading) return <div className="py-24 bg-navy-950 px-6"><Skeleton className="h-[400px] w-full max-w-7xl mx-auto rounded-4xl bg-white/5" /></div>;
  if (!settings) return null;

  return (
    <section className="relative py-16 md:py-24 bg-navy-950 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -mr-64 -mt-64" />
      
      <div className="max-w-8xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Side: Content */}
          <div className="lg:w-1/2 space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-4">
                <div className="h-px w-8 bg-gold-500" />
                <p className="text-gold-500  text-xs uppercase tracking-[0.4em] font-medium">
                  {settings.subtitle1} <span className="text-white/40 ml-2">— {settings.subtitle2}</span>
                </p>
              </div>
              
              <h2 className="text-4xl md:text-7xl font-light tracking-tight text-white leading-[1.1]">
                {settings.title.split(' ').map((word, i) => (
                  <span key={i} className={word.toUpperCase() === "PACT" ? "text-gold-500 font-medium" : ""}>
                    {word}{' '}
                  </span>
                ))}
              </h2>
              
              <p className="text-white/60 font-light text-lg md:text-xl leading-relaxed max-w-xl">
                {settings.description}
              </p>
            </motion.div>

            {/* Dynamic Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-12 pt-4 border-t border-white/10">
              {settings.stats?.sort((a,b) => (a.order || 0) - (b.order || 0)).map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.6 }}
                >
                  <p className="text-2xl md:text-4xl font-light text-white mb-2">{stat.value}</p>
                  <p className="text-white/30  text-[10px] uppercase tracking-widest leading-tight">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side: Timeline/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:w-1/2 relative group"
          >
            <div className="relative aspect-16/10 rounded-4xl overflow-hidden border border-white/10 p-2 bg-white/5 backdrop-blur-sm">
              <div className="relative w-full h-full rounded-3xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                <Image
                  src={settings.journeyImage.url}
                  alt={settings.journeyImage.alt || settings.journeyLabel}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-navy-950 via-transparent to-transparent opacity-60" />
              </div>
            </div>
            
            {/* Label Badge */}
            <div className="absolute -bottom-6 right-6 md:right-12">
              <div className="bg-gold-500 px-8 py-4 rounded-2xl shadow-2xl relative">
                <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-navy-950/20" />
                <p className="text-navy-950 font-medium tracking-tight whitespace-nowrap">
                  {settings.journeyLabel}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

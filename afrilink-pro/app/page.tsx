"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Menu, X, Sparkles, CheckCircle, ChevronRight, Play } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import HeroSection from "@/components/home/hero-section";
import StatsSection from "@/components/home/stats-section";
import FeaturesSection from "@/components/home/features-section";
import HowItWorksSection from "@/components/home/how-it-works-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import PricingSection from "@/components/home/pricing-section";
import CTASection from "@/components/home/cta-section";
import Footer from "@/components/layout/footer";

/* ─── Main Page ───────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}

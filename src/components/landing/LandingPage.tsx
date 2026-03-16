"use client";

import LandingNavbar from "./LandingNavbar";
import LandingHero from "./LandingHero";
import LandingFeatures from "./LandingFeatures";
import LandingTestimonials from "./LandingTestimonials";
import LandingFooter from "./LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingTestimonials />
      </main>
      <LandingFooter />
    </div>
  );
}

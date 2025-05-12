// src/app/page.tsx
import ContactForm from '@/components/ContactForm'; // The ONLY imported presentational component
import Image from 'next/image'; // If your icon is an image

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-[#0A192F] px-4 relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 w-full h-full z-[1] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hex-bg.png')", opacity: 0.04 }}
        aria-hidden="true"
      />
      {/* White overlay at 15% opacity */}
      <div className="absolute inset-0 w-full h-full z-[-10] bg-white/15 pointer-events-none" aria-hidden="true" />

      {/* HERO SECTION */}
      <section className="w-full flex flex-col items-center text-center pt-4 md:pt-8 lg:pt-10 pb-2 md:pb-3 z-[10]" style={{ marginTop: '8px' }}>
        <h2 className="font-inter font-bold text-5xl md:text-6xl xl:text-7xl text-gray-200 text-center w-full max-w-[911px] mx-auto mb-2 leading-tight">
          Cogn8Solutions Launch
          </h2>
        <h3 className="font-inter font-semibold text-4xl md:text-5xl xl:text-6xl text-gray-300 mb-2 mt-0.5">June 2025</h3>
        <Image
          src="/brightblue_transparent_cognisphere@4x_tight.png"
          alt="CogniSphere Icon"
          width={532}
          height={532}
          className="mx-auto mb-2 md:mb-3 flex-shrink-0 aspect-[532/457] w-[180px] md:w-[300px] lg:w-[400px] xl:w-[480px] h-auto"
        />
        <p className="font-inter font-medium text-4xl md:text-5xl xl:text-6xl text-gray-200 text-center tracking-wide w-full max-w-[911px] mx-auto mb-3 md:mb-4 leading-tight">
          From Friction to Flow
        </p>
      </section>

      {/* EMAIL INPUT BAR */}
      <section className="w-full flex flex-col items-center px-1 md:px-0 z-[10]">
        <ContactForm />
      </section>

      {/* FOOTER */}
      <footer className="w-full text-center mt-5 md:mt-8 mb-1 px-1 z-[10]">
        <p className="text-gray-300 text-base md:text-4xl mb-0.5 font-inter">www.cogn8solutions.com</p>
        <a
          href="/privacy-policy.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 underline hover:text-gray-200 transition-colors"
          style={{ display: 'block', marginTop: '0.25rem' }}
        >
          Privacy Policy
        </a>
      </footer>
    </main>
  );
}
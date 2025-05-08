// src/app/page.tsx
import ContactForm from '@/components/ContactForm'; // The ONLY imported presentational component
import Image from 'next/image'; // If your icon is an image

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-[#0A192F] px-4 relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 w-full h-full -z-10 opacity-90 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hex-bg.png')" }}
        aria-hidden="true"
      />
      {/* White overlay at 15% opacity */}
      <div className="absolute inset-0 w-full h-full -z-5 bg-white/15 pointer-events-none" aria-hidden="true" />

      {/* HERO SECTION */}
      <section className="w-full flex flex-col items-center text-center pt-8 md:pt-16 lg:pt-24 pb-6 md:pb-8">
        <h1 className="font-inter font-medium text-[2.5rem] md:text-[4rem] lg:text-[7rem] xl:text-[10rem] text-gray-200 text-center w-full max-w-[911px] mx-auto mb-2 md:mb-4 leading-none">
          June 2025
        </h1>
        <Image
          src="/Bright Blue_Transparent_CogniSphere@4x_tight.png"
          alt="CogniSphere Icon"
          width={532}
          height={532}
          className="mx-auto mb-6 md:mb-8 flex-shrink-0 aspect-[532/457] w-[220px] md:w-[350px] lg:w-[450px] xl:w-[532px] h-auto"
        />
        <p className="font-inter font-medium text-[1.5rem] md:text-[2.5rem] lg:text-[4rem] xl:text-[5rem] text-gray-300 text-center tracking-wide w-full max-w-[911px] mx-auto mb-8 md:mb-12 leading-none">
          From Friction to Flow
        </p>
      </section>

      {/* EMAIL INPUT BAR */}
      <section className="w-full flex flex-col items-center px-2 md:px-0">
        <form className="flex flex-col sm:flex-row w-full max-w-xs sm:max-w-lg md:max-w-2xl mx-auto rounded-2xl sm:rounded-full bg-gray-800/70 shadow-lg px-2 py-2 items-center mb-2 gap-2 sm:gap-0">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-transparent text-white placeholder-gray-400 px-4 md:px-6 py-2 md:py-3 text-base md:text-lg rounded-full outline-none font-inter min-w-0"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full px-6 md:px-8 py-2 md:py-3 text-base md:text-lg transition ml-0 sm:ml-2 whitespace-nowrap w-full sm:w-auto"
          >
            Stay Informed
          </button>
        </form>
        <p className="text-xs md:text-sm text-gray-400 max-w-xs md:max-w-md text-center mt-1">
          *Join 10 launch partners for a chance at a <span className="font-bold">no-cost</span>, $3,000 two-day, 8-point tech-stack audit & roadmap
        </p>
      </section>

      {/* FOOTER */}
      <footer className="w-full text-center mt-10 md:mt-16 mb-2 px-2">
        <p className="text-gray-400 text-base md:text-lg mb-1 font-inter">www.cogn8solutions.com</p>
        <p className="text-xs md:text-sm text-gray-500 font-inter">*No-cost audit for 10 launch partners in July–August 2025</p>
      </footer>
    </main>
  );
}
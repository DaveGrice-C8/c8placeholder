// src/app/page.tsx
import ContactForm from '@/components/ContactForm'; // The ONLY imported presentational component
import Image from 'next/image'; // If your icon is an image

export default function ThrowawayLandingPage() {
  return (
    <main className="flex flex-col min-h-screen items-center bg-[#0A192F]"> {/* Example background color */}

      {/* --- HERO SECTION JSX (Directly in page.tsx) --- */}
      <section className="w-full flex flex-col items-center text-center pt-16 md:pt-24 pb-12 px-4"> {/* Added padding */}
        {/*
          Assuming CogniSphere is an SVG or PNG in your public folder.
          You'll need to get the actual path and dimensions.
        */}
        <Image
          src="/cognisphere-icon-light-blue.png" // Replace with your actual icon path
          alt="CogniSphere Icon"
          width={120} // Adjust as needed
          height={120} // Adjust as needed
          className="mb-6"
        />
        <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tight mb-4">
          June 2025
        </h1>
        <p className="text-3xl md:text-4xl text-gray-300">
          From Friction to Flow
        </p>
      </section>

      {/* --- CONTACT FORM SECTION (Directly in page.tsx, wrapping the component) --- */}
      <section className="w-full max-w-lg flex flex-col items-center text-center py-10 px-4">
        <ContactForm /> {/* The only component with its own file */}
        <p className="mt-6 text-xs text-gray-400 max-w-md">
          *Join 10 launch partners for a no-cost, $3,000 two-day, 8-point tech-stack audit & roadmap
        </p>
      </section>

      {/* --- FOOTER SECTION JSX (Directly in page.tsx) --- */}
      <footer className="w-full text-center py-8 mt-auto px-4">
        <p className="text-sm text-gray-400 mb-1">
          www.cogn8solutions.com
        </p>
        <p className="text-xs text-gray-500">
          *No-cost audit for 10 launch partners
        </p>
      </footer>

    </main>
  );
}
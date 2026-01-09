'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-7xl">
        <section className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-800 via-orange-700 to-amber-900 mb-4 sm:mb-6 leading-tight">
            Interior-Dost
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-stone-800 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4 font-medium">
            Transform Your Space with AI
          </p>
          <p className="text-base sm:text-lg md:text-xl text-stone-600 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
            Redesign your room in seconds. Upload a photo, describe your vision, and see your space transformed—perfect for Indian homes.
          </p>
          <Link
            href="/design"
            className="inline-block px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-amber-700 to-orange-600 text-white text-lg sm:text-xl md:text-2xl font-bold rounded-xl hover:from-amber-800 hover:to-orange-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-300"
          >
            Try It Now →
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 lg:mb-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-stone-200">
            <div className="text-5xl mb-4 text-center">📸</div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-3 sm:mb-4 text-center">
              Upload Your Room
            </h3>
            <p className="text-sm sm:text-base text-stone-600 text-center leading-relaxed">
              Take a photo or upload an existing image of your room. Our AI analyzes the space instantly.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-stone-200">
            <div className="text-5xl mb-4 text-center">✨</div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-3 sm:mb-4 text-center">
              Describe Your Vision
            </h3>
            <p className="text-sm sm:text-base text-stone-600 text-center leading-relaxed">
              Tell us your style—modern, traditional, minimalist, or bohemian. Or describe it in your own words.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-stone-200">
            <div className="text-5xl mb-4 text-center">🎨</div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-3 sm:mb-4 text-center">
              See the Magic
            </h3>
            <p className="text-sm sm:text-base text-stone-600 text-center leading-relaxed">
              Get an AI-generated redesign with furniture suggestions and shopping links—all in seconds.
            </p>
          </div>
        </section>

        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 mb-12 sm:mb-16 border border-stone-200">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 mb-6 sm:mb-8 text-center">
            Why Interior-Dost?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="text-2xl">🏠</div>
              <div>
                <h3 className="font-bold text-stone-900 text-base sm:text-lg mb-1">Tailored for Indian Homes</h3>
                <p className="text-sm sm:text-base text-stone-600">Designs that understand Indian aesthetics and space constraints</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="text-2xl">🔑</div>
              <div>
                <h3 className="font-bold text-stone-900 text-base sm:text-lg mb-1">Rental-Friendly</h3>
                <p className="text-sm sm:text-base text-stone-600">No structural changes—perfect for renters</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="text-2xl">⚡</div>
              <div>
                <h3 className="font-bold text-stone-900 text-base sm:text-lg mb-1">Instant Results</h3>
                <p className="text-sm sm:text-base text-stone-600">See your redesigned room in 30-60 seconds</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="text-2xl">🛍️</div>
              <div>
                <h3 className="font-bold text-stone-900 text-base sm:text-lg mb-1">Shopping Made Easy</h3>
                <p className="text-sm sm:text-base text-stone-600">Direct links to Amazon, Flipkart, and Pepperfry</p>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center bg-gradient-to-r from-amber-700 to-orange-600 rounded-2xl shadow-2xl p-8 sm:p-10 md:p-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-lg sm:text-xl text-amber-50 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of Indians redesigning their homes with AI
          </p>
          <Link
            href="/design"
            className="inline-block px-8 sm:px-12 py-4 sm:py-6 bg-white text-amber-800 text-lg sm:text-xl md:text-2xl font-bold rounded-xl hover:bg-stone-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white"
          >
            Start Redesigning Now →
          </Link>
        </section>

        <footer className="mt-12 sm:mt-16 text-center text-stone-600 text-xs sm:text-sm space-y-2 px-4">
          <p className="font-medium">
            Powered by AI • Designed for Indian Homes • 100% Free to Try
          </p>
          <p className="text-xs text-stone-500">
            Transform your space without breaking the bank or your lease
          </p>
        </footer>
      </div>
    </div>
  );
}

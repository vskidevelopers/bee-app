import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, MessageCircle, ShieldCheck, Truck, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home - Smart Home & Decor Nairobi',
  description: 'Transform your space with premium smart home gadgets, warm duvets, mosquito nets, and modern decor. Nairobi delivery & M-Pesa accepted.',
  keywords: ['smart home gadgets Nairobi', 'warm duvets Kenya', 'mosquito nets delivery Nairobi', 'home decor Moi Avenue', 'BeeHouseholds'],
};

const categories = [
  { id: 'duvets', name: 'Warm Duvets', icon: '🛏️' },
  { id: 'nets', name: 'Mosquito Nets', icon: '🦟' },
  { id: 'smart', name: 'Smart Gadgets', icon: '📱' },
  { id: 'furniture', name: 'Bedside & Furniture', icon: '🪑' },
  { id: 'carpets', name: 'Carpets & Rugs', icon: '🧶' },
  { id: 'dinner', name: 'Dinner Sets', icon: '🍽️' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-amber-50 via-stone-50 to-orange-50 py-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-stone-900 mb-6">
            Transform Your Space with <span className="text-amber-700">Smart Home Solutions</span> & Premium Decor
          </h1>
          <p className="text-lg md:text-xl text-stone-600 mb-8 max-w-3xl mx-auto">
            Nairobi&apos;s trusted destination for warm duvets, mosquito nets, bedside essentials, and modern home accessories. Making your home smarter, warmer, and safer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-amber-700 hover:bg-amber-800 rounded-md transition shadow-md">
              Shop Collection <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a href="https://wa.me/254720151058?text=Hi%20BeeHouseholds%2C%20I%27d%20like%20a%20quote%20for..." target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-amber-700 bg-white border-2 border-amber-700 hover:bg-amber-50 rounded-md transition">
              <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp Us for a Quote
            </a>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-y border-stone-200 py-8">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: <Star className="h-6 w-6 text-amber-600" />, title: "133K+ Happy Customers", desc: "Loved on TikTok & Beyond" },
            { icon: <Truck className="h-6 w-6 text-amber-600" />, title: "Countrywide Delivery", desc: "Fast & Secure Shipping" },
            { icon: <ShieldCheck className="h-6 w-6 text-amber-600" />, title: "Quality Guarantee", desc: "Premium Home Essentials" },
            { icon: <ShoppingBag className="h-6 w-6 text-amber-600" />, title: "Easy Payment", desc: "M-Pesa Accepted" },
          ].map((badge, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="p-3 bg-amber-50 rounded-full">{badge.icon}</div>
              <h3 className="font-semibold text-stone-900">{badge.title}</h3>
              <p className="text-sm text-stone-500">{badge.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 px-4 bg-stone-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-stone-900">Shop by Category</h2>
            <p className="text-stone-600 mt-2">Explore our curated collection for every room</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/shop?category=${cat.id}`} className="group flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-stone-200 hover:border-amber-300 hover:shadow-md transition">
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="font-medium text-stone-800 text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TikTok Social Proof Placeholder */}
      <section className="py-16 px-4 bg-gradient-to-r from-stone-900 to-stone-800 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Community of 133K+ Followers</h2>
          <p className="text-stone-300 mb-6 max-w-2xl mx-auto">See our latest setups, customer reviews, and exclusive deals on TikTok @bee_households260</p>
          <div className="w-full h-64 bg-stone-800 rounded-lg flex items-center justify-center border-2 border-dashed border-stone-600 text-stone-400">
            TikTok Feed / Video Embed Placeholder
          </div>
        </div>
      </section>
    </div>
  );
}
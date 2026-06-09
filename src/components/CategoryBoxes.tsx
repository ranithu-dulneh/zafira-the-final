"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const TypewriterText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Initial delay before starting the typewriter effect
    const initialDelay = setTimeout(() => {
      let currentIndex = 0;

      const intervalId = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, 100); // Speed of typing

      return () => clearInterval(intervalId);
    }, delay);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(timeoutId);
    };
  }, [text, delay]);

  return <span>{displayText}<span className="animate-pulse">_</span></span>;
};

export default function CategoryBoxes() {
  const categories = [
    {
      id: "womens",
      title: "Women's",
      href: "/category/womens",
      image: "https://images.unsplash.com/photo-1599643478524-fb66f72400de?q=80&w=600&auto=format&fit=crop",
      alt: "Women wearing elegant jewelry",
      delay: 0
    },
    {
      id: "mens",
      title: "Men's",
      href: "/category/mens",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop",
      alt: "Man wearing luxury watch and rings",
      delay: 500
    },
    {
      id: "unisex",
      title: "Unisex",
      href: "/category/unisex",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop",
      alt: "Minimalist unisex jewelry",
      delay: 1000
    }
  ];

  return (
    <section className="py-12 md:py-20 px-4 md:px-8 container mx-auto">
      <div className="flex flex-col items-center text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-serif text-zafira-slate mb-4">Discover Collections</h3>
        <div className="w-12 h-0.5 bg-zafira-gold" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden aspect-[4/5] bg-zafira-slate cursor-pointer"
          >
            <Link href={category.href} className="block w-full h-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-60"
                style={{ backgroundImage: `url(${category.image})` }}
                role="img"
                aria-label={category.alt}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6">
                <div className="overflow-hidden mb-2">
                  <motion.h4
                    className="text-2xl md:text-3xl font-serif text-white uppercase tracking-widest text-center h-10"
                  >
                    <TypewriterText text={category.title} delay={category.delay} />
                  </motion.h4>
                </div>

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  whileHover={{ opacity: 1, height: "auto" }}
                  className="overflow-hidden md:h-0 md:opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300"
                >
                  <span className="inline-block mt-4 text-xs tracking-[0.2em] uppercase text-zafira-gold border-b border-zafira-gold pb-1">
                    Shop Now
                  </span>
                </motion.div>

                {/* Always visible on mobile */}
                <div className="md:hidden mt-4">
                  <span className="text-xs tracking-[0.2em] uppercase text-zafira-gold border-b border-zafira-gold pb-1">
                    Shop Now
                  </span>
                </div>
              </div>

              {/* Gold border effect on hover */}
              <div className="absolute inset-4 border border-zafira-gold/0 group-hover:border-zafira-gold/30 transition-colors duration-500 pointer-events-none" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
"use client";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import { Instrument_Serif } from "next/font/google";
import { FaStar } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export default function Home() {
  return (
    <>
      <Navbar></Navbar>
      <Hero></Hero>
      <IntroducingSenku />
      <HowItWroks />
      <Testimonials />
      <Pricing />
      <Footer />
    </>
  );
}

const IntroducingSenku = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="wrapper flex justify-center flex-col items-center mt-10 px-4 md:px-6 space-y-3"
    >
      <h2 className="text-xl font-bold uppercase gradient-text">
        What Sanku want's to say
      </h2>
      <h1 className="text-2xl md:text-4xl text-center max-w-lg">
        Hey, I can understand{" "}
        <span className="text-[#4D4D4D]">
          Tracking workouts, pushing PRs, and staying consistent isn't easy.{" "}
        </span>
        <span className="text-[#4D4D4D]">
          Your AI-powered training partner keeps you on track, motivated, and
          making real progress with every rep and set.{" "}
        </span>
        <br />
        That's where Gymbro comes in.{" "}
      </h1>
    </motion.div>
  );
};
const HowItWroks = () => {
  const content = [
    {
      id: 1,
      title: "Create Your Routine",
      description: "this is random text",
    },
    {
      id: 2,
      title: "Start Workout",
      description: "this is random text",
    },
    {
      id: 3,
      title: "Let Sanku handle your work",
      description: "this is random text",
    },
  ];
  return (
    <div className="wrapper flex flex-col justify-center items-center mt-20 md:mt-30 space-y-5 relative px-4 md:px-6">
      <span className="border shadow-xl border-gray-800 px-3 py-1 rounded-full">
        How it works
      </span>
      {/* Header text */}
      <h1 className="text-3xl md:text-5xl text-center">
        Getting Started is{" "}
        <span className={`${instrumentSerif.className} italic`}>Simple</span>
      </h1>
      <p className="text-gray-400 text-center">
        A simple three step process to your workout organised
      </p>
      <div className="gradient-bg absolute" />
      {/* cards */}
      <div className="grid md:grid-cols-3 grid-cols-1 gap-6 md:gap-10 md:h-[30rem] w-full relative mt-10">
        {content.map((process, index) => (
          <motion.fieldset
            key={process.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="p-5 md:p-7 border backdrop-blur-2xl border-gray-800 rounded-xl md:rounded-[2.2rem] shadow-2xl bg-glass/10 flex flex-col h-full"
          >
            <legend className="border border-gray-800 py-2 px-5 mx-auto rounded-full bg-[#171717]">
              {process.id}
            </legend>
            <div className="mt-auto space-y-2">
              <h3 className="text-xl md:text-2xl">{process.title}</h3>
              <span className="text-sm md:text-md text-gray-400">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero
                nostrum inventore, error rerum optio eum qui saepe voluptatibus
                beatae excepturi.
              </span>
            </div>
          </motion.fieldset>
        ))}
      </div>
    </div>
  );
};

export const Testimonials = () => {
  return (
    <div className="wrapper flex flex-col justify-center items-center mt-20 md:mt-30 space-y-5 px-4 md:px-6">
      <span className="border shadow-xl border-gray-800 px-3 py-1 rounded-full">
        Testimonials
      </span>
      {/* Header text */}
      <h1 className="text-3xl md:text-5xl text-center">
        What
        <span className={`${instrumentSerif.className} italic`}> Others </span>
        are saying.
      </h1>

      <p className="text-gray-400 text-center">
        Trusted by founders and creatives who value simplicity and results.
      </p>
      <div className="gradient-bg absolute" />
      {/* cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-4 md:gap-5 mt-10 w-full">
        {[1, 2, 3, 4, 5, 6].map((t) => (
          <div
            key={t}
            className="bg-glass/10 backdrop-blur-2xl p-4 md:p-6 flex flex-col gap-4 md:gap-7 rounded-2xl md:rounded-3xl"
          >
            <span className="flex gap-1">
              {[1, 2, 3, 4].map((star) => (
                <FaStar key={star} size={14} />
              ))}
            </span>
            <p className="text-sm md:text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos
              veritatis rem molestias enim sed! Eaque sit et aliquid iure
              inventore?
            </p>

            <div className="flex gap-2 items-center">
              <img
                className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                src="https://github.com/sankalpaacharya.png"
                alt=""
              />
              <p className="flex flex-col">
                <span className="text-sm md:text-base">Sankalpa Acharya</span>
                <span className="text-xs md:text-sm text-gray-400">
                  Founder of weride.live
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Pricing = () => {
  return (
    <div className="wrapper flex flex-col justify-center items-center mt-20 md:mt-30 space-y-5 relative px-4 md:px-6">
      <span className="border shadow-xl border-gray-800 px-3 py-1 rounded-full">
        Pricing
      </span>
      {/* Header text */}
      <h1 className="text-3xl md:text-5xl text-center">
        Simple Pricing, no{" "}
        <span className={`${instrumentSerif.className} italic`}>surprises</span>
      </h1>
      <p className="text-gray-400 text-center">
        Choose a plan that fits your needs, with everything you need to stay
        organized and productive.
      </p>
      <div className="gradient-bg absolute" />
      {/* pricing cards */}
      <div className="flex flex-col md:flex-row gap-5">
        {/* cards */}
        <div className="rounded-3xl p-8 border border-gray-800">
          <h2 className="text-xl font-medium mb-4">Monthly</h2>
          <div className="flex items-baseline mb-6">
            <span className="text-5xl font-bold">$5</span>
            <span className="text-gray-400">/month</span>
          </div>
          <p className="text-gray-300 mb-8">
            Take your productivity to the next level with advanced tools and
            personalized support.
          </p>

          <Button className="w-full font-black bg-purple-600 hover:bg-purple-700 py-5 rounded-xl mb-4 flex items-center justify-center">
            Buy Now <FaArrowRight />
          </Button>

          <p className="text-sm text-center text-gray-500 mb-8">
            Billed in one annual payment.
          </p>

          <h3 className="font-medium mb-4">Standard plus:</h3>
          <ul className="space-y-3">
            {[1, 2, 3, 4, 5].map((b) => (
              <li key={b} className="flex items-center space-x-2">
                <Check size={20} />
                <span>Custom Task Categories</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl p-8 border border-gray-800">
          <h2 className="text-xl font-medium mb-4">Annual</h2>
          <div className="flex items-baseline mb-6">
            <span className="text-5xl font-bold">$2</span>
            <span className="text-gray-400">/month</span>
          </div>
          <p className="text-gray-300 mb-8">
            Take your productivity to the next level with advanced tools and
            personalized support.
          </p>

          <Button className="w-full font-black bg-purple-600 hover:bg-purple-700 py-5 rounded-xl mb-4 flex items-center justify-center">
            Buy Now <FaArrowRight />
          </Button>

          <p className="text-sm text-center text-gray-500 mb-8">
            Billed in one annual payment.
          </p>

          <h3 className="font-medium mb-4">Standard plus:</h3>
          <ul className="space-y-3">
            {[1, 2, 3, 4, 5].map((b) => (
              <li key={b} className="flex items-center space-x-2">
                <Check size={20} />
                <span>Custom Task Categories</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 py-16 mt-24">
      <div className="wrapper px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and Newsletter Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
                <div className="w-6 h-6 bg-black rounded-sm"></div>
              </div>
              <span className="text-lg font-medium">Senku</span>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Join our newsletter</h3>
              <p className="text-sm text-gray-400">
                Sign up to our mailing list below and be the first to know about
                new updates. Don't worry, we hate spam too.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your Email Address"
                  className="bg-transparent border border-gray-800 rounded-lg px-4 py-2 flex-grow text-sm"
                />
                <Button>Get Notified</Button>
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Sections</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Information</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white">
                  404
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white">
                  Use Template
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom Section with Credits */}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-16 pt-8">
        <div className="wrapper flex ">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Created by</span>
            <div className="flex items-center space-x-2">
              <img
                src="https://github.com/sankalpaacharya.png"
                alt="Creator"
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm">Sankalpa Acharya</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

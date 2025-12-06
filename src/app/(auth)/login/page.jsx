import React from "react";
import Image from "next/image";
import banner from "../../../../public/images/login/iamge.png";

const Page = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col md:flex-row">
      {/* Left image + quote */}
      <div className="relative w-full md:w-1/2 h-[40vh] md:h-auto">
        {/* Background image */}
        <Image
          src={banner}
          alt="Student banner"
          fill
          priority
          className="object-cover"
        />

        {/* Orange overlay + gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        {/* Text content */}
        <div className="absolute inset-0 flex items-center px-6 md:px-10 lg:px-16">
          <div className="max-w-md text-white space-y-6">
            <div className="text-5xl md:text-6xl font-bold leading-none">
              &ldquo;
            </div>
            <p className="text-xl md:text-2xl font-semibold leading-snug">
              Lorem ipsum dolor
              <br />
              sit amet,
              <br />
              consectetur
              <br />
              adipiscing elit
            </p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6 md:px-10 lg:px-20 py-10 md:py-0">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md border-2 border-orange-500 flex items-center justify-center">
              <span className="text-orange-500 font-bold text-xl">◇</span>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Get Started Now
            </h1>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Name"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="Phone"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Checkbox + terms */}
            <label className="flex items-start gap-2 text-xs md:text-sm text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span>
                I agree to the terms &amp; policy
              </span>
            </label>

            {/* Button */}
            <button
              type="submit"
              className="w-full rounded-md bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 md:py-3 text-sm md:text-base transition-colors"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;

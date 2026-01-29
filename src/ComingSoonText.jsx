import React, { useState } from "react";
// import { ImageWithFallback } from "./components/ImageWithFallBack";
import VideoParticleMorph from "./comingSoon";

const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbxTroc8QGOjO9GHZ-OQziH_vKUCc7ifhTzQ0qx7GAsroS2JO0VTcLRU9a5JJYRv4Mp3/exec";

export default function ComingSoonText() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));
      if (!data.ok) throw new Error(data.error || "Failed");

      setSubmitted(true);
      setEmail("");
    } catch (err) {
      console.error(err);
      alert("Could not save email. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black isolate">
      {/* Background texture */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-5"
        aria-hidden="true"
      >
        {/* <ImageWithFallback
          src=""
          alt="Background texture"
          className="h-full w-full object-cover"
        /> */}
      </div>

      {/* Orange accent elements */}
      <div
        className="pointer-events-none absolute right-0 top-0 z-10 h-64 w-64 translate-x-32 -translate-y-32 rounded-full bg-orange-500 opacity-20 blur-[64px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-96 w-96 -translate-x-48 translate-y-48 rounded-full bg-orange-500 opacity-10 blur-[64px]"
        aria-hidden="true"
      />

      <VideoParticleMorph />

      {/* Main content */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
        {/* Japanese text accent */}
        <div className="mb-8">
          <p className="font-vietnam m-0 text-[16px] tracking-[0.25em] text-white/40">
            前進異なる方法で
          </p>
        </div>

        {/* Brand name */}
        <div className="mb-6">
          <h1 className="font-outfit mb-2 text-[4.5rem] font-normal leading-none tracking-[-0.04em] text-white md:text-[8rem]">
            {" "}
            QERRA
          </h1>
          <div className="mx-auto h-1 w-24 bg-orange-500" />
        </div>

        {/* Replace the 11 <br/> with spacing */}
        <div className="h-35 md:h-48 sm:h-50" />

        {/* Coming soon message */}
        <div className="mb-12 mt-10 max-w-md">
          <h2 className="font-montserrat mb-4 text-[1.75rem] font-medium tracking-[0.08em] text-white md:text-[2rem]">
            COMING SOON
          </h2>
          <p className="font-poppins m-0 leading-[1.5] tracking-[0.06em] text-white/60">
            A new era of fashion is approaching. Be the first to experience our
            unique vision.
          </p>
        </div>

        {/* Email signup */}
        <div className="mb-8 w-full max-w-md">
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 md:flex-row"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="font-poppins flex-1 border-2 border-white bg-black px-6 py-4 text-base text-white outline-none transition-colors duration-200 placeholder:text-white/40 focus:border-orange-500"
              />
              <button
                type="submit"
                className="font-montserrat cursor-pointer bg-white px-8 py-4 tracking-[0.12em] text-black transition-colors duration-300 hover:bg-orange-500 hover:text-white"
              >
                NOTIFY ME
              </button>
            </form>
          ) : (
            <div className="py-4">
              <p className="font-outfit m-0 tracking-[0.06em] text-orange-500">
                Thank you! We'll keep you updated.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-0 right-0">
          <p className="font-vietnam m-0 text-xs tracking-[0.25em] text-white/30">
            © 2026 QERRA
          </p>
        </div>
      </div>
    </div>
  );
}

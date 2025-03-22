import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const HeroSection = () => {
  const allUrls = {
    youtubeURL: "https://www.youtube.com/@qaplayground",
    blogLink: "https://random-coders.vercel.app",
  };

  const socialHandles = {
    facebookId: "qaplayground",
    whatsappId: "qaplayground",
    twitterId: "qaplayground",
    telegramId: "qaplayground",
  };

  return (
    <section className="mt-24 mb-8 md:mb-16 px-4 bg-background text-foreground">
      <div className="container mx-auto text-center flex flex-col items-center">
        <h1 className="gradient-subTitle bg-gradient-to-br from-red-600 to-purple-600 font-extrabold tracking-tighter pr-2 pb-2 text-transparent bg-clip-text text-4xl md:text-7xl leading-tight mb-6">
          QA XPath
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-4xl mx-auto">
          Simplify automation testing with QA XPath. Automate repetitive tasks,
          enhance efficiency, and focus on solving real-world testing challenges
          with ease and precision!
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/practice" passHref>
            <Button
              size="lg"
              className="px-8 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Get Started
            </Button>
          </Link>
          <Link
            href={allUrls.youtubeURL}
            target="_blank"
            rel="noopener noreferrer"
            passHref
          >
            <Button
              size="lg"
              variant="outline"
              className="px-8 border border-border text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Watch Demo
            </Button>
          </Link>
        </div>

        {/* Buy Me A Coffee Button */}
        <div className="mt-8">
          <a
            href="https://www.buymeacoffee.com/randomcoders"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
              alt="Buy Me A Coffee"
              style={{ height: "55px", width: "217px" }}
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

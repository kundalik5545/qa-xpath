import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";

const sections = [
  {
    title: "Practice Elements",
    description: "Practice like a pro!",
    buttons: [
      {
        link: "https://www.qaplayground.com/practice",
        buttonText: "Explore More",
      },
    ],
  },
  {
    title: "Free Tutorials",
    description: "Free courses on software testing & development.",
    buttons: [
      {
        link: "https://www.qaplayground.com/learn/courses",
        buttonText: "Explore Free Courses",
      },
    ],
  },
  {
    title: "Practice Logic",
    description: "Solve real interview questions.",
    buttons: [
      {
        link: "https://www.qaplayground.com/learn/automation-test-cases",
        buttonText: "Practice Automation TC",
      },
      {
        link: "https://www.qaplayground.com/learn/logical-programs-list-to-crack-interviews",
        buttonText: "Logical Programs",
      },
    ],
  },
  {
    title: "Our Product",
    description: "Learn more about our latest SAAS products.",
    buttons: [
      { link: "https://www.qaplayground.com/", buttonText: "QA PlayGround" },
      { link: "https://qa-xpath.vercel.app/", buttonText: "QA XPath" },
      {
        link: "https://balance-sheet-app.vercel.app/",
        buttonText: "Expense Tracker",
      },
      {
        link: "https://dailytempurature.netlify.app/",
        buttonText: "Weather App",
      },
    ],
  },
];

const HomePage = () => {
  return (
    <div className="max-w-6xl">
      <HeroSection />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {sections.map((section, index) => (
          <Card key={index} className="p-6 shadow-lg rounded-xl text-center">
            <CardContent>
              <h2 className="text-xl font-semibold text-teal-700">
                {section.title}
              </h2>
              <p className="text-gray-500 mt-2">{section.description}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {section.buttons.map((el, btnIndex) => (
                  <Link href={el.link} target={"_blank"} key={btnIndex}>
                    <Button className="bg-teal-800 text-white px-4 py-2 rounded-full">
                      {el.buttonText}
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomePage;

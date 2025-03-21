"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";

export default function XPathConverter() {
  const [inputText, setInputText] = useState("");
  const [methods, setMethods] = useState([]);

  const parseLocators = () => {
    if (!inputText.trim()) {
      toast.error("Please enter XPath locators.");
      return;
    }

    const regex = /private readonly By\s+(\w+)\s*=\s*By\.(\w+)\("([^"]+)"\);/g;

    const matches = [...inputText.matchAll(regex)];

    if (matches.length === 0) {
      toast.error("No valid XPath locators found!");
      return;
    }

    const generatedMethods = matches.map(
      ([_, locatorName, locatorType, locatorValue]) => {
        const actionType = detectAction(locatorName); // Determine action type
        return {
          locatorName,
          locatorType,
          locatorValue,
          methodCode: generateSeleniumMethod(locatorName, actionType),
        };
      }
    );

    setMethods(generatedMethods);
    toast.success("Methods generated successfully!");
  };

  // Function to determine action type based on locator name
  const detectAction = (locatorName) => {
    if (
      locatorName.toLowerCase().includes("button") ||
      locatorName.toLowerCase().includes("click")
    ) {
      return "click";
    } else if (
      locatorName.toLowerCase().includes("input") ||
      locatorName.toLowerCase().includes("field")
    ) {
      return "sendKeys";
    } else {
      return "getText";
    }
  };

  // Generate appropriate Selenium methods
  const generateSeleniumMethod = (locatorName, actionType) => {
    const capitalizedLocator = capitalize(locatorName);
    if (actionType === "click") {
      return `
    public PageObject Click${capitalizedLocator}() {
        IWebElement el = shortWait.Until(ElementIsClickable(${locatorName}));
        el.Click();
        return this;
    }
    `;
    } else if (actionType === "sendKeys") {
      return `
    public PageObject EnterTextIn${capitalizedLocator}(string text) {
        IWebElement el = shortWait.Until(ElementIsVisible(${locatorName}));
        el.Clear();
        el.SendKeys(text);
        return this;
    }
    `;
    } else {
      return `
    public string GetTextFrom${capitalizedLocator}() {
        IWebElement el = shortWait.Until(ElementIsVisible(${locatorName}));
        return el.Text;
    }
    `;
    }
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        <Link href="/">XPath to Selenium Method Converter</Link>
      </h2>

      <Textarea
        rows="6"
        placeholder="Paste XPath locators here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2"
      />

      <div className="flex justify-center gap-4 mt-4">
        <Button onClick={parseLocators}>Convert</Button>
        <Button variant="destructive" onClick={() => setMethods([])}>
          Clear
        </Button>
      </div>

      {methods.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">
            Generated Selenium Methods:
          </h3>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full bg-white border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Locator Name</th>
                  <th className="border p-2">Method</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {methods.map((method, index) => (
                  <tr key={index} className="border hover:bg-gray-100">
                    <td className="border p-2">{method.locatorName}</td>
                    <td className="border p-2">
                      <pre className="text-sm bg-gray-100 p-2 rounded">
                        {method.methodCode}
                      </pre>
                    </td>
                    <td className="border p-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(method.methodCode);
                          toast.success("Method copied!");
                        }}
                      >
                        Copy
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

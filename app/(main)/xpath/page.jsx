"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function XPathConverter() {
  const [inputText, setInputText] = useState("");
  const [pageObject, setPageObject] = useState("");
  const [methods, setMethods] = useState([]);

  useEffect(() => {
    if (!pageObject.trim()) setMethods([]);
  }, [pageObject]);

  const parseLocators = useCallback(() => {
    if (!pageObject.trim())
      return toast.error("Please enter a page object return type.");
    if (!inputText.trim()) return toast.error("Please enter XPath locators.");

    const regex = /private readonly By\s+(\w+)\s*=\s*By\.(\w+)\("([^"]+)"\);/g;
    const matches = Array.from(inputText.matchAll(regex));

    if (!matches.length) return toast.error("No valid XPath locators found!");

    const generatedMethods = matches.map(([_, name, type, value]) => {
      const action = detectAction(name);
      return {
        locatorName: name,
        locatorType: type,
        locatorValue: value,
        methodCode: generateSeleniumMethod(name, action),
      };
    });

    setMethods(generatedMethods);
    toast.success("Methods generated successfully!");
  }, [inputText, pageObject]);

  const detectAction = (locatorName) => {
    const lower = locatorName.toLowerCase();

    const rules = [
      {
        keywords: [
          "button",
          "click",
          "add",
          "save",
          "edit",
          "delete",
          "link",
          "navigate",
        ],
        action: "click",
      },
      { keywords: ["input", "field"], action: "sendKeys" },
      { keywords: ["select", "date"], action: "select" },
      { keywords: ["text"], action: "getText" },
    ];

    for (const { keywords, action } of rules) {
      if (keywords.some((kw) => lower.startsWith(kw))) {
        return action;
      }
    }

    return "getText"; // default fallback
  };

  const generateSeleniumMethod = (locatorName, actionType) => {
    const capitalized = capitalize(locatorName);

    switch (actionType) {
      case "click":
        return `
public ${pageObject} ClickOn_${capitalized}() {
    IWebElement el = shortWait.Until(ElementToBeClickable(${locatorName}));
    el.Click();
    return this;
}
`;

      case "sendKeys":
        return `
public ${pageObject} EnterTextIn_${capitalized}(string text) {
    IWebElement el = shortWait.Until(ElementIsVisible(${locatorName}));
    el.Clear();
    el.SendKeys(text);
    return this;
}
`;

      case "select":
        return `
public ${pageObject} Select_${capitalized}(string value) {
    IWebElement el = shortWait.Until(ElementIsVisible(${locatorName}));
    el.SendKeys(value);
    return this;
}
`;

      case "getText":
      default:
        return `
public string GetTextOf_${capitalized}() {
    IWebElement el = shortWait.Until(ElementIsVisible(${locatorName}));
    return el.Text;
}
`;
    }
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const handleCopyAll = () => {
    const all = methods.map((m) => m.methodCode).join("\n\n");
    navigator.clipboard.writeText(all);
    toast.success("All methods copied!");
  };

  return (
    <div className="container mx-auto p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-center">
        <Link href="/test-case">XPath to Selenium Method Converter</Link>
      </h2>

      <div className="w-full max-w-3xl">
        <Textarea
          rows={6}
          placeholder="Paste XPath locators here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
        />

        <div className="flex items-center pt-5 gap-3">
          <Input
            name="PageObject"
            id="PageObject"
            type="text"
            className="w-[200px]"
            placeholder="Return Page Object Name"
            value={pageObject}
            onChange={(e) => setPageObject(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={parseLocators}>Convert</Button>
            <Button variant="destructive" onClick={() => setMethods([])}>
              Clear
            </Button>
          </div>
        </div>
      </div>

      {methods.length > 0 && (
        <div className="mt-6 w-full max-w-5xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold">
              Generated Selenium Methods:
            </h3>
            <Button
              size="sm"
              className="bg-blue-500 text-white"
              onClick={handleCopyAll}
            >
              Copy All Methods
            </Button>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full bg-white border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">Locator Name</th>
                  <th className="border p-2">Method</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {methods.map((method, i) => (
                  <tr key={i} className="hover:bg-gray-100">
                    <td className="border p-2">{method.locatorName}</td>
                    <td className="border p-2">
                      <pre className="text-sm bg-gray-100 p-2 rounded whitespace-pre-wrap">
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

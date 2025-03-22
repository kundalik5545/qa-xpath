"use client";

import { useState, useEffect } from "react";
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
    if (!pageObject.trim()) {
      setMethods([]); // Clear methods if pageObject is empty
    }
  }, [pageObject]);

  const parseLocators = () => {
    if (!pageObject.trim()) {
      toast.error("Please enter a page object return type.");
      return;
    }

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
        const actionType = detectAction(locatorName);
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

  //un optimised code
  // detectAction = (locatorName) => {
  //   if (
  //     locatorName.toLowerCase().includes("button") ||
  //     locatorName.toLowerCase().includes("click") ||
  //     locatorName.toLowerCase().includes("add") ||
  //     locatorName.toLowerCase().includes("save") ||
  //     locatorName.toLowerCase().includes("edit") ||
  //     locatorName.toLowerCase().includes("delete") ||
  //     locatorName.toLowerCase().includes("select") ||
  //     locatorName.toLowerCase().includes("link")
  //   ) {
  //     return "click";
  //   } else if (
  //     locatorName.toLowerCase().includes("input") ||
  //     locatorName.toLowerCase().includes("field") ||
  //     locatorName.toLowerCase().includes("date")
  //   ) {
  //     return "sendKeys";
  //   } else {
  //     return "getText";
  //   }
  // };

  const detectAction = (locatorName) => {
    const clickActions = new Set([
      "button",
      "click",
      "add",
      "save",
      "edit",
      "delete",
      "select",
      "link",
      "navigate",
    ]);
    const inputActions = new Set(["input", "field", "date"]);

    const lowerCaseLocator = locatorName.toLowerCase();

    if ([...clickActions].some((action) => lowerCaseLocator.includes(action))) {
      return "click";
    }
    if ([...inputActions].some((action) => lowerCaseLocator.includes(action))) {
      return "sendKeys";
    }

    return "getText";
  };

  const generateSeleniumMethod = (locatorName, actionType) => {
    const capitalizedLocator = capitalize(locatorName);
    const seleniumLocator = locatorName;

    if (actionType === "click") {
      return `
    public ${pageObject} ClickOn_${capitalizedLocator}() {
        IWebElement el = shortWait.Until(ElementToBeClickable(${seleniumLocator}));
        el.Click();
        return this;
    }
    `;
    } else if (actionType === "sendKeys") {
      return `
    public ${pageObject} EnterTextIn_${capitalizedLocator}(string text) {
        IWebElement el = shortWait.Until(ElementIsVisible(${seleniumLocator}));
        el.Clear();
        el.SendKeys(text);
        return this;
    }
    `;
    } else if (actionType === "getText") {
      return `
    public string GetTextOf_${capitalizedLocator}() {
        IWebElement el = shortWait.Until(ElementIsVisible(${seleniumLocator}));
        return el.Text;
    }
    `;
    } else {
      return `// Action type '${actionType}' is not supported.`;
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

      <div className="flex gap-1 pt-3">
        <Input
          name="PageObject"
          id="PageObject"
          type="text"
          className="w-[200px]"
          placeholder="Return Page Object Name"
          value={pageObject}
          onChange={(e) => setPageObject(e.target.value)}
        />
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <Button onClick={parseLocators}>Convert</Button>
        <Button variant="destructive" onClick={() => setMethods([])}>
          Clear
        </Button>
      </div>

      {methods.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold mb-3">
              Generated Selenium Methods:
            </h3>
            <Button
              size="sm"
              className="bg-blue-500 text-white"
              onClick={() => {
                const allMethods = methods
                  .map((method) => method.methodCode)
                  .join("\n\n");
                navigator.clipboard.writeText(allMethods);
                toast.success("All methods copied!");
              }}
            >
              Copy All Methods
            </Button>
          </div>
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

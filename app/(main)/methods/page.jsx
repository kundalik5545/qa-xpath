"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";

export default function MethodPage() {
  const [locatorName, setLocatorName] = useState("");
  const [locator, setLocator] = useState("");
  const [locatorType, setLocatorType] = useState("By Id");
  const [locators, setLocators] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const storedLocators = JSON.parse(localStorage.getItem("locators")) || [];
    setLocators(storedLocators);
  }, []);

  useEffect(() => {
    localStorage.setItem("locators", JSON.stringify(locators));
  }, [locators]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!locatorName || !locator) {
      toast.error("Please enter both locator name and value!");
      return;
    }

    const newLocator = { id: uuidv4(), locatorName, locator, locatorType };
    if (editIndex !== null) {
      const updatedLocators = [...locators];
      updatedLocators[editIndex] = newLocator;
      setLocators(updatedLocators);
      setEditIndex(null);
      toast.success("Locator updated successfully!");
    } else {
      setLocators([...locators, newLocator]);
      toast.success("Locator added successfully!");
    }

    setLocatorName("");
    setLocator("");
    setLocatorType("By Id");
  };

  const generateMethod = (loc) => {
    return `
    public PageObject Click${toCamelCase(loc.locatorName)}(){
        IWebElement el = shortWait.Until(ElementIsClickable(${toCamelCase(
          loc.locatorName
        )}));
        el.Click();
        return this;
    }
    `;
  };

  const toCamelCase = (str) => {
    return str
      .split(" ")
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join("");
  };

  return (
    <div className="container min-h-screen mx-auto pt-5 flex flex-col items-center">
      <Card className="max-w-xl w-full p-6 shadow-lg rounded-lg border border-gray-300 bg-white">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4 text-center">
            <Link href="/test-case">Add XPath Locator</Link>
          </h2>
          <form className="space-y-3" onSubmit={handleAdd}>
            <div>
              <Label className="text-sm font-semibold">Enter XPath Name</Label>
              <Input
                type="text"
                placeholder="Enter XPath locator name"
                value={locatorName}
                onChange={(e) => setLocatorName(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">Enter XPath</Label>
              <Input
                type="text"
                placeholder="Enter XPath"
                value={locator}
                onChange={(e) => setLocator(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">Select XPath Type</Label>
              <select
                value={locatorType}
                onChange={(e) => setLocatorType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option>By Id</option>
                <option>By className</option>
                <option>By Normal XPath</option>
                <option>By XPath Text</option>
                <option>By Css Selector</option>
              </select>
            </div>
            <div className="flex justify-between mt-4">
              <Button type="submit">
                {editIndex !== null ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {locators.length > 0 && (
        <div className="mt-6 w-full max-w-5xl">
          <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
            <table className="w-full bg-white border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Locator Name</th>
                  <th className="border p-2">Locator</th>
                  <th className="border p-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {locators.map((loc) => (
                  <tr key={loc.id} className="border hover:bg-gray-100">
                    <td className="border p-2">{loc.id}</td>
                    <td className="border p-2">{loc.locatorName}</td>
                    <td className="border p-2">{loc.locator}</td>
                    <td className="border p-2">{loc.locatorType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Methods Table */}
          <div className="mt-6 overflow-x-auto shadow-lg rounded-lg border border-gray-200">
            <table className="w-full bg-white border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Locator Name</th>
                  <th className="border p-2">Method</th>
                </tr>
              </thead>
              <tbody>
                {locators.map((loc) => (
                  <tr key={loc.id} className="border hover:bg-gray-100">
                    <td className="border p-2">{loc.locatorName}</td>
                    <td className="border p-2 font-mono whitespace-pre-wrap">
                      {generateMethod(loc)}
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

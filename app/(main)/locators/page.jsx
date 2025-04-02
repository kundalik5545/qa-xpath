"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

export default function LocatorsPage() {
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

    const newLocator = { locatorName, locator, locatorType };
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

  const handleDelete = (index) => {
    setLocators(locators.filter((_, i) => i !== index));
    toast.success("Locator deleted!");
  };

  const handleEdit = (index) => {
    const locatorToEdit = locators[index];
    setLocatorName(locatorToEdit.locatorName);
    setLocator(locatorToEdit.locator);
    setLocatorType(locatorToEdit.locatorType);
    setEditIndex(index);
  };

  const handleCopyAll = () => {
    const textToCopy = locators
      .map(
        (loc) =>
          `private readonly By ${toCamelCase(
            loc.locatorName
          )} = By.${convertLocatorType(loc.locatorType)}("${loc.locator}");`
      )
      .join("\n");

    navigator.clipboard.writeText(textToCopy);
    toast.success("All locators copied!");
  };

  const handleCopySingle = (loc) => {
    const textToCopy = `private readonly By ${toCamelCase(
      loc.locatorName
    )} = By.${convertLocatorType(loc.locatorType)}("${loc.locator}");`;

    navigator.clipboard.writeText(textToCopy);
    toast.success(`Copied: ${toCamelCase(loc.locatorName)}`);
  };

  const handleDeleteAll = () => {
    setLocators([]);
    toast.success("All locators deleted!");
  };

  const convertLocatorType = (type) => {
    switch (type) {
      case "By Id":
        return "Id";
      case "By className":
        return "ClassName";
      case "By XPath":
        return "XPath";
      case "By Css Selector":
        return "CssSelector";
      case "By Link Text":
        return "LinkText";
      case "By Partial Link Text":
        return "PartialLinkText";
      case "By Tag Name":
        return "TagName";
      case "By Name":
        return "Name";
      default:
        return "XPath";
    }
  };

  // const toCamelCase = (str) => {
  //   return str
  //     .split(" ")
  //     .map((word, index) =>
  //       index === 0
  //         ? word.toLowerCase()
  //         : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  //     )
  //     .join("");
  // };

  const toCamelCase = (str) => {
    let words = str.split(" ");
    return (
      words[0].charAt(0).toLowerCase() +
      words[0].slice(1).toLowerCase() +
      "_" +
      words
        .slice(1)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join("")
    );
  };
  return (
    <div
      className="container min-h-screen mx-auto pt-5 flex flex-col items-center"
      id="xpath-form"
    >
      <Card className="XPath-form max-w-xl w-full p-6 shadow-lg rounded-lg border border-gray-300 bg-white">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4 text-center" id="page-title">
            <Link href="/xpath">Add XPath Locator</Link>
          </h2>
          <form className="space-y-3" onSubmit={handleAdd}>
            <div>
              <Label
                className="xpath-name-label text-sm font-semibold"
                id="xpath-name"
              >
                Enter XPath Name
              </Label>
              <Input
                type="text"
                placeholder="Enter XPath locator name"
                value={locatorName}
                onChange={(e) => setLocatorName(e.target.value)}
                id="xpathName-input"
                className="locator-input"
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
                <option>By XPath</option>
                <option>By Css Selector</option>
                <option>By Link Text</option>
                <option>By Partial Link Text</option>
                <option>By Tag Name</option>
                <option>By Name</option>
              </select>
            </div>

            <div className="flex justify-between mt-4">
              <Button type="submit">
                {editIndex !== null ? "Update" : "Add"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setLocatorName("");
                  setLocator("");
                  setLocatorType("By Id");
                  setEditIndex(null);
                }}
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {locators.length > 0 && (
        <div className="mt-6 w-full max-w-5xl">
          <div className="flex justify-end mb-3 gap-2">
            <Button variant="destructive" onClick={handleDeleteAll}>
              Delete All
            </Button>
            <Button onClick={handleCopyAll}>Copy All</Button>
          </div>
          <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
            <table className="w-full bg-white border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Locator Name</th>
                  <th className="border p-2">Locator</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2 w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {locators.map((loc, index) => (
                  <tr key={index} className="border hover:bg-gray-100">
                    <td className="border p-2">{loc.locatorName}</td>
                    <td className="border p-2">{loc.locator}</td>
                    <td className="border p-2">{loc.locatorType}</td>
                    <td className="border p-2 w-40">
                      <div className="flex justify-center gap-2">
                        <Button size="sm" onClick={() => handleEdit(index)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </Button>
                        <Button size="sm" onClick={() => handleCopySingle(loc)}>
                          Copy
                        </Button>
                      </div>
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

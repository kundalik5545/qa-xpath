"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function TestCaseGenerator() {
  const defaultFormData = {
    testCaseName: "",
    getData: "",
    object: "Login_Page",
    objectName: "loginPage",
    methods: "",
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [generatedCode, setGeneratedCode] = useState("");

  // Load saved data from localStorage on first render
  useEffect(() => {
    try {
      const savedData = JSON.parse(localStorage.getItem("testCaseData"));
      if (savedData) {
        setFormData(savedData);
        setGeneratedCode(savedData.generatedCode || "");
      }
    } catch (error) {
      console.error("Error loading test case data:", error);
    }
  }, []);

  // Save data to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem(
      "testCaseData",
      JSON.stringify({ ...formData, generatedCode })
    );
  }, [formData, generatedCode]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const generateCode = useCallback(() => {
    const { testCaseName, getData, objectName, object, methods } = formData;

    if (!testCaseName || !getData || !object || !objectName || !methods) {
      toast.error("All fields are required!");
      return;
    }

    const formattedMethods = methods
      .split("\n")
      .filter(Boolean) // Remove empty lines
      .map((method) => (method.includes("(") ? `.${method}` : `.${method}()`))
      .join("\n        ");

    const code = `
[TestCaseSource(nameof(GetData${getData}), new object [] {"${testCaseName}"})]
[Test]
public void ${testCaseName}(string userName, string password, string memorableWord)
{
    ${objectName} = new ${object}(GetDriver());

    LogDetails("Login to eMember.");

    ${objectName}!
        ${formattedMethods}

    // Assert statement
}
    `;

    setGeneratedCode(code);
    toast.success("Test case generated successfully!");
  }, [formData]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(generatedCode);
    toast.success("Test Case copied to clipboard!");
  }, [generatedCode]);

  const clearForm = useCallback(() => {
    setFormData(defaultFormData);
    setGeneratedCode("");
    localStorage.removeItem("testCaseData");
    toast.warning("Test case cleared!");
  }, []);

  return (
    <div className="container min-h-screen mx-auto p-5 flex flex-col items-center">
      {/* Form Card */}
      <Card className="max-w-2xl w-full p-6 shadow-lg border border-gray-300 bg-white">
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold text-center">
            <Link href="/get-data">Test Case Generator</Link>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <Label>Test Case Name</Label>
            <Input
              name="testCaseName"
              value={formData.testCaseName}
              onChange={handleChange}
              placeholder="Enter test case name"
              className="sm:col-span-2"
            />

            <Label>Get Data Number</Label>
            <Input
              name="getData"
              value={formData.getData}
              onChange={handleChange}
              type="number"
              placeholder="Enter data number"
              className="sm:col-span-2"
            />

            <Label>Object</Label>
            <Input
              name="object"
              value={formData.object}
              onChange={handleChange}
              placeholder="e.g., Login_Page"
              className="sm:col-span-2"
            />

            <Label>Object Name</Label>
            <Input
              name="objectName"
              value={formData.objectName}
              onChange={handleChange}
              placeholder="e.g., loginPage"
              className="sm:col-span-2"
            />

            <Label>Methods</Label>
            <Textarea
              name="methods"
              value={formData.methods}
              onChange={handleChange}
              placeholder="Enter method calls, one per line"
              className="sm:col-span-2"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={generateCode}>Generate Code</Button>
            <Button onClick={clearForm} variant="destructive">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Code Table */}
      {generatedCode && (
        <div className="pt-8 w-full max-w-5xl">
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full bg-white border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Test Case</th>
                  <th className="border p-2">Snippet</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border hover:bg-gray-100">
                  <td className="border p-2 text-center">{formData.getData}</td>
                  <td className="border p-2">
                    <pre className="text-sm bg-gray-100 p-2 rounded w-full whitespace-pre-wrap">
                      {generatedCode}
                    </pre>
                  </td>
                  <td className="grid grid-cols-1 p-2 space-y-2 text-center">
                    <Button size="sm" onClick={copyToClipboard}>
                      Copy
                    </Button>
                    <Button size="sm" onClick={clearForm} variant="destructive">
                      Delete
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

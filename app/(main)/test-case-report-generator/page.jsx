"use client";
import React, { useState } from "react";
import {
  Download,
  Plus,
  Trash2,
  Upload,
  FileText,
  FileSpreadsheet,
  Camera,
} from "lucide-react";

const TestCaseGenerator = () => {
  const [testCases, setTestCases] = useState([]);
  const [currentCase, setCurrentCase] = useState({
    name: "",
    status: "pass",
    executionDate: new Date().toISOString().split("T")[0],
    screenshot: null,
    screenshotPreview: null,
  });

  const handleInputChange = (field, value) => {
    setCurrentCase((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentCase((prev) => ({
          ...prev,
          screenshot: e.target.result,
          screenshotPreview: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasteScreenshot = async () => {
    try {
      // Check if clipboard API is available
      if (!navigator.clipboard || !navigator.clipboard.read) {
        alert(
          "Clipboard API not supported in this browser. Please use the upload file option instead."
        );
        return;
      }

      const clipboardItems = await navigator.clipboard.read();
      let imageFound = false;

      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith("image/")) {
            const blob = await clipboardItem.getType(type);
            const reader = new FileReader();
            reader.onload = (e) => {
              setCurrentCase((prev) => ({
                ...prev,
                screenshot: e.target.result,
                screenshotPreview: e.target.result,
              }));
            };
            reader.readAsDataURL(blob);
            imageFound = true;
            break;
          }
        }
        if (imageFound) break;
      }

      if (!imageFound) {
        alert(
          "No image found in clipboard. Please copy an image first or use the upload option."
        );
      }
    } catch (err) {
      console.error("Clipboard error:", err);
      alert(
        "Failed to access clipboard. This might be due to browser security restrictions. Please use the upload file option instead."
      );
    }
  };

  const addTestCase = () => {
    if (!currentCase.name.trim()) {
      alert("Please enter a test case name");
      return;
    }

    const newCase = {
      ...currentCase,
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
    };

    setTestCases((prev) => [...prev, newCase]);
    setCurrentCase({
      name: "",
      status: "pass",
      executionDate: new Date().toISOString().split("T")[0],
      screenshot: null,
      screenshotPreview: null,
    });
  };

  const removeTestCase = (id) => {
    setTestCases((prev) => prev.filter((tc) => tc.id !== id));
  };

  const exportToWord = () => {
    if (testCases.length === 0) {
      alert("No test cases to export");
      return;
    }

    // Create HTML content for Word document
    let htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Test Case Report</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              line-height: 1.6;
            }
            .test-case { 
              page-break-after: always; 
              margin-bottom: 50px; 
              border: 2px solid #333; 
              padding: 20px; 
              background-color: #f9f9f9;
            }
            .test-case:last-child { 
              page-break-after: avoid; 
            }
            .header { 
              background-color: #e9ecef; 
              padding: 15px; 
              margin-bottom: 20px; 
              border-radius: 5px;
            }
            .status-pass { 
              color: #28a745; 
              font-weight: bold; 
              background-color: #d4edda;
              padding: 5px 10px;
              border-radius: 3px;
            }
            .status-fail { 
              color: #dc3545; 
              font-weight: bold; 
              background-color: #f8d7da;
              padding: 5px 10px;
              border-radius: 3px;
            }
            .screenshot { 
              max-width: 100%; 
              height: auto; 
              margin-top: 20px; 
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .field { 
              margin-bottom: 15px; 
              padding: 10px;
              background-color: white;
              border-radius: 3px;
            }
            .label { 
              font-weight: bold; 
              margin-right: 10px; 
              color: #333;
            }
            h1 { 
              color: #333; 
              text-align: center; 
              border-bottom: 3px solid #007bff;
              padding-bottom: 10px;
            }
            h2 { 
              color: #007bff; 
              margin-top: 0;
            }
          </style>
        </head>
        <body>
          <h1>Test Case Execution Report</h1>
          <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Total Test Cases:</strong> ${testCases.length}</p>
          <hr style="margin: 30px 0;">
    `;

    testCases.forEach((testCase, index) => {
      htmlContent += `
        <div class="test-case">
          <div class="header">
            <h2>Test Case ${index + 1}: ${testCase.name}</h2>
          </div>
          <div class="field">
            <span class="label">Status:</span>
            <span class="status-${
              testCase.status
            }">${testCase.status.toUpperCase()}</span>
          </div>
          <div class="field">
            <span class="label">Execution Date:</span>
            <span>${new Date(
              testCase.executionDate
            ).toLocaleDateString()}</span>
          </div>
          <div class="field">
            <span class="label">Report Generated:</span>
            <span>${testCase.timestamp}</span>
          </div>
          ${
            testCase.screenshot
              ? `
            <div class="field">
              <span class="label">Screenshot:</span>
              <br>
              <img src="${testCase.screenshot}" class="screenshot" alt="Test Case Screenshot">
            </div>
          `
              : `
            <div class="field">
              <span class="label">Screenshot:</span>
              <span style="color: #666; font-style: italic;">No screenshot provided</span>
            </div>
          `
          }
        </div>
      `;
    });

    htmlContent += `
        </body>
      </html>
    `;

    // Create and download the file
    const blob = new Blob([htmlContent], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Test-Case-Report-${
      new Date().toISOString().split("T")[0]
    }.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert("Word document exported successfully!");
  };

  const exportToExcel = () => {
    if (testCases.length === 0) {
      alert("No test cases to export");
      return;
    }

    // Create CSV content with proper formatting
    let csvContent =
      "Test Case Name,Status,Execution Date,Report Generated,Screenshot Available\n";

    testCases.forEach((testCase) => {
      // Escape commas and quotes in the data
      const escapeCsv = (str) => {
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
      };

      csvContent +=
        [
          escapeCsv(testCase.name),
          testCase.status.toUpperCase(),
          new Date(testCase.executionDate).toLocaleDateString(),
          escapeCsv(testCase.timestamp),
          testCase.screenshot ? "Yes" : "No",
        ].join(",") + "\n";
    });

    // Add summary row
    csvContent += "\n";
    csvContent += "SUMMARY\n";
    csvContent += `Total Test Cases,${testCases.length}\n`;
    csvContent += `Passed,${
      testCases.filter((tc) => tc.status === "pass").length
    }\n`;
    csvContent += `Failed,${
      testCases.filter((tc) => tc.status === "fail").length
    }\n`;
    csvContent += `Report Generated,${new Date().toLocaleString()}\n`;

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Test-Case-Report-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.setAttribute("style", "display: none;");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert("Excel file (CSV) exported successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Test Case Report Generator
        </h1>
        <p className="text-gray-600">
          Create and manage test case execution reports with screenshots
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Add New Test Case
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Case Name *
            </label>
            <input
              type="text"
              value={currentCase.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter test case name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Status
            </label>
            <select
              value={currentCase.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pass">Pass</option>
              <option value="fail">Fail</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Execution Date
          </label>
          <input
            type="date"
            value={currentCase.executionDate}
            onChange={(e) => handleInputChange("executionDate", e.target.value)}
            className="w-full md:w-1/2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Screenshot
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors">
              <Upload className="w-4 h-4 mr-2" />
              Upload File
              <input
                type="file"
                accept="image/*"
                onChange={handleScreenshotUpload}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={handlePasteScreenshot}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              <Camera className="w-4 h-4 mr-2" />
              Paste from Clipboard
            </button>
          </div>

          {currentCase.screenshotPreview && (
            <div className="mt-3">
              <img
                src={currentCase.screenshotPreview}
                alt="Screenshot preview"
                className="max-w-xs h-auto border border-gray-300 rounded-md"
              />
            </div>
          )}
        </div>

        <button
          onClick={addTestCase}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Test Case
        </button>
      </div>

      {/* Test Cases List */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Test Cases ({testCases.length})
          </h2>

          {testCases.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={exportToWord}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export to Word
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export to Excel
              </button>
            </div>
          )}
        </div>

        {testCases.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No test cases added yet. Add your first test case above.
          </div>
        ) : (
          <div className="space-y-4">
            {testCases.map((testCase) => (
              <div
                key={testCase.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium text-gray-800">
                    {testCase.name}
                  </h3>
                  <button
                    onClick={() => removeTestCase(testCase.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <span className="text-sm text-gray-500">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        testCase.status === "pass"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {testCase.status.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Execution Date:
                    </span>
                    <span className="ml-2 text-sm text-gray-800">
                      {testCase.executionDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Added:</span>
                    <span className="ml-2 text-sm text-gray-800">
                      {testCase.timestamp}
                    </span>
                  </div>
                </div>

                {testCase.screenshot && (
                  <div className="mt-3">
                    <span className="text-sm text-gray-500 block mb-2">
                      Screenshot:
                    </span>
                    <img
                      src={testCase.screenshot}
                      alt="Test case screenshot"
                      className="max-w-sm h-auto border border-gray-300 rounded-md"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCaseGenerator;

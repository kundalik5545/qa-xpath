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
  CircleArrowUp,
  FileChartColumnIncreasing,
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

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
      if (!navigator.clipboard || !navigator.clipboard.read) {
        alert("Clipboard API not supported in this browser.");
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
        alert("No image found in clipboard.");
      }
    } catch (err) {
      console.error("Clipboard error:", err);
      alert("Clipboard access failed. Use upload instead.");
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
          h1 {
            text-align: center;
            color: #333;
          }
          h2 {
            color: #007bff;
          }
          .test-case {
            margin-bottom: 40px;
            border: 1px solid #ccc;
            padding: 15px;
            border-radius: 5px;
          }
          .screenshot {
            max-width: 600px;
            width: 100%;
            height: auto;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-top: 10px;
            display: block;
          }
        </style>
      </head>
      <body>
        <h1>Test Case Execution Report</h1>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    `;

    testCases.forEach((tc, idx) => {
      htmlContent += `
        <div class="test-case">
          <h2>${idx + 1}. ${tc.name}</h2>
          <p><strong>Status:</strong> ${tc.status.toUpperCase()}</p>
          <p><strong>Date:</strong> ${tc.executionDate}</p>
          <p><strong>Added:</strong> ${tc.timestamp}</p>
      `;

      if (tc.screenshot) {
        htmlContent += `
          <p><strong>Screenshot:</strong></p>
          <img src="${tc.screenshot}" alt="Screenshot" class="screenshot" />
        `;
      }

      htmlContent += `</div>`;
    });

    htmlContent += `</body></html>`;

    const blob = new Blob([htmlContent], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Test-Case-Report-${
      new Date().toISOString().split("T")[0]
    }.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToExcel = async () => {
    if (testCases.length === 0) {
      alert("No test cases to export");
      return;
    }

    const workbook = new ExcelJS.Workbook();

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const worksheet = workbook.addWorksheet(`TestCase_${i + 1}`);

      worksheet.columns = [
        { header: "Field", key: "field", width: 20 },
        { header: "Value", key: "value", width: 50 },
      ];

      worksheet.addRow({ field: "Test Case Name", value: testCase.name });
      worksheet.addRow({
        field: "Status",
        value: testCase.status.toUpperCase(),
      });
      worksheet.addRow({
        field: "Execution Date",
        value: new Date(testCase.executionDate).toLocaleDateString(),
      });
      worksheet.addRow({
        field: "Report Generated",
        value: testCase.timestamp,
      });

      if (testCase.screenshot) {
        const base64Image = testCase.screenshot.split(",")[1]; // remove base64 header
        const imageBuffer = Uint8Array.from(atob(base64Image), (c) =>
          c.charCodeAt(0)
        );

        const imageId = workbook.addImage({
          buffer: imageBuffer,
          extension: "png",
        });

        worksheet.addRow({});
        worksheet.mergeCells("A6:B20"); // adjust as needed for image size
        worksheet.addImage(imageId, {
          tl: { col: 0, row: 5 },
          ext: { width: 400, height: 300 },
        });

        worksheet.addRow({ field: "Screenshot", value: "Embedded above" });
      } else {
        worksheet.addRow({
          field: "Screenshot",
          value: "No screenshot provided",
        });
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(
      blob,
      `Test-Case-Report-${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const exportToWebPage = () => {
    if (testCases.length === 0) {
      alert("No test cases to export");
      return;
    }

    let htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Test Case Web Report</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f9fafb;
            padding: 20px;
            line-height: 1.6;
            color: #333;
          }
  
          h1 {
            text-align: center;
            color: #1f2937;
            margin-bottom: 40px;
          }
  
          .test-case {
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            margin-bottom: 30px;
          }
  
          .label {
            display: inline-block;
            font-weight: bold;
            margin-bottom: 4px;
            color: #4b5563;
          }
  
          .value {
            display: block;
            margin-bottom: 12px;
          }
  
          .status-pass {
            color: #16a34a;
            background-color: #dcfce7;
            padding: 4px 10px;
            border-radius: 5px;
            display: inline-block;
            font-weight: 600;
          }
  
          .status-fail {
            color: #dc2626;
            background-color: #fee2e2;
            padding: 4px 10px;
            border-radius: 5px;
            display: inline-block;
            font-weight: 600;
          }
  
          .screenshot {
            margin-top: 10px;
            max-width: 100%;
            border-radius: 5px;
            border: 1px solid #ddd;
          }
  
          hr {
            margin: 30px 0;
            border: none;
            border-top: 2px dashed #e5e7eb;
          }
        </style>
      </head>
      <body>
        <h1>Test Case Execution Report</h1>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <hr />
    `;

    testCases.forEach((tc, idx) => {
      htmlContent += `
        <div class="test-case">
          <h2>${idx + 1}. ${tc.name}</h2>
  
          <div class="value">
            <span class="label">Status:</span>
            <span class="status-${tc.status}">${tc.status.toUpperCase()}</span>
          </div>
  
          <div class="value">
            <span class="label">Execution Date:</span>
            <span>${new Date(tc.executionDate).toLocaleDateString()}</span>
          </div>
  
          <div class="value">
            <span class="label">Added:</span>
            <span>${tc.timestamp}</span>
          </div>
      `;

      if (tc.screenshot) {
        htmlContent += `
          <div class="value">
            <span class="label">Screenshot:</span><br />
            <img src="${tc.screenshot}" class="screenshot" alt="Screenshot for ${tc.name}" />
          </div>
        `;
      } else {
        htmlContent += `
          <div class="value">
            <span class="label">Screenshot:</span> <em>No screenshot provided</em>
          </div>
        `;
      }

      htmlContent += `
        </div>
        <hr />
      `;
    });

    htmlContent += `
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], {
      type: "text/html;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Test-Case-WebReport-${
      new Date().toISOString().split("T")[0]
    }.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Test Case Generator
      </h1>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Test Case Name"
          value={currentCase.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="border p-3 rounded w-full"
        />
        <select
          value={currentCase.status}
          onChange={(e) => handleInputChange("status", e.target.value)}
          className="border p-3 rounded w-full"
        >
          <option value="pass">Pass</option>
          <option value="fail">Fail</option>
        </select>
        <input
          type="date"
          value={currentCase.executionDate}
          onChange={(e) => handleInputChange("executionDate", e.target.value)}
          className="border p-3 rounded w-full"
        />
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <Upload className="w-4 h-4" /> Upload Screenshot
          <input
            type="file"
            accept="image/*"
            onChange={handleScreenshotUpload}
            className="hidden"
          />
        </label>
        <button
          onClick={handlePasteScreenshot}
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <Camera className="w-4 h-4 mr-1" /> Paste Image
        </button>
        <button
          onClick={addTestCase}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Test Case
        </button>
      </div>

      {currentCase.screenshotPreview && (
        <img
          src={currentCase.screenshotPreview}
          alt="Preview"
          className="max-w-sm mb-6 border rounded"
        />
      )}

      <div className="flex gap-4 mb-6">
        <button
          onClick={exportToWord}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          <Download className="w-4 h-4 mr-1" /> Export Word
        </button>
        <button
          onClick={exportToExcel}
          className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
        >
          <Download className="w-4 h-4 mr-1" /> Export CSV
        </button>
        <button
          onClick={exportToWebPage}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export to Web Page
        </button>
      </div>

      <div className="space-y-4">
        {testCases.map((tc) => (
          <div key={tc.id} className="p-4 border rounded shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{tc.name}</h3>
              <button
                onClick={() => removeTestCase(tc.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p>
              Status:{" "}
              <span
                className={`font-semibold ${
                  tc.status === "pass" ? "text-green-600" : "text-red-600"
                }`}
              >
                {tc.status.toUpperCase()}
              </span>
            </p>
            <p>Date: {tc.executionDate}</p>
            <p>Added: {tc.timestamp}</p>
            {tc.screenshot && (
              <img
                src={tc.screenshot}
                alt="Screenshot"
                className="mt-2 max-w-xs border rounded"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCaseGenerator;

"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const TestDataExtractor = () => {
  const [folderName, setFolderName] = useState("");
  const [fileName, setFileName] = useState("");
  const [getDataNumber, setGetDataNumber] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [testDataList, setTestDataList] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("testData")) || [];
    setTestDataList(storedData);
  }, []);

  // Save data to localStorage whenever testDataList changes
  useEffect(() => {
    localStorage.setItem("testData", JSON.stringify(testDataList));
  }, [testDataList]);

  const handleCreateData = (e) => {
    e.preventDefault();
    if (!folderName || !fileName || !getDataNumber) {
      toast.error("Please fill in all fields.");
      return;
    }

    const getDataSnippet = `protected static IEnumerable<TestCaseData> GetData${getDataNumber}(string testCaseName)
{
    string folderName = "${folderName}";
    string fileName = "${fileName}";
    string fileLocation = GetFilePath(folderName, fileName);

    var testData = JsonFileReader(fileLocation);
    var testCases = testData[testCaseName];

    foreach(var testCase in testCases!)
    {
        string userName = testCase["userName"]!.ToString();
        string password = testCase["password"]!.ToString();
        string memorableWord = testCase["memorableWord"]!.ToString();

        yield return new TestCaseData(userName, password, memorableWord);
    }
}`;

    if (editIndex !== null) {
      // Edit existing data
      const updatedList = testDataList.map((item, index) =>
        index === editIndex
          ? { getDataNumber, folderName, fileName, snippet: getDataSnippet }
          : item
      );
      setTestDataList(updatedList);
      setEditIndex(null);
      toast.success("Test data updated successfully!");
    } else {
      // Add new data
      setTestDataList([
        ...testDataList,
        { getDataNumber, folderName, fileName, snippet: getDataSnippet },
      ]);
      toast.success("Test data added successfully!");
    }

    // Clear input fields
    setFolderName("");
    setFileName("");
    setGetDataNumber("");
  };

  const handleEdit = (index) => {
    const item = testDataList[index];
    setFolderName(item.folderName);
    setFileName(item.fileName);
    setGetDataNumber(item.getDataNumber);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedList = testDataList.filter((_, i) => i !== index);
    setTestDataList(updatedList);
    toast.success("Test data deleted successfully!");
  };

  return (
    <div className="container min-h-screen mx-auto p-5 flex flex-col items-center">
      {/* Form Card */}
      <Card className="max-w-xl w-full p-6 shadow-lg rounded-lg border border-gray-300 bg-white">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4 text-center">
            <Link href="/">GetData Generator</Link>
          </h2>
          <form className="space-y-3" onSubmit={handleCreateData}>
            <div className="flex flex-wrap justify-between gap-3">
              <Label className="text-sm font-semibold w-full sm:w-1/3">
                GetData Number
              </Label>
              <Input
                type="number"
                placeholder="e.g., 20"
                value={getDataNumber}
                onChange={(e) => setGetDataNumber(e.target.value)}
                className="w-full sm:w-2/3"
              />
            </div>

            <div className="flex flex-wrap justify-between gap-3">
              <Label className="text-sm font-semibold w-full sm:w-1/3">
                Folder Name
              </Label>
              <Input
                type="text"
                placeholder="Folder Name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full sm:w-2/3"
              />
            </div>

            <div className="flex flex-wrap justify-between gap-3">
              <Label className="text-sm font-semibold w-full sm:w-1/3">
                File Name
              </Label>
              <Input
                type="text"
                placeholder="File Name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full sm:w-2/3"
              />
            </div>

            <div className="flex justify-between mt-4">
              <Button type="submit">
                {editIndex !== null ? "Update Data" : "Create Data"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setFolderName("");
                  setFileName("");
                  setGetDataNumber("");
                  setEditIndex(null);
                }}
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Generated Data Table */}
      {testDataList.length > 0 && (
        <div className="mt-6 w-full max-w-4xl">
          <h3 className="text-xl font-semibold mb-3 text-center">
            Generated Data
          </h3>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full bg-white border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">GetData Number</th>
                  <th className="border p-2">Snippet</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testDataList.map((item, index) => (
                  <tr key={index} className="border hover:bg-gray-100 ">
                    <td className="border p-2 align-center">{`GetData${item.getDataNumber}`}</td>
                    <td className="border p-2 align-top w-full">
                      <pre className="text-sm bg-gray-100 p-2 rounded w-full whitespace-pre-wrap">
                        {item.snippet}
                      </pre>
                    </td>
                    <td className="border p-2 align-center w-full space-y-3">
                      <Button
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(item.snippet);
                          toast.success("Method copied!");
                        }}
                      >
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(index)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
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
};

export default TestDataExtractor;

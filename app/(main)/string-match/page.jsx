"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const getWordCount = (str) => (str.trim() ? str.trim().split(/\s+/).length : 0);
const getCharCount = (str) => str.length;

const diffWords = (a, b) => {
  const aWords = a.trim().split(/\s+/);
  const bWords = b.trim().split(/\s+/);
  const maxLen = Math.max(aWords.length, bWords.length);
  let diffs = [];
  for (let i = 0; i < maxLen; i++) {
    if (aWords[i] !== bWords[i]) {
      diffs.push({ index: i, a: aWords[i] || "", b: bWords[i] || "" });
    }
  }
  return diffs;
};

const StringMatch = () => {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");

  const wordCountA = getWordCount(textA);
  const wordCountB = getWordCount(textB);
  const charCountA = getCharCount(textA);
  const charCountB = getCharCount(textB);

  const differences = diffWords(textA, textB);

  return (
    <div className="string-match" id="string-match">
      <h2 className="text-2xl font-semibold mb-6 text-left text-blue-500">
        Word Compare Tool
      </h2>

      <div className="bg-white rounded-xl shadow-lg p-8 max-w-5xl mx-auto my-10">
        {/* First Text Area */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="font-semibold mb-1 block text-gray-700">
              First Text
            </label>
            <Button className="" variant="ghost" onClick={() => setTextA("")}>
              Clear
            </Button>
          </div>
          <textarea
            rows={7}
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder="Enter first text"
            id="first-text"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none bg-gray-50 focus:border-indigo-400 transition resize-vertical"
          />
          <div className="text-sm text-gray-500 mt-1">
            Words: <b>{wordCountA}</b> &nbsp;|&nbsp; Characters:{" "}
            <b>{charCountA}</b>
          </div>
        </div>

        {/* Second Text Area */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <label className="font-semibold mb-1 block text-gray-700">
              Second Text
            </label>
            <Button className="" variant="ghost" onClick={() => setTextB("")}>
              Clear
            </Button>
          </div>
          <textarea
            rows={7}
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder="Enter second text"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none bg-gray-50 focus:border-indigo-400 transition resize-vertical"
          />
          <div className="text-sm text-gray-500 mt-1">
            Words: <b>{wordCountB}</b> &nbsp;|&nbsp; Characters:{" "}
            <b>{charCountB}</b>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4">
            Differences (by word):
          </h3>
          {differences.length === 0 ? (
            <div className="text-green-600 font-medium text-center">
              No differences.
            </div>
          ) : (
            <ul className="list-none p-0 m-0 space-y-3">
              {differences.map((diff, idx) => (
                <li
                  key={idx}
                  className="bg-gray-100 rounded-lg px-4 py-3 flex items-center gap-3"
                >
                  <span className="text-xs bg-indigo-100 text-indigo-800 rounded px-2 py-0.5 font-medium mr-2">
                    Word {diff.index + 1}
                  </span>
                  <span className="text-red-600 font-semibold">
                    {diff.a || (
                      <em className="text-red-700 font-normal">missing</em>
                    )}
                  </span>
                  <span className="text-gray-400 mx-2">vs.</span>
                  <span className="text-blue-700 font-semibold">
                    {diff.b || (
                      <em className="text-blue-800 font-normal">missing</em>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StringMatch;

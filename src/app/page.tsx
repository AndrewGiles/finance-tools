'use client'

import { ChangeEvent, DragEvent, useState } from "react";
import csv from 'csv-parser';
import streamifyString from 'streamify-string';

type TransactionRow = {
  [key: string]: string,
};

type Transaction = {
  date: Date,
  amount: number,
  category: string,
  accountName: string,
  labels: string[],
  notes: string,
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        await processFile(file);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setIsHovered(false);
      setIsLoading(true);
      try {
        await processFile(file);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovered(true);
  };

  const handleDragLeave = () => {
    setIsHovered(false);
  };

  const processFile = async (file: File) => {
    if (file.type !== 'text/csv') {
      console.error('Invalid file format. Please upload a CSV file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        const csvContent: string = event.target.result as string;
        parseCSV(csvContent);
      }
    };

    reader.readAsText(file);
  };

  const parseCSV = (csvContent: string) => {
    const stream = streamifyString(csvContent);
    const parsedData: Transaction[] = [];

    stream.pipe(csv())
      .on('data', (row: TransactionRow) => {
        const isDebit = row['Transaction Type'] === 'debit';
        const trueAmount = isDebit ? -row['Amount'] : +row['Amount'];

        parsedData.push({
          date: new Date(row["Date"]),
          amount: trueAmount,
          category: row["Category"],
          accountName: row["Account Name"],
          labels: row["Labels"].split(','),
          notes: row["Notes"],
        });
      })
      .on('end', () => {
        setTransactionData(parsedData);
      })
      .on('error', (error: Error) => {
        console.error('CSV parsing error:', error);
      });
  };

  if (transactionData.length) return (
    <div className="text-black bg-white overflow-y-auto">
      {transactionData.map((transaction: Transaction) => (
        <div className="flex gap-x-2">
          <span>
            {transaction.date.toLocaleDateString()}
          </span>
          <span>
            {transaction.accountName}
          </span>
          <span>
            {transaction.category}
          </span>
          <span>
            {transaction.amount}
          </span>
        </div>
      ))}
    </div>
  )

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-100 transition duration-300 ${isHovered ? 'bg-blue-100' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="bg-white p-8 rounded-md shadow-md max-w-md text-center">
        <h1 className="text-4xl mb-4 font-serif text-blue-600">Gilez Apps</h1>
        <h2 className="text-3xl mb-8 font-serif text-gray-800">Mint Financial Tools</h2>
        <label
          htmlFor="fileInput"
          className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-md p-8 transition duration-300 hover:border-blue-500 ${isLoading ? 'opacity-50' : ''}`}
        >
          <div className="mb-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 1a9 9 0 110 18 9 9 0 010-18zM5 9a1 1 0 011-1h8a1 1 0 010 2H6a1 1 0 01-1-1zM9 5a1 1 0 00-1 1v6a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-lg font-semibold text-gray-600">
              {isLoading ? 'Processing...' : selectedFile ? selectedFile.name : 'Drag and drop your CSV file here'}
            </p>
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <div className="flex items-center justify-center mt-4">
            <button
              type="button"
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              {selectedFile ? 'Change File' : 'Browse'}
            </button>
          </div>
        </label>
      </div>
    </div>
  );
}

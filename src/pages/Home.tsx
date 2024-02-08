'use client'

import csv from 'csv-parser';
import { useEffect, useState } from "react";
import streamifyString from 'streamify-string';
import FileUpload from "../components/FileUpload";

type TransactionRow = {
  [key: string]: string,
};

interface Transaction {
  date: Date;
  amount: number;
  category: string;
  accountName: string;
  labels: string[];
  notes: string;
}

interface MonthlyBucket {
  date: Date;
  transactions: Transaction[];
}

type MonthlyBucketsMap = {
  [yearMonth: string]: Transaction[];
};

export default function Home() {
  const [dataProcessed, setDataProcessed] = useState(false);
  const [monthlyBuckets, setMonthlyBuckets] = useState<MonthlyBucket[]>([]);

  useEffect(() => {
    console.log({ monthlyBuckets })
  }, [monthlyBuckets])

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
        const monthlyBucketsMap = parsedData.reduce((monthlyBucketsMap: MonthlyBucketsMap, transaction: Transaction) => {
          const yearMonthString = `${transaction.date.getFullYear()}-${transaction.date.getMonth() + 1}`;
          monthlyBucketsMap[yearMonthString] = [...monthlyBucketsMap[yearMonthString] || [], transaction];
          return monthlyBucketsMap;
        }, {} as MonthlyBucketsMap);

        const monthlyBuckets: MonthlyBucket[] = Object.entries(monthlyBucketsMap)
          .sort(([dateStringA], [dateStringB]) => dateStringA < dateStringB ? -1 : 1)
          .map(([dateString, transactions]) => ({
            date: new Date(dateString),
            transactions,
          }));

        setMonthlyBuckets(monthlyBuckets);
        setDataProcessed(true);
      })
      .on('error', (error: Error) => {
        console.error('CSV parsing error:', error);
      });
  };

  if (dataProcessed) return (
    <div className="min-h-screen text-black bg-white overflow-y-auto">
      Monthly Data:

    </div>
  );

  return (
    <FileUpload
      processFile={processFile}
    />
  );
}

# Gilez Financial Tools

Welcome to the Gilez Financial Tools! This application is designed to help you parse Intuit Mint transactions into useful data and graphs.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Gilez Financial Tools aims to simplify the process of parsing and visualizing transaction data from Intuit Mint. With this app, you can easily upload your Mint transactions in CSV format and convert them into a more structured format with additional features.

## Features

- **CSV Parsing:** Upload Mint transactions in CSV format and parse them into a structured data format.
- **Data Enhancement:** Automatically add useful fields such as `TrueAmount` based on transaction type.
- **Graphical Visualization:** Visualize your transactions with graphs and charts for better insights.

## Getting Started

To get started with Gilez Financial Tools, follow these steps:

1. Clone the repository: `git clone https://github.com/AndrewGiles/finance-tools.git`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Usage

1. Access the web app through the provided URL or run it locally.
2. Drag and drop your Mint transactions CSV file onto the designated area or use the file input to select a file.
3. The app will process the file, enhance the data, and provide visualizations.

## Technologies Used

- **React:** Frontend library for building user interfaces.
- **Next.js:** React framework for server-rendered web applications.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **csv-parser:** Library for parsing CSV files.
- **streamify-string:** Library for converting strings into readable streams.
- **PapaParse:** CSV parsing library.

## Contributing

If you'd like to contribute to the project, please follow the guidelines in [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).

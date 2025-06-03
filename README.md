# RAID Calculator

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Easily calculate and visualize your RAID configurations.**

## Project Description

This project is a web-based RAID calculator designed to help users determine the storage capacity and performance characteristics of different RAID configurations based on the number and size of their hard drives or SSDs. By entering the number and size of disks, the calculator provides a breakdown clearly showing the usable capacity, protection space, and estimated performance, as well as a visual representation of the disk layout.

## Features

- **Comprehensive Calculations:** Accurate usable capacity calculation for common RAID levels (RAID 0, 1, 5, 6, 10).
- **Interactive Disk Layout:** Visual representation of how data and parity/mirroring are distributed across disks for better understanding of the selected RAID level.
- **Performance Estimation:** Get insights into expected read and write speeds for your configuration.
- **Flexible Input:** Support for choosing between various disk capacities and HDD/SATA SSD types.
- **Modern Interface:** Responsive design ensuring usability on desktop and mobile devices.
- **Dark Mode:** Comfortable viewing experience in low-light environments.

## Live Demo

[Deploy your application and add the link here!]

## Screenshots / GIF

![RAID Capacity Calculator Screenshot](images/raid.png)

## Setup

Follow these simple steps to set up and run the project locally.

### Prerequisites

- Node.js and npm (or yarn)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/canberkys/RAID_Calculator.git
   ```
2. Navigate to the project directory:
   ```bash
   cd RAID_Calculator
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

To run the application in development mode:

```bash
npm run dev
```

This will start a development server. Open your web browser and visit the address shown in the terminal (usually `http://localhost:5173/`).

## Running Tests

[Instructions on how to run tests will be added here once tests are implemented.]

## Technologies Used

- **Frontend:** React, TypeScript, Tailwind CSS
- **Bundler:** Vite
- **Icons:** Lucide Icons
- **State Management:** React Hooks
- **Formatting:** Prettier, ESLint

## Roadmap

Refer to the [ROADMAP.md](ROADMAP.md) file for planned features and enhancements.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See the `LICENSE` file for more information. (Note: A LICENSE file may need to be added if not already present)

## Contact

Canberk Kilicarslan - ck@canberkki.com

Project Link: [https://github.com/canberkys/RAID_Calculator](https://github.com/canberkys/RAID_Calculator) 

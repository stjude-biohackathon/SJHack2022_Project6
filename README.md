# SJHack2022_Project6 - SimplySamples

This project is humble attempt of BioHackathon Team #6 to solve sample management problem faced by many lab scientists working hardly to gather all sample data and figure out connections between them. 

Aim of this project is to..
* provide single webpage to view, edit and add sample data. 
* Show/hide, filter and export any column from any table.
* Upload their own data as CSV files.  


<!-- ABOUT THE PROJECT -->
## About The Project

<p align="right">(<a href="#top">back to top</a>)</p>


### Built With

* [Docker](https://www.docker.com/)
* [Django](https://www.djangoproject.com/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps:

### Prerequisites

* Docker Installation - Download apporpirate Docker installtion file for your OS: https://docs.docker.com/get-docker/

### Installation and setup

1. Once docker is installed, clone the repo on you local folder:
   ```sh
   git clone https://github.com/stjude-biohackathon/SJHack2022_Project6.git
   ```
2. Go to the repo root and run this docker commands to build image (will take few minute for first time, should be faster on sunsequent run): 
   ```sh
   docker-compose build
   ```
3. Start database container first using following command:
   ```sh
   docker-compose up db
   ```
   Once you see following LOG in terminal, go to next step:
   ```sh
   db_1   | LOG:  database system is ready to accept connections
   ```
4. Open new terminal tab and start Django app container using following command:
   ```sh 
   docker-compose up web
   ```
   Once you see following LOG in terminal, the app is ready!
   ```sh
   web_1  | Starting development server at http://0.0.0.0:8000/
   web_1  | Quit the server with CONTROL-C.
   ```

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Usage

Coming soon..
<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [x] Add Django Backend
- [x] Support Rest api with sample db
- [ ] Add React frontend
- [ ] Show sample data in table
- [ ] Allow filtering of data
- [ ] Allow users to select any column from any tables
- [ ] Allow users to export data into csv file or generate reports
- [ ] Allow users to add new tables or new data for existing tables
- [ ] Add security feature by implementing login

<p align="right">(<a href="#top">back to top</a>)</p>

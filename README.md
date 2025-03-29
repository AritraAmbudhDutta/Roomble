Roomble
==================================

This full-stack web application is made as a course project of [CS253](https://www.cse.iitk.ac.in/users/isaha/Courses/sdo25.shtml/): Software Development and Operations in spring 2024 under the guidance of [Prof. Indranil Saha](https://www.cse.iitk.ac.in/users/isaha/).

Roomble is an integrated property rental and flatmate matching application which seeks to solve the common problems faced by young newcomers to metro cities. Users are classified into 2 different categories - tenants and landlords. The platform simplifies the process of finding suitable rentals and appropriate flatmates with the following salient features -

### For Tenants:
* Search properties efficiently by location, price range, amenities, and more
* Find compatible flatmates using our smart recommendation algorithms and compatibility score
* Message landlords/flatmates directly within the platform
* Rate and review properties and flatmates after interactions

### For Landlords:
* List properties with detailed descriptions and photos
* Manage property availability and tenant inquiries
* Receive reviews from verified tenants

The interface of the web app is simple and intuitive ensuring that users will not face any difficulties while using the application and will have a seamless experience. 

## Group Details

| Name                      | Roll no. | Email Id                |
| ------------------------- | -------- | ----------------------- |
| Aarsh Jain     | 230015   | aarshjain23@iitk.ac.in    |
| Aritra Ambudh Dutta   | 230191   | aritraad23@iitk.ac.in   |
| Aritra Ray        | 230193   | aritrar23@iitk.ac.in   |
| Bhukya Vaishnavi      | 230295   | bhukyav23@iitk.ac.in     |
| Bikramjeet Singh              | 230298   | bsingh23@iitk.ac.in   |
| Hitarth Makawana   | 230479   | hitarthkm23@iitk.ac.in |
| Shlok Jain       | 230493   | jainshlok23@iitk.ac.in     |
| Ronav Puri   | 230815   | ronavg23@iitk.ac.in  |
| Rathod Ayushi               | 230844   | rathoday23@iitk.ac.in      |
| Saksham Verma        | 230899   | sakshamv23@iitk.ac.in  |
| Surepally Pranaysriharsha    | 231057    | surepally23@iitk.ac.in

## How to run the software locally?

* Make sure you have Node.js and pip installed in your system.

Clone the repository -

```
git clone https://github.com/Shlok-Jain/Roomble/
```

Run the following commands to start the backend server -

```
cd Roomble
```
Open another terminal, with the same working directory and run the following commands.
```
cd backend
npm install
node index.js
```
Following this, the server should start functioning on `http://localhost:3000`

Now, on the original tab,
```
cd frontend
npm install
npm run dev
```

Go to the localhost web address which must have been printed on the terminal.

## Software Requirement Specification Document

The Software Requirements Specification (SRS) document describes what the software will do and how it will be expected to perform. It also describes the product's functionality to fulfill all stakeholders' needs.

Link to SRS: [Roomble SRS doc](https://github.com/Shlok-Jain/Roomble/blob/main/Documents/Roomble_Team7_SRS.pdf)

## Software Design Document

The Software Design Document (SDD) describes software created to facilitate analysis, planning, implementation, and decision-making. This explains how thr software product will be built to meet a set of technical requirements.

Link to SDD: [Roomble Design doc](https://github.com/Shlok-Jain/Roomble/blob/main/Documents/Design_Doc_CS253_Marauders.pdf)

## Software Implementation Document

The Software Implementation Document (SID) describes how the software product is built to meet a set of technical requirements. This document talks about implementation details like integration, CI/CD, hosting, VCS; it provides a surface-level overview of codebases and completeness of the application.

Link to SID: [Roomble Implementation doc](https://github.com/Shlok-Jain/Roomble/blob/main/Documents/Implementation_Document_Group7_Marauders.pdf)

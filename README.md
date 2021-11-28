# Procto- An Automatic Exam Proctoring tool for Online Exams

# About Procto
**Procto** is an online proctoring tool that Professors can use to create exams that are Proctored using AI. They can also view the status of each student taking the exam in Real-Time. **It is fast, easy to use, and incredibly convenient with a minimalistic UI!**
To create an exam, just register and log in to your account, click on the Create Exam button and enter details like Exam Name, Google Form Link, Start Date and Time and duration. Procto generates a unique exam code that you can distribute among the students. The students start the exam by logging in and entering the exam code while the exam is running. While they are taking the exam they are **proctored using an AI-based system**. By entering the exam code, the professor can see the status of all the students in **real-time**.

# Tech Stack
**Frontend-** React.js, Redux, Material-UI, Materialise.css
**Backend-** Node.js, Express.js, Passport.js, JWT
**Database-** MongoDB Atlas, Mongoose
**Deep Learning Model-** Tensorflow Implementation of CocoSSD Object Detection Model

# Video Demo
[![Video Link](https://i9.ytimg.com/vi/8b6_rfUunG4/mq2.jpg?sqp=CJiYjY0G&rs=AOn4CLB0Y_JLes_6GY3X1obVKle_GKbfww)](https://www.youtube.com/watch?v=8b6_rfUunG4&ab)

# Hosted Application URL
https://online-exam-proctoring.herokuapp.com/

# About The Author
Hello! I am Rohit Tuli, **Final Year BTech CSE student at IIT Ropar**. I am very passionate about software development and problem-solving. Previously I have interned at **Flipkart** and **National University of Singapore**. Currently, I am working on a **year-long Research Project in collaboration with Microsoft India.** 
I was also a **National Finalist (Top 3) in Flipkart Grid Challenge 2.0**, and **2nd Position in Global Cyber Challenge**, an international hackathon conducted by Government of India. 
I love problem-solving and actively participate in many Competitive Programming Contests. I have also represented my college in ACM ICPC Regionals.

# How to Use?

## Note
**The website is hosted on [This Link](https://online-exam-proctoring.herokuapp.com/).**
**I recommend running on this URL instead of running on your machine**

If you wish to run it on your machine, 
1. Clone the Repository
2. Move to the Microsoft-Engage-Project folder
`cd Microsoft-Engage-Project`
3. Run `npm install`
4. Move to client directory and run npm install again. `cd client` and `npm install`
5. Move back to parent directory `cd ..`
6. Run command npm run dev
`npm run dev`
This concurrently runs server and frontend. Give a few seconds for frontend to load on localhost:3000
## As a Professor:

1. Open https://online-exam-proctoring.herokuapp.com/ It might take some time to load for the first time, will be faster from the next time.
2. Click on Register, CHECK are you an Instructor to create a professor account.
3. Login to your account.
3. Click on Create Exam Button. Fill out the form. In the Exam Link option you can enter any link like Google form, Microsoft Form etc on which you have created the quiz. It is advised to use Google Form.
4. Click on Generate Code button, it generates a code and shows it in the corresponding input field. Note it down. Click Create Exam Button to create the exam.
5. Once the exam is live, you can enter the exam code in the homepage and click the Check Logs Button to see the status of the students giving the exam in real time. To refresh the table just click Check Logs again.

## As a Student
1. Open https://online-exam-proctoring.herokuapp.com/ It might take some time to load for the first time, will be faster from the next time.
2. Click on Register, UNCHECK are you an Instructor to create a professor account.
3. Login to your account.
4. When the exam has started, enter the exam code provided by your professor and click the button to start the exam.
5. Make sure you are sitting in a WELL LIT Room. Do not try to cheat because your actions are being recorded!


# List of Features

## Automatic Proctoring Features:

1. Person Detection: If the student leaves the frame and does not return within a few seconds, this action gets recorded.
2. Multiple People Detection: If at any point during the exam more than one person is visible through the webcam, this action gets recorded. Faces need not be visible as its person detection not face detection.
3. Mobile Detection: If the student is detected using a mobile phone during the exam, this action gets recorded.
4. Prohibited Object Detection: If the student tries to use a prohibited object like a Book or Laptop it gets recorded.
5. Tab Change Detection: The tool counts the number of time student tried to change the tab or open some other application.
6. Prohibited Key Press Detection: The tool counts the number of times the student tries to press a prohibited key (Ctrl, Alt). This is to discourage copy-paste and sharing exam questions with others or using other shortcuts.
7. Right-Click Prevention: Right-clicking when the exam is going on is not possible.
8. Exam Restart: If due to network or any other issue the exam gets interrupted, it is possible to restart the exam within the running time (between start and end of the exam), but the time lost is not recovered. 

Note- Since in the current iteration of the project I am using google form link from professor instead of making questions in the application itself, it is impossible to put key listeners and right click prevention in it since its a third party app and React prevents it due to security reasons.
To test these features, please do ctrl press, alt press and right click on left side of screen only.

## Professor Side Features:
1. Simple to use exam creation dialog box which automatically copies generated exam code to Clipboard.
2. Dynamic Student Logs Table with sort by name, email, etc functionality, Pagination, no of entries per page selector and buttons for going to next and previous pages.
3. Advanced Search functionality for logs table. Can search by a part of name, email etc with search results getting updated as you type. It also allows you to sort in ascending or descending order based on each column by clicking on column header. 

 

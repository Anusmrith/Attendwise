# AttendWise 📊

**AttendWise** is a smart college attendance management system designed to help students track their attendance, understand their academic attendance status, and make better decisions about attending classes.

The application calculates attendance percentages, identifies attendance risks, and provides recommendations based on the student's minimum required attendance percentage.

## 🚀 Features

* 🔐 User registration and login
* 👤 Personal user dashboard
* 📊 Overall attendance summary
* 📚 Subject-wise attendance tracking
* 🟢 Safe / 🟡 Warning / 🔴 At Risk status
* 📈 Attendance percentage calculation
* 🎯 Custom minimum attendance requirement
* 🧮 Calculates classes required to reach the minimum percentage
* 🛌 Calculates how many classes can be missed safely
* ☁️ Cloud database using Supabase
* 🔒 Row Level Security for user data
* 🗑️ Delete subjects
* 📱 Responsive and mobile-friendly interface
* ✅ Input validation

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla JS)

### Backend & Database

* Supabase
* PostgreSQL
* Supabase Authentication
* Row Level Security (RLS)

### Development Tools

* Visual Studio Code
* Git
* GitHub

## 📂 Project Structure

```text
AttendWise/
│
├── index.html          # Application interface
├── style.css           # Styling and responsive design
├── script.js           # Application logic and Supabase integration
├── README.md           # Project documentation
└── .gitignore          # Ignored files
```

## ⚙️ How It Works

1. Create an account or log in.
2. Enter your subjects.
3. Enter the number of classes attended.
4. Enter the total number of classes.
5. Set your required minimum attendance percentage.
6. AttendWise calculates your current attendance.
7. The system determines your attendance status.
8. If your attendance is below the requirement, AttendWise calculates how many consecutive classes you need to attend to recover.
9. If your attendance is safe, it calculates how many classes you can potentially miss while remaining above the minimum requirement.

## 📊 Attendance Status

AttendWise uses the user's minimum attendance requirement to determine the current status.

| Status         | Meaning                                                   |
| -------------- | --------------------------------------------------------- |
| 🟢 **Safe**    | Attendance is at or above the required percentage         |
| 🟡 **Warning** | Attendance is close to the required percentage            |
| 🔴 **At Risk** | Attendance is significantly below the required percentage |

## 🧮 Attendance Calculation

The basic attendance percentage is calculated using:

```text
Attendance % = (Classes Attended / Total Classes) × 100
```

For example:

```text
Classes Attended = 61
Total Classes = 75

Attendance = (61 / 75) × 100
           = 81.33%
```

## 🔐 Authentication & Security

AttendWise uses **Supabase Authentication** for user registration and login.

Each subject is associated with the authenticated user's ID.

Supabase **Row Level Security (RLS)** ensures that users can only access their own attendance records.

> Never add a Supabase `service_role` or secret key to frontend JavaScript. Only use the browser-safe publishable/anon key.

## 🗄️ Database

The application stores subject information in a PostgreSQL database through Supabase.

Each subject contains information such as:

```text
id
user_id
subject_name
attended
total
minimum_percentage
created_at
```

## 💻 Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/Anusmrith/AttendWise.git
```

### 2. Open the project

Open the project folder in Visual Studio Code.

### 3. Configure Supabase

Create a Supabase project and configure the required database table and authentication settings.

Add your Supabase project URL and publishable key to:

```text
script.js
```

### 4. Run the application

Open `index.html` in your browser.

For the best development experience, you can also use the **Live Server** extension in VS Code.

## 🔮 Future Improvements

Possible future improvements include:

* 📅 Attendance history
* 📈 Attendance charts and analytics
* 📆 Timetable integration
* 🔔 Attendance alerts and notifications
* 📱 Progressive Web App (PWA)
* 🎓 College timetable integration
* 📊 Semester-level attendance analytics
* 📥 Export attendance reports
* 🌙 Dark mode
* 🤖 AI-powered attendance predictions

## 🎯 Learning Goals

This project was developed as a practical learning project to understand:

* HTML structure
* CSS responsive design
* JavaScript programming
* DOM manipulation
* Form handling
* Authentication
* Database operations
* PostgreSQL
* Supabase
* Row Level Security
* Git and GitHub
* Full-stack web development

## 👨‍💻 Author

**Anusmrith M M**

BTech Computer Science
College of Engineering Karunagappally
Graduating 2027

### 🔗 Links

* GitHub: `https://github.com/Anusmrith`
* LinkedIn: Add your LinkedIn profile here

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

**AttendWise — Know your attendance. Plan smarter.**

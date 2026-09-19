# AttendWise 📊

**AttendWise** is a modern college attendance management system and cross-platform application designed to help students track their attendance, analyze academic risks, and make data-driven decisions about attending classes.

Available as a **responsive web app**, **Progressive Web App (PWA)**, and **native mobile app (Android & iOS)** via Capacitor.

---

## 🚀 Features

* 🔐 **Secure Authentication**: User registration and login powered by Supabase Auth.
* 👤 **Personalized Dashboard**: User-specific attendance records protected with Row Level Security (RLS).
* 📊 **Overall Attendance Summary**: Real-time aggregated attendance percentage across all subjects.
* 📚 **Subject-wise Tracking**: Track attended vs. total classes for each individual subject.
* 🟢 **Status Indicators**: Instant visual feedback — **Safe** 🟢, **Warning** 🟡, or **At Risk** 🔴.
* 🎯 **Custom Thresholds**: Configure your institution's minimum attendance requirement (e.g., 75%, 80%).
* 🧮 **Smart Recovery Calculation**: Automatically calculates how many consecutive classes you must attend to reach safe standing.
* 🛌 **Bunk Margin / Safety Margin**: Calculates how many upcoming classes you can safely miss without dropping below the requirement.
* 📱 **PWA & Offline Ready**: Service worker caching for fast loading and offline reliability; installable directly from the browser on Android, iOS, and desktop.
* 📲 **Native Mobile Support**: Built-in Capacitor project configurations for native Android (`.apk` / `.aab`) and iOS builds.
* 🎨 **Modern Responsive UI**: Clean interface optimized for all screen sizes, including notch and safe-area insets.
* 🗑️ **Subject Management**: Easily add, update, and remove subject records.

---

## 🛠️ Tech Stack

### Frontend & Core
* **HTML5** & **CSS3** (Responsive design, Safe-Area insets, CSS variables)
* **JavaScript (Vanilla JS ES6+)**
* **Progressive Web App (PWA)**: Web App Manifest & Service Worker (`sw.js`)

### Mobile & Cross-Platform
* **Capacitor 8** (`@capacitor/core`, `@capacitor/cli`)
* **Android**: Native Android Studio project (`android/`)
* **iOS**: Native Xcode project (`ios/`)

### Backend & Database
* **Supabase**
* **PostgreSQL**
* **Supabase Authentication**
* **Row Level Security (RLS)**

### Tooling & Automation
* **Node.js** & **npm**
* **Sharp** (Automated icon generator script)
* **Git** & **GitHub**

---

## 📂 Project Structure

```text
attendwise/
│
├── index.html               # Main application interface & PWA tags
├── style.css                # Application styling & responsive layouts
├── script.js                # Application logic, Supabase client & PWA prompt
├── sw.js                    # Service Worker for offline caching
├── manifest.webmanifest     # PWA manifest metadata & app icons configuration
│
├── capacitor.config.json    # Capacitor configuration (App ID: com.attendwise.app)
├── android/                 # Complete native Android Studio project
├── ios/                     # Complete native iOS Xcode project
├── icons/                   # App icons (PWA, Android & iOS launcher icons, SVG source)
│
├── scripts/
│   ├── serve.js             # Zero-dependency local development server
│   ├── build.js             # Asset compiler for mobile synchronization
│   └── generate-icons.js    # Automated icon generation script
│
├── MOBILE_GUIDE.md          # Comprehensive step-by-step mobile build guide
├── package.json             # NPM dependencies and development scripts
├── .gitignore               # Git ignored directories (node_modules, build outputs)
└── README.md                # Project documentation
```

---

## ⚙️ How It Works

1. **Sign Up / Log In**: Authenticate using your email and password.
2. **Add Subjects**: Enter subject names along with classes attended and total classes conducted.
3. **Set Minimum Requirement**: Set your target attendance percentage (default is typically 75%).
4. **Review Metrics**:
   - **Current Percentage**: `(Attended / Total) × 100`
   - **Status Pill**: Instant indicator based on your threshold.
   - **Recommendations**:
     - If below requirement: Displays exact number of consecutive classes required to get back on track.
     - If above requirement: Displays safe margin of classes that can be missed without falling below the limit.

---

## 📊 Attendance Status Logic

AttendWise compares your percentage directly against your custom target:

| Status | Condition | Meaning |
| :--- | :--- | :--- |
| 🟢 **Safe** | `Percentage >= Target` | Attendance is safe. Safe margin shows how many classes you can miss. |
| 🟡 **Warning** | `Percentage` within 5% below target | Close to the threshold; attendance needs immediate attention. |
| 🔴 **At Risk** | `Percentage` significantly below target | Urgent action required; shows consecutive classes needed to recover. |

---

## 🧮 Calculation Formulas

### 1. Basic Attendance Percentage
$$\text{Attendance \%} = \left( \frac{\text{Attended Classes}}{\text{Total Classes}} \right) \times 100$$

### 2. Classes Needed to Recover
To find classes ($x$) needed to reach target percentage ($T$):
$$\frac{\text{Attended} + x}{\text{Total} + x} \ge \frac{T}{100} \implies x = \left\lceil \frac{T \times \text{Total} - 100 \times \text{Attended}}{100 - T} \right\rceil$$

### 3. Safe Classes to Miss
To find classes ($y$) that can be missed without dropping below target ($T$):
$$\frac{\text{Attended}}{\text{Total} + y} \ge \frac{T}{100} \implies y = \left\lfloor \frac{100 \times \text{Attended} - T \times \text{Total}}{T} \right\rfloor$$

---

## 🔐 Authentication & Security

* **Supabase Authentication**: User passwords and sessions are securely managed through Supabase.
* **Row Level Security (RLS)**: PostgreSQL RLS policies ensure that authenticated users can only query, insert, update, or delete their own attendance records.
* **API Key Safety**: Only the browser-safe `anon` / publishable key is used on client side. Never expose the `service_role` key.

---

## 💻 Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/Anusmrith/Attendwise.git
cd Attendwise
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Supabase
Ensure your Supabase project URL and anon public key are set in `script.js`:
```javascript
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "your-anon-publishable-key";
```

### 4. Run the Local Development Server
```bash
npm run serve
```
Open [http://localhost:3000](http://localhost:3000) in your browser. (Alternatively, you can open `index.html` using VS Code Live Server).

---

## 📱 Mobile Installation & Build Guide

AttendWise offers multiple options for mobile devices. For complete step-by-step instructions, see **[MOBILE_GUIDE.md](MOBILE_GUIDE.md)**.

### Option A: Install as PWA (Android & iOS)
* **Android**: Open in Chrome and tap **"Install App"** on the prompt or browser menu.
* **iOS**: Open in Safari, tap the **Share** icon, and tap **"Add to Home Screen"**.

### Option B: Build Native Android App (`.apk`)
```bash
# Sync web code to native Android project
npm run cap:sync

# Open in Android Studio to build APK
npm run cap:android
```
In Android Studio: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**.

### Option C: Build Native iOS App
```bash
# Sync web code to native iOS project
npm run cap:sync

# Open in Xcode (macOS required)
npm run cap:ios
```

---

## 📜 NPM Scripts Reference

| Command | Description |
| :--- | :--- |
| `npm run serve` | Starts the zero-dependency local preview web server |
| `npm run build` | Compiles web assets for distribution and mobile packaging |
| `npm run generate-icons` | Generates all app icons and splash assets from `icons/icon.svg` |
| `npm run cap:sync` | Builds web assets and synchronizes Android & iOS native directories |
| `npm run cap:android` | Builds, synchronizes, and opens the project in Android Studio |
| `npm run cap:ios` | Builds, synchronizes, and opens the project in Xcode |

---

## 🔮 Future Roadmap

* 📅 Attendance history and timeline logging
* 📈 Visual attendance analytics & interactive charts
* 📆 Timetable & schedule integration
* 🔔 Push notifications & class reminder alerts
* 🎓 Semester-level attendance exports (PDF/CSV)
* 🌙 Dedicated dark / light theme switcher
* 🤖 AI-powered attendance predictions and trend forecasting

---

## 👨‍💻 Author

**Anusmrith M M**  
BTech Computer Science, College of Engineering Karunagappally (Graduating 2027)

* **GitHub**: [@Anusmrith](https://github.com/Anusmrith)
* **Project Repository**: [AttendWise](https://github.com/Anusmrith/Attendwise)

---

## ⭐ Support

If you find AttendWise useful, consider giving the repository a ⭐ on GitHub!

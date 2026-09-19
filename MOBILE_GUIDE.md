# AttendWise Mobile Application Guide 📱

AttendWise has been configured to work as:
1. **A Website** (runs in any modern browser).
2. **A Progressive Web App (PWA)** (instantly downloadable and installable on Android & iOS without any store approval).
3. **A Native Android App (.apk / .aab)** (native Android Studio project included in `android/`).
4. **A Native iOS App** (native Xcode project included in `ios/`).

---

## Option 1: Instant Install via PWA (Android & iOS)

This is the fastest way to download and install AttendWise on your phone with zero developer accounts or complex setup required.

### 🌐 Testing on your Phone via Local Wi-Fi
1. Start the local server:
   ```bash
   npm run serve
   ```
2. Find your computer's local IP address (open PowerShell and run `ipconfig`, look for IPv4 address like `192.168.1.X`).
3. On your phone connected to the same Wi-Fi, open:
   ```
   http://192.168.1.X:3000
   ```
*(Note: When you deploy the website to Netlify, Vercel, GitHub Pages, or any HTTPS domain, installation is fully automatic with one click).*

### 🤖 On Android Phones:
1. Open AttendWise in **Google Chrome**.
2. Tap the **"Install"** button on the bottom banner or tap the Chrome menu (⋮) -> **"Install app"** or **"Add to Home screen"**.
3. AttendWise will be downloaded and installed directly on your phone's app launcher with the AttendWise icon!

### 🍏 On iPhones / iPads (iOS):
1. Open AttendWise in **Safari**.
2. Tap the **Share** button (the square icon with an arrow pointing up at the bottom toolbar).
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **"Add"** in the top-right corner.
5. The AttendWise app icon will appear on your iOS home screen and open in full-screen standalone mode without any browser URL bar.

---

## Option 2: Native Android App (.apk) via Capacitor

The repository now contains a complete, production-ready native Android project inside the `android/` folder.

### 🛠️ Prerequisites for Android:
- Download and install [Android Studio](https://developer.android.com/studio) (includes the Android SDK & Java JDK).

### 🚀 Steps to Build your `.apk`:
1. **Sync your latest web code into Android**:
   ```bash
   npm run cap:sync
   ```
2. **Open the project in Android Studio**:
   ```bash
   npm run cap:android
   ```
   *(Or open Android Studio manually and choose "Open an Existing Project", selecting the `android` folder in this repo).*

3. **Generate the APK**:
   - In Android Studio's top menu, click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**.
   - Once the build finishes, click the **"locate"** link in the bottom-right popup.
   - Your APK file is generated at:
     ```
     android/app/build/outputs/apk/debug/app-debug.apk
     ```

4. **Install on your Android device**:
   - Send this `app-debug.apk` to your phone via USB cable, Google Drive, or messaging.
   - Tap the `.apk` file on your phone to install and use AttendWise as a native Android application!

---

## Option 3: Native iOS App via Capacitor

The repository contains the Xcode project in the `ios/` folder.

### 🛠️ Prerequisites for iOS:
- A computer running **macOS** with **Xcode** installed from the Mac App Store.

### 🚀 Steps to Build for iOS:
1. **Sync your latest web code**:
   ```bash
   npm run cap:sync
   ```
2. **Open the project in Xcode**:
   ```bash
   npm run cap:ios
   ```
3. In Xcode:
   - Select your connected iPhone or an iOS Simulator from the device dropdown at the top.
   - Click the **Play (Run)** button to build and launch AttendWise directly on the iPhone!
   - To distribute to friends or students via TestFlight or App Store: In Xcode, select **Product** → **Archive**.

---

## Quick Reference Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run serve` | Start zero-dependency local preview server on `http://localhost:3000` |
| `npm run build` | Bundle clean web assets into `www/` for mobile packaging |
| `npm run generate-icons` | Automatically regenerate all PWA, Android, and iOS launcher icons from `icons/icon.svg` |
| `npm run cap:sync` | Copy updated web code into both Android and iOS native projects |
| `npm run cap:android` | Build, sync, and launch the Android Studio project |
| `npm run cap:ios` | Build, sync, and launch the Xcode project (macOS only) |

---

## Architecture Summary

```
attendwise/
├── index.html               # Web & Mobile responsive UI + Safe-Area Insets + PWA tags
├── style.css                # Adaptive styling (desktop, tablet, mobile, notch/dynamic island)
├── script.js                # Core logic + PWA install handlers & prompt
├── manifest.webmanifest     # PWA metadata, colors, orientation & app icons
├── sw.js                    # Service Worker for offline caching & fast loading
├── capacitor.config.json    # Capacitor configuration (App ID: com.attendwise.app)
├── icons/                   # App icons (192px, 512px, maskable, apple-touch-icon, svg)
├── android/                 # Native Android Studio project (for building .apk/.aab)
├── ios/                     # Native Xcode project (for building iPhone .ipa)
└── www/                     # Clean compiled assets ready for native sync
```

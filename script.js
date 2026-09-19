// ==========================================
// SUPABASE CONFIGURATION
// ==========================================

// Get these from:
// Supabase Dashboard
// → Project Settings
// → API


const SUPABASE_URL =
    "https://dsgabxbdzktjtfrtihza.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_Y-gu46DeZwQDWMP0S9D99A_2jC57kOH";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// ==========================================
// GLOBAL VARIABLES
// ==========================================


let currentUser = null;

let subjects = [];


// ==========================================
// PAGE ELEMENTS
// ==========================================


const authPage =
    document.getElementById("auth-page");


const dashboardPage =
    document.getElementById("dashboard-page");


const loginBox =
    document.getElementById("login-box");


const signupBox =
    document.getElementById("signup-box");


// ==========================================
// INITIALIZE APPLICATION
// ==========================================


document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


async function initializeApp() {

    const {
        data: {
            session
        }
    } = await supabaseClient
        .auth
        .getSession();


    if (session) {

        currentUser =
            session.user;

        showDashboard();

    } else {

        showLogin();

    }


    // Watch authentication changes

    supabaseClient
        .auth
        .onAuthStateChange(
            async (event, session) => {

                if (session) {

                    currentUser =
                        session.user;

                    showDashboard();

                } else {

                    currentUser = null;

                    showLogin();

                }

            }
        );
}


// ==========================================
// LOGIN / SIGNUP UI
// ==========================================


function showLogin() {

    authPage.classList.remove("hidden");

    dashboardPage.classList.add("hidden");

    loginBox.classList.remove("hidden");

    signupBox.classList.add("hidden");
}


function showSignup() {

    authPage.classList.remove("hidden");

    dashboardPage.classList.add("hidden");

    loginBox.classList.add("hidden");

    signupBox.classList.remove("hidden");
}


// ==========================================
// SIGN UP
// ==========================================


document
    .getElementById("signup-form")
    .addEventListener(
        "submit",
        handleSignup
    );


async function handleSignup(event) {

    event.preventDefault();


    const name =
        document
            .getElementById("signup-name")
            .value
            .trim();


    const email =
        document
            .getElementById("signup-email")
            .value
            .trim();


    const password =
        document
            .getElementById("signup-password")
            .value;


    const message =
        document
            .getElementById("signup-message");


    message.textContent =
        "Creating your account...";


    try {
        const {
            data,
            error
        } = await supabaseClient
            .auth
            .signUp({

                email: email,

                password: password,

                options: {

                    data: {
                        name: name
                    }

                }

            });


        if (error) {
            console.error("Signup error:", error);
            if (error.message && (error.message.toLowerCase().includes("fetch") || error.message.toLowerCase().includes("rate limit"))) {
                message.textContent = "Rate limit or network error. In Supabase Dashboard -> Authentication -> Providers -> Email, turn OFF 'Confirm email'.";
            } else {
                message.textContent = error.message;
            }
            return;
        }


        // If email confirmation is disabled in Supabase, session is returned immediately
        if (data.session) {
            currentUser = data.user;
            message.textContent = "Account created! Redirecting to your dashboard...";
            setTimeout(() => {
                showDashboard();
            }, 600);
        } else if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
            message.textContent = "An account with this email already exists. Please log in.";
        } else {
            message.textContent = "Account created! Please check your email to confirm or try logging in.";
        }
    } catch (err) {
        console.error("Signup exception:", err);
        message.textContent = "Connection error. In Supabase Dashboard -> Authentication -> Providers -> Email, disable 'Confirm email'.";
    }
}


// ==========================================
// LOGIN
// ==========================================


document
    .getElementById("login-form")
    .addEventListener(
        "submit",
        handleLogin
    );


async function handleLogin(event) {

    event.preventDefault();


    const email =
        document
            .getElementById("login-email")
            .value
            .trim();


    const password =
        document
            .getElementById("login-password")
            .value;


    const message =
        document
            .getElementById("login-message");


    message.textContent =
        "Logging in...";


    try {
        const {
            data,
            error
        } = await supabaseClient
            .auth
            .signInWithPassword({

                email: email,

                password: password

            });


        if (error) {
            console.error("Login error:", error);
            message.textContent =
                error.message;
            return;
        }


        currentUser =
            data.user;

        showDashboard();
    } catch (err) {
        console.error("Login exception:", err);
        message.textContent = "Login error: " + (err.message || "Failed to connect");
    }
}


// ==========================================
// LOGOUT
// ==========================================


document
    .getElementById("logout-button")
    .addEventListener(
        "click",
        logout
    );


async function logout() {

    const {
        error
    } = await supabaseClient
        .auth
        .signOut();


    if (error) {

        console.error(error);

    }

}


// ==========================================
// SHOW DASHBOARD
// ==========================================


async function showDashboard() {

    authPage.classList.add("hidden");

    dashboardPage.classList.remove("hidden");


    if (!currentUser) {

        return;

    }


    const name =
        currentUser
            .user_metadata
            ?.name;


    document
        .getElementById("user-name")
        .textContent =
        name || "Student";


    document
        .getElementById("user-email")
        .textContent =
        currentUser.email;


    await loadSubjects();
}


// ==========================================
// LOAD SUBJECTS FROM DATABASE
// ==========================================


async function loadSubjects() {

    const {
        data,
        error
    } = await supabaseClient

        .from("subjects")

        .select("*")

        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Error loading subjects:",
            error
        );

        return;
    }


    subjects = data || [];


    renderSubjects();

    updateSummary();
}


// ==========================================
// ADD SUBJECT
// ==========================================


document
    .getElementById("subject-form")
    .addEventListener(
        "submit",
        addSubject
    );


async function addSubject(event) {

    event.preventDefault();


    if (!currentUser) {

        return;
    }


    const subjectName =
        document
            .getElementById("subject-name")
            .value
            .trim();


    const attended =
        Number(
            document
                .getElementById("subject-attended")
                .value
        );


    const total =
        Number(
            document
                .getElementById("subject-total")
                .value
        );


    const minimum =
        Number(
            document
                .getElementById("subject-minimum")
                .value
        );


    const message =
        document
            .getElementById("subject-message");


    message.textContent = "";


    // Validation

    if (!subjectName) {

        message.textContent =
            "Please enter a subject name.";

        return;
    }


    if (total <= 0) {

        message.textContent =
            "Total classes must be greater than 0.";

        return;
    }


    if (
        attended < 0 ||
        attended > total
    ) {

        message.textContent =
            "Attended classes cannot exceed total classes.";

        return;
    }


    if (
        minimum <= 0 ||
        minimum > 100
    ) {

        message.textContent =
            "Minimum attendance must be between 1 and 100.";

        return;
    }


    // Insert into Supabase

    const {
        error
    } = await supabaseClient

        .from("subjects")

        .insert({

            user_id:
                currentUser.id,

            subject_name:
                subjectName,

            attended:
                attended,

            total:
                total,

            minimum_percentage:
                minimum

        });


    if (error) {

        console.error(error);

        message.textContent =
            error.message;

        return;
    }


    message.textContent =
        "Subject added successfully!";


    // Clear form

    document
        .getElementById("subject-form")
        .reset();


    document
        .getElementById("subject-minimum")
        .value = 75;


    // Reload data

    await loadSubjects();
}


// ==========================================
// DELETE SUBJECT
// ==========================================


async function deleteSubject(id) {

    const confirmed =
        confirm(
            "Delete this subject?"
        );


    if (!confirmed) {

        return;
    }


    const {
        error
    } = await supabaseClient

        .from("subjects")

        .delete()

        .eq(
            "id",
            id
        );


    if (error) {

        console.error(error);

        alert(
            "Could not delete subject."
        );

        return;
    }


    await loadSubjects();
}


// ==========================================
// CALCULATE STATUS
// ==========================================


function getStatus(
    attendance,
    minimum
) {

    if (
        attendance >= minimum
    ) {

        return {
            text: "Safe",
            className: "status-safe"
        };

    }


    if (
        attendance >=
        minimum - 10
    ) {

        return {
            text: "Warning",
            className: "status-warning"
        };

    }


    return {
        text: "At Risk",
        className: "status-risk"
    };
}


// ==========================================
// CALCULATE CLASSES NEEDED
// ==========================================


function calculateClassesNeeded(
    attended,
    total,
    minimum
) {

    let needed = 0;


    while (
        (
            (attended + needed) /
            (total + needed)
        ) * 100
        < minimum
    ) {

        needed++;


        // Safety limit

        if (needed > 10000) {

            break;

        }

    }


    return needed;
}


// ==========================================
// CALCULATE CLASSES THAT CAN BE MISSED
// ==========================================


function calculateClassesCanMiss(
    attended,
    total,
    minimum
) {

    let canMiss = 0;


    while (
        (
            attended /
            (total + canMiss + 1)
        ) * 100
        >= minimum
    ) {

        canMiss++;


        if (canMiss > 10000) {

            break;

        }

    }


    return canMiss;
}


// ==========================================
// RENDER SUBJECTS
// ==========================================


function renderSubjects() {

    const container =
        document
            .getElementById(
                "subjects-container"
            );


    if (subjects.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    No subjects yet
                </h3>

                <p>
                    Add your first subject above.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML = "";


    subjects.forEach(
        subject => {

            const attendance =
                subject.total > 0
                    ? (
                        subject.attended /
                        subject.total
                    ) * 100
                    : 0;


            const status =
                getStatus(
                    attendance,
                    subject.minimum_percentage
                );


            let advice;


            if (
                attendance >=
                subject.minimum_percentage
            ) {

                const canMiss =
                    calculateClassesCanMiss(
                        subject.attended,
                        subject.total,
                        subject.minimum_percentage
                    );


                advice =
                    canMiss === 0
                        ? "You are at the minimum limit. Avoid missing your next class."
                        : `You can miss approximately ${canMiss} more class(es).`;

            } else {

                const needed =
                    calculateClassesNeeded(
                        subject.attended,
                        subject.total,
                        subject.minimum_percentage
                    );


                advice =
                    `Attend ${needed} consecutive class(es) to reach ${subject.minimum_percentage}%.`;
            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "subject-card";


            card.innerHTML = `

                <div class="subject-header">

                    <h3>
                        ${escapeHTML(
                            subject.subject_name
                        )}
                    </h3>

                    <span
                        class="status-badge ${status.className}"
                    >
                        ${status.text}
                    </span>

                </div>


                <div class="subject-percentage">

                    ${attendance.toFixed(2)}%

                </div>


                <div class="progress-bar">

                    <div
                        class="progress"
                        style="width: ${Math.min(
                            attendance,
                            100
                        )}%"
                    ></div>

                </div>


                <div class="subject-stats">

                    <div class="subject-stat">

                        <span>
                            Attended
                        </span>

                        <strong>
                            ${subject.attended}
                        </strong>

                    </div>


                    <div class="subject-stat">

                        <span>
                            Missed
                        </span>

                        <strong>
                            ${subject.total -
                            subject.attended}
                        </strong>

                    </div>


                    <div class="subject-stat">

                        <span>
                            Required
                        </span>

                        <strong>
                            ${subject.minimum_percentage}%
                        </strong>

                    </div>

                </div>


                <p
                    style="
                        color:#687386;
                        margin-bottom:18px;
                        font-size:14px;
                    "
                >
                    ${advice}
                </p>


                <button
                    class="delete-button"
                    onclick="deleteSubject('${subject.id}')"
                >
                    Delete Subject
                </button>

            `;


            container.appendChild(
                card
            );

        }
    );
}


// ==========================================
// UPDATE DASHBOARD SUMMARY
// ==========================================


function updateSummary() {

    let safe = 0;

    let warning = 0;

    let risk = 0;


    subjects.forEach(
        subject => {

            const attendance =
                subject.total > 0
                    ? (
                        subject.attended /
                        subject.total
                    ) * 100
                    : 0;


            const status =
                getStatus(
                    attendance,
                    subject.minimum_percentage
                );


            if (
                status.text === "Safe"
            ) {

                safe++;

            } else if (
                status.text === "Warning"
            ) {

                warning++;

            } else {

                risk++;

            }

        }
    );


    document
        .getElementById(
            "total-subjects"
        )
        .textContent =
        subjects.length;


    document
        .getElementById(
            "safe-subjects"
        )
        .textContent =
        safe;


    document
        .getElementById(
            "warning-subjects"
        )
        .textContent =
        warning;


    document
        .getElementById(
            "risk-subjects"
        )
        .textContent =
        risk;
}


// ==========================================
// BASIC HTML ESCAPING
// ==========================================


function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


// ==========================================
// PWA & MOBILE APP INSTALLATION
// ==========================================

let deferredInstallPrompt = null;

function initPWA() {
    // 1. Register Service Worker
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker
                .register("./sw.js")
                .then((registration) => {
                    console.log("[AttendWise PWA] ServiceWorker registered with scope:", registration.scope);
                })
                .catch((err) => {
                    console.warn("[AttendWise PWA] ServiceWorker registration failed:", err);
                });
        });
    }

    const navInstallBtn = document.getElementById("pwa-nav-install-btn");
    const banner = document.getElementById("pwa-install-banner");
    const bannerInstallBtn = document.getElementById("pwa-banner-install-btn");
    const bannerDismissBtn = document.getElementById("pwa-banner-dismiss-btn");
    const iosModal = document.getElementById("ios-install-modal");
    const iosCloseBtn = document.getElementById("ios-modal-close");
    const iosOkBtn = document.getElementById("ios-modal-ok");

    const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;

    // Listen for Android/Desktop install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;

        if (navInstallBtn) navInstallBtn.classList.remove("hidden");
        if (banner && !sessionStorage.getItem("attendwise-install-dismissed")) {
            banner.classList.remove("hidden");
        }
    });

    // Check if on iOS Safari (outside standalone mode)
    if (isIOS && !isStandalone) {
        if (navInstallBtn) navInstallBtn.classList.remove("hidden");
        if (banner && !sessionStorage.getItem("attendwise-install-dismissed")) {
            banner.classList.remove("hidden");
        }
    }

    async function triggerInstall() {
        if (deferredInstallPrompt) {
            deferredInstallPrompt.prompt();
            const { outcome } = await deferredInstallPrompt.userChoice;
            console.log("[AttendWise PWA] User install choice:", outcome);
            deferredInstallPrompt = null;
            if (banner) banner.classList.add("hidden");
            if (navInstallBtn) navInstallBtn.classList.add("hidden");
        } else if (isIOS && !isStandalone) {
            if (iosModal) iosModal.classList.remove("hidden");
        } else {
            alert("To install AttendWise, tap your browser's menu (e.g. ⋮ or Share) and select 'Install app' or 'Add to Home screen'.");
        }
    }

    if (navInstallBtn) {
        navInstallBtn.addEventListener("click", triggerInstall);
    }
    if (bannerInstallBtn) {
        bannerInstallBtn.addEventListener("click", triggerInstall);
    }
    if (bannerDismissBtn) {
        bannerDismissBtn.addEventListener("click", () => {
            if (banner) banner.classList.add("hidden");
            sessionStorage.setItem("attendwise-install-dismissed", "true");
        });
    }

    function closeIosModal() {
        if (iosModal) iosModal.classList.add("hidden");
    }

    if (iosCloseBtn) iosCloseBtn.addEventListener("click", closeIosModal);
    if (iosOkBtn) iosOkBtn.addEventListener("click", closeIosModal);
    if (iosModal) {
        iosModal.addEventListener("click", (e) => {
            if (e.target === iosModal) closeIosModal();
        });
    }

    window.addEventListener("appinstalled", () => {
        console.log("[AttendWise PWA] Installed successfully!");
        if (banner) banner.classList.add("hidden");
        if (navInstallBtn) navInstallBtn.classList.add("hidden");
        deferredInstallPrompt = null;
    });
}

// ==========================================
// EZYGO COLLEGE PORTAL INTEGRATION
// ==========================================

function initEzygoSync() {
    const modal = document.getElementById("ezygo-sync-modal");
    const navBtn = document.getElementById("ezygo-nav-sync-btn");
    const sectionBtn = document.getElementById("ezygo-section-sync-btn");
    const closeBtn = document.getElementById("ezygo-modal-close");
    const form = document.getElementById("ezygo-sync-form");
    const usernameInput = document.getElementById("ezygo-username");
    const passwordInput = document.getElementById("ezygo-password");
    const minPercentInput = document.getElementById("ezygo-min-percent");
    const rememberCheckbox = document.getElementById("ezygo-remember-user");
    const statusBox = document.getElementById("ezygo-status-box");
    const spinner = document.getElementById("ezygo-spinner");
    const statusText = document.getElementById("ezygo-status-text");
    const submitBtn = document.getElementById("ezygo-submit-btn");

    async function openModal() {
        const modalEl = document.getElementById("ezygo-sync-modal");
        const userInput = document.getElementById("ezygo-username");
        const statBox = document.getElementById("ezygo-status-box");
        const subBtn = document.getElementById("ezygo-submit-btn");

        const savedUser = localStorage.getItem("attendwise-ezygo-username");
        if (savedUser && userInput) {
            userInput.value = savedUser;
        }
        if (statBox) statBox.classList.add("hidden");
        if (subBtn) {
            subBtn.disabled = false;
            subBtn.innerHTML = "<span>⚡ Fetch & Import Attendance</span>";
        }
        if (modalEl) modalEl.classList.remove("hidden");
    }

    function closeModal() {
        const modalEl = document.getElementById("ezygo-sync-modal");
        if (modalEl) modalEl.classList.add("hidden");
    }

    window.openEzygoModal = openModal;
    window.closeEzygoModal = closeModal;

    if (navBtn) navBtn.addEventListener("click", openModal);
    if (sectionBtn) sectionBtn.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
    }

    function setStatus(msg, type = "loading") {
        if (!statusBox || !statusText) return;
        statusBox.className = "ezygo-status-box " + type;
        statusBox.classList.remove("hidden");
        statusText.textContent = msg;
        if (spinner) {
            if (type === "loading") {
                spinner.classList.remove("hidden");
            } else {
                spinner.classList.add("hidden");
            }
        }
    }

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            const minPercent = Number(minPercentInput.value) || 75;

            if (!currentUser) {
                const { data: { session } } = await supabaseClient.auth.getSession();
                if (session) {
                    currentUser = session.user;
                } else {
                    setStatus("Please log in to your AttendWise account first.", "error");
                    return;
                }
            }

            if (!username || !password) {
                setStatus("Please enter both username and password.", "error");
                return;
            }

            if (rememberCheckbox && rememberCheckbox.checked) {
                localStorage.setItem("attendwise-ezygo-username", username);
            } else {
                localStorage.removeItem("attendwise-ezygo-username");
            }

            submitBtn.disabled = true;

            try {
                const EZYGO_API = "https://production.api.ezygo.app/api/v1/Xcr45_salt";

                // 1. Authenticate with EzyGo
                setStatus("Connecting and verifying credentials with EzyGo...", "loading");
                const loginRes = await fetch(`${EZYGO_API}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                        stay_logged_in: false
                    })
                });

                const loginData = await loginRes.json();
                if (!loginRes.ok || !loginData.access_token) {
                    let errMsg = "Invalid EzyGo username or password.";
                    if (loginData.message) errMsg = loginData.message;
                    else if (loginData.errors && typeof loginData.errors === "object") {
                        const firstErr = Object.values(loginData.errors)[0];
                        if (Array.isArray(firstErr)) errMsg = firstErr[0];
                    }
                    throw new Error(errMsg);
                }

                const token = loginData.access_token;
                const ezyUser = loginData.user || {};

                // 2. Fetch enrolled courses
                setStatus("Fetching enrolled subjects...", "loading");
                const authHeaders = {
                    "Authorization": "Bearer " + token,
                    "Accept": "application/json"
                };

                const coursesRes = await fetch(`${EZYGO_API}/institutionuser/courses`, {
                    headers: authHeaders
                });
                const coursesData = await coursesRes.json();

                if (!Array.isArray(coursesData) || coursesData.length === 0) {
                    throw new Error("No enrolled courses found for this student account in EzyGo.");
                }

                // 3. Fetch attendance records
                setStatus("Calculating live attendance records...", "loading");
                let attendanceDates = [];
                try {
                    const attRes = await fetch(`${EZYGO_API}/attendancedates/withcounts`, {
                        headers: authHeaders
                    });
                    if (attRes.ok) {
                        attendanceDates = await attRes.json();
                    }
                } catch (err) {
                    console.warn("Could not fetch global attendance dates:", err);
                }

                // 4. Process each course and sync into Supabase
                setStatus(`Found ${coursesData.length} subjects. Saving to AttendWise...`, "loading");
                let syncedCount = 0;

                for (const course of coursesData) {
                    const rawName = course.name || course.code || "Subject";
                    const subjectName = rawName.trim();
                    let attended = 0;
                    let total = 0;

                    // Read attended & total from course object or session records
                    if (course.attended !== undefined && course.total !== undefined) {
                        attended = Number(course.attended) || 0;
                        total = Number(course.total) || 0;
                    } else if (course.classes_attended !== undefined && course.classes_conducted !== undefined) {
                        attended = Number(course.classes_attended) || 0;
                        total = Number(course.classes_conducted) || 0;
                    } else if (Array.isArray(attendanceDates) && attendanceDates.length > 0) {
                        const courseSessions = attendanceDates.filter(s => s.course_id === course.id);
                        total = courseSessions.length;
                        courseSessions.forEach(session => {
                            if (Array.isArray(session.attendances)) {
                                const myRecord = session.attendances.find(a => 
                                    a.institution_user_id === ezyUser.id || 
                                    a.user_id === ezyUser.id || 
                                    a.student_id === ezyUser.id
                                );
                                if (myRecord) {
                                    // 1 is Present, 2 is Absent in EzyGo
                                    if (myRecord.attendance_type_id === 1 || myRecord.is_present || myRecord.status === "present") {
                                        attended++;
                                    }
                                } else {
                                    attended++;
                                }
                            } else {
                                attended++;
                            }
                        });
                    }

                    // Check existing subjects in user's AttendWise account
                    const existing = subjects.find(s => 
                        s.subject_name.trim().toLowerCase() === subjectName.toLowerCase()
                    );

                    if (existing) {
                        await supabaseClient
                            .from("subjects")
                            .update({
                                attended: attended,
                                total: total,
                                minimum_percentage: minPercent
                            })
                            .eq("id", existing.id);
                    } else {
                        await supabaseClient
                            .from("subjects")
                            .insert({
                                user_id: currentUser.id,
                                subject_name: subjectName,
                                attended: attended,
                                total: total,
                                minimum_percentage: minPercent
                            });
                    }
                    syncedCount++;
                }

                // 5. Reload dashboard
                await loadSubjects();
                setStatus(`🎉 Successfully synced ${syncedCount} subjects from EzyGo!`, "success");
                passwordInput.value = "";

                setTimeout(() => {
                    closeModal();
                }, 1600);

            } catch (err) {
                console.error("EzyGo Sync Error:", err);
                setStatus("Error: " + (err.message || "Could not connect to EzyGo. Please check your credentials."), "error");
            } finally {
                submitBtn.disabled = false;
            }
        });
    }
}

// Initialize features immediately
initPWA();
initEzygoSync();
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

        message.textContent =
            error.message;

        return;
    }


    // Depending on your Supabase
    // email-confirmation setting,
    // the user may need to confirm
    // their email first.

    if (data.session) {

        message.textContent =
            "Account created successfully!";

    } else {

        message.textContent =
            "Account created. Check your email to confirm your account.";

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

        message.textContent =
            error.message;

        return;
    }


    currentUser =
        data.user;

    showDashboard();
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
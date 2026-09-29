/* =========================================================
   GRANTTRACK FRONTEND
   Backend: Spring Boot - Port 8080
========================================================= */


const API_URL = "http://localhost:8080/api";


/* =========================================================
   GLOBAL DATA
========================================================= */

let faculties = [];

let applications = [];

let selectedExpenditureApplicationId = null;


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    setupNavigation();

    setupButtons();

    setupForms();

    setupModalCloseEvents();

    initializeApplication();

});


/* =========================================================
   INITIALIZE
========================================================= */

async function initializeApplication() {

    setConnectionStatus("connecting");

    try {

        await loadFaculties();

        await loadApplications();

        setConnectionStatus("connected");

    } catch (error) {

        console.error(error);

        setConnectionStatus("disconnected");

    }

}


/* =========================================================
   CONNECTION STATUS
========================================================= */

function setConnectionStatus(status) {

    const dot =
        document.getElementById("connectionDot");

    const text =
        document.getElementById("connectionText");

    const sidebarDot =
        document.getElementById("sidebarConnectionDot");

    const sidebarText =
        document.getElementById(
            "sidebarConnectionText"
        );


    dot.classList.remove(
        "connected",
        "disconnected"
    );

    sidebarDot.classList.remove(
        "connected",
        "disconnected"
    );


    if (status === "connected") {

        dot.classList.add("connected");

        sidebarDot.classList.add("connected");

        text.textContent =
            "Backend Connected";

        sidebarText.textContent =
            "Connected";

    }

    else if (status === "disconnected") {

        dot.classList.add("disconnected");

        sidebarDot.classList.add("disconnected");

        text.textContent =
            "Backend Offline";

        sidebarText.textContent =
            "Offline";

    }

    else {

        text.textContent =
            "Connecting...";

        sidebarText.textContent =
            "Connecting...";

    }

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const navItems =
        document.querySelectorAll(".nav-item");


    navItems.forEach(item => {

        item.addEventListener("click", () => {

            const section =
                item.dataset.section;

            showSection(section);

        });

    });

}


function showSection(sectionId) {

    document
        .querySelectorAll(".page-section")
        .forEach(section => {

            section.classList.remove(
                "active-section"
            );

        });


    const selectedSection =
        document.getElementById(sectionId);


    if (selectedSection) {

        selectedSection.classList.add(
            "active-section"
        );

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove("active");

            if (
                item.dataset.section === sectionId
            ) {

                item.classList.add("active");

            }

        });


    const titles = {

        dashboard: [
            "Dashboard",
            "Overview of your grant management system"
        ],

        faculty: [
            "Faculty Management",
            "Manage faculty members"
        ],

        applications: [
            "Grant Applications",
            "Manage grant applications and stages"
        ],

        expenditure: [
            "Expenditure Management",
            "Track grant expenditure"
        ]

    };


    if (titles[sectionId]) {

        document.getElementById(
            "pageTitle"
        ).textContent =
            titles[sectionId][0];


        document.getElementById(
            "pageSubtitle"
        ).textContent =
            titles[sectionId][1];

    }


    if (sectionId === "faculty") {

        renderFacultyTable();

    }


    if (sectionId === "applications") {

        renderApplicationTable();

    }


    if (sectionId === "expenditure") {

        populateExpenditureApplications();

    }

}


/* =========================================================
   BUTTONS
========================================================= */

function setupButtons() {


    document
        .getElementById("addFacultyButton")
        .addEventListener(
            "click",
            openAddFacultyModal
        );


    document
        .getElementById("addApplicationButton")
        .addEventListener(
            "click",
            openAddApplicationModal
        );


    document
        .getElementById(
            "dashboardApplicationsButton"
        )
        .addEventListener(
            "click",
            () => showSection("applications")
        );


    document
        .getElementById(
            "loadExpenditureButton"
        )
        .addEventListener(
            "click",
            loadSelectedExpenditure
        );


    document
        .getElementById(
            "addExpenditureButton"
        )
        .addEventListener(
            "click",
            openAddExpenditureModal
        );

}


/* =========================================================
   MODAL CLOSE
========================================================= */

function setupModalCloseEvents() {

    document
        .querySelectorAll("[data-close]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    closeModal(
                        button.dataset.close
                    );

                }
            );

        });


    document
        .querySelectorAll(".modal")
        .forEach(modal => {

            modal.addEventListener(
                "click",
                event => {

                    if (
                        event.target === modal
                    ) {

                        modal.classList.remove(
                            "show"
                        );

                    }

                }
            );

        });

}


function openModal(id) {

    document
        .getElementById(id)
        .classList.add("show");

}


function closeModal(id) {

    document
        .getElementById(id)
        .classList.remove("show");

}


/* =========================================================
   FACULTY API
========================================================= */

async function loadFaculties() {

    const response =
        await fetch(
            `${API_URL}/faculties`
        );


    if (!response.ok) {

        throw new Error(
            "Unable to load faculties"
        );

    }


    faculties =
        await response.json();


    document.getElementById(
        "facultyCount"
    ).textContent =
        faculties.length;


    renderFacultyTable();

    populateFacultyDropdown();

    populateExpenditureApplications();

}


/* =========================================================
   FACULTY TABLE
========================================================= */

function renderFacultyTable() {

    const tbody =
        document.getElementById(
            "facultyTableBody"
        );


    tbody.innerHTML = "";


    if (faculties.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="loading">

                    No faculty members found.

                </td>

            </tr>

        `;

        return;

    }


    faculties.forEach(faculty => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${faculty.id}</td>

            <td>${escapeHtml(faculty.name)}</td>

            <td>${escapeHtml(faculty.email)}</td>

            <td>${escapeHtml(faculty.department)}</td>

            <td>

                <div class="action-group">

                    <button
                        class="small-button"
                        onclick="editFaculty(${faculty.id})">

                        Edit

                    </button>


                    <button
                        class="danger-button"
                        onclick="deleteFaculty(${faculty.id})">

                        Delete

                    </button>

                </div>

            </td>

        `;


        tbody.appendChild(row);

    });

}


/* =========================================================
   FACULTY DROPDOWN
========================================================= */

function populateFacultyDropdown() {

    const select =
        document.getElementById(
            "applicationFaculty"
        );


    select.innerHTML = `

        <option value="">
            Select faculty
        </option>

    `;


    faculties.forEach(faculty => {

        const option =
            document.createElement("option");


        option.value =
            faculty.id;


        option.textContent =
            `${faculty.name} - ${faculty.department}`;


        select.appendChild(option);

    });

}


/* =========================================================
   ADD FACULTY MODAL
========================================================= */

function openAddFacultyModal() {

    document.getElementById(
        "facultyModalTitle"
    ).textContent =
        "Add Faculty";


    document
        .getElementById("facultyForm")
        .reset();


    document.getElementById(
        "facultyId"
    ).value = "";


    document.getElementById(
        "facultyMessage"
    ).textContent = "";


    openModal("facultyModal");

}


/* =========================================================
   EDIT FACULTY
========================================================= */

function editFaculty(id) {

    const faculty =
        faculties.find(
            item => item.id === id
        );


    if (!faculty) {

        alert("Faculty not found.");

        return;

    }


    document.getElementById(
        "facultyModalTitle"
    ).textContent =
        "Edit Faculty";


    document.getElementById(
        "facultyId"
    ).value =
        faculty.id;


    document.getElementById(
        "facultyName"
    ).value =
        faculty.name;


    document.getElementById(
        "facultyEmail"
    ).value =
        faculty.email;


    document.getElementById(
        "facultyDepartment"
    ).value =
        faculty.department;


    document.getElementById(
        "facultyMessage"
    ).textContent = "";


    openModal("facultyModal");

}


/* =========================================================
   FACULTY FORM
========================================================= */

function setupForms() {


    document
        .getElementById("facultyForm")
        .addEventListener(
            "submit",
            saveFaculty
        );


    document
        .getElementById("applicationForm")
        .addEventListener(
            "submit",
            saveApplication
        );


    document
        .getElementById("stageForm")
        .addEventListener(
            "submit",
            updateStage
        );


    document
        .getElementById("expenditureForm")
        .addEventListener(
            "submit",
            saveExpenditure
        );

}


async function saveFaculty(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "facultyId"
        ).value;


    const name =
        document.getElementById(
            "facultyName"
        ).value.trim();


    const email =
        document.getElementById(
            "facultyEmail"
        ).value.trim();


    const department =
        document.getElementById(
            "facultyDepartment"
        ).value.trim();


    const message =
        document.getElementById(
            "facultyMessage"
        );


    message.textContent =
        "Saving...";


    message.style.color =
        "#64748b";


    try {

        const method =
            id ? "PUT" : "POST";


        const url =
            id
                ? `${API_URL}/faculties/${id}`
                : `${API_URL}/faculties`;


        const response =
            await fetch(
                url,
                {
                    method: method,

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name,
                        email,
                        department

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to save faculty"
            );

        }


        message.textContent =
            id
                ? "Faculty updated successfully."
                : "Faculty added successfully.";


        message.style.color =
            "#16a34a";


        await loadFaculties();


        setTimeout(
            () => closeModal("facultyModal"),
            600
        );


    } catch (error) {

        console.error(error);


        message.textContent =
            error.message;


        message.style.color =
            "#dc2626";

    }

}


/* =========================================================
   DELETE FACULTY
========================================================= */

async function deleteFaculty(id) {

    const faculty =
        faculties.find(
            item => item.id === id
        );


    if (!faculty) return;


    const confirmed =
        confirm(
            `Delete faculty "${faculty.name}"?`
        );


    if (!confirmed) return;


    try {

        const response =
            await fetch(
                `${API_URL}/faculties/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            const data =
                await response.json();

            throw new Error(
                data.message ||
                "Unable to delete faculty"
            );

        }


        await loadFaculties();


        alert(
            "Faculty deleted successfully."
        );


    } catch (error) {

        console.error(error);


        alert(
            "Unable to delete faculty: " +
            error.message
        );

    }

}


/* =========================================================
   APPLICATION API
========================================================= */

async function loadApplications() {

    const response =
        await fetch(
            `${API_URL}/applications`
        );


    if (!response.ok) {

        throw new Error(
            "Unable to load applications"
        );

    }


    applications =
        await response.json();


    document.getElementById(
        "applicationCount"
    ).textContent =
        applications.length;


    renderApplicationTable();

    renderDashboardApplications();

    updateRequestedTotal();

    await updateApprovedCount();

    populateExpenditureApplications();

}


/* =========================================================
   APPLICATION TABLE
========================================================= */

function renderApplicationTable() {

    const tbody =
        document.getElementById(
            "applicationTableBody"
        );


    tbody.innerHTML = "";


    if (applications.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="loading">

                    No grant applications found.

                </td>

            </tr>

        `;

        return;

    }


    applications.forEach(application => {

        const facultyName =
            application.faculty
                ? application.faculty.name
                : "-";


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${application.id}</td>

            <td>
                ${escapeHtml(application.title)}
            </td>

            <td>
                ${escapeHtml(facultyName)}
            </td>

            <td>
                ${formatCurrency(
                    application.requestedAmount
                )}
            </td>

            <td>
                ${
                    application.approvedAmount !== null
                    &&
                    application.approvedAmount !== undefined
                        ? formatCurrency(
                            application.approvedAmount
                          )
                        : "-"
                }
            </td>

            <td id="status-${application.id}">

                <span class="status-badge status-unknown">
                    Loading
                </span>

            </td>

            <td>
                ${
                    application.utilizationDeadline
                    || "-"
                }
            </td>

            <td>

                <div class="action-group">

                    <button
                        class="small-button"
                        onclick="viewApplication(${application.id})">

                        View

                    </button>


                    <button
                        class="small-button"
                        onclick="editApplication(${application.id})">

                        Edit

                    </button>


                    <button
                        class="small-button"
                        onclick="openStageModal(${application.id})">

                        Stage

                    </button>


                    <button
                        class="danger-button"
                        onclick="deleteApplication(${application.id})">

                        Delete

                    </button>

                </div>

            </td>

        `;


        tbody.appendChild(row);


        loadApplicationStatus(
            application.id
        );

    });

}


/* =========================================================
   DASHBOARD APPLICATIONS
========================================================= */

function renderDashboardApplications() {

    const tbody =
        document.getElementById(
            "dashboardApplicationBody"
        );


    tbody.innerHTML = "";


    if (applications.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="loading">

                    No applications found.

                </td>

            </tr>

        `;

        return;

    }


    const recent =
        applications.slice(-5).reverse();


    recent.forEach(application => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${application.id}</td>

            <td>
                ${escapeHtml(application.title)}
            </td>

            <td>
                ${
                    application.faculty
                    ? escapeHtml(
                        application.faculty.name
                      )
                    : "-"
                }
            </td>

            <td>
                ${formatCurrency(
                    application.requestedAmount
                )}
            </td>

            <td>
                ${
                    application.approvedAmount !== null
                    &&
                    application.approvedAmount !== undefined
                        ? formatCurrency(
                            application.approvedAmount
                          )
                        : "-"
                }
            </td>

            <td id="dashboard-status-${application.id}">

                <span class="status-badge status-unknown">
                    Loading
                </span>

            </td>

            <td>
                ${
                    application.utilizationDeadline
                    || "-"
                }
            </td>

        `;


        tbody.appendChild(row);


        loadDashboardApplicationStatus(
            application.id
        );

    });

}


/* =========================================================
   APPLICATION STATUS
========================================================= */

async function loadApplicationStatus(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/applications/${id}/stages`
            );


        if (!response.ok) return;


        const stages =
            await response.json();


        const latest =
            stages.length > 0
                ? stages[0].status
                : "SUBMITTED";


        const element =
            document.getElementById(
                `status-${id}`
            );


        if (element) {

            element.innerHTML =
                createStatusBadge(latest);

        }

    } catch (error) {

        console.error(
            "Status error:",
            error
        );

    }

}


async function loadDashboardApplicationStatus(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/applications/${id}/stages`
            );


        if (!response.ok) return;


        const stages =
            await response.json();


        const latest =
            stages.length > 0
                ? stages[0].status
                : "SUBMITTED";


        const element =
            document.getElementById(
                `dashboard-status-${id}`
            );


        if (element) {

            element.innerHTML =
                createStatusBadge(latest);

        }

    } catch (error) {

        console.error(error);

    }

}


function createStatusBadge(status) {

    let className =
        "status-unknown";


    let text =
        status || "UNKNOWN";


    if (status === "SUBMITTED") {

        className =
            "status-submitted";

    }

    else if (status === "UNDER_REVIEW") {

        className =
            "status-review";

        text =
            "UNDER REVIEW";

    }

    else if (status === "APPROVED") {

        className =
            "status-approved";

    }

    else if (status === "REJECTED") {

        className =
            "status-rejected";

    }


    return `
        <span class="status-badge ${className}">
            ${text}
        </span>
    `;

}


/* =========================================================
   APPROVED COUNT
========================================================= */

async function updateApprovedCount() {

    let approved = 0;


    for (const application of applications) {

        try {

            const response =
                await fetch(
                    `${API_URL}/applications/${application.id}/stages`
                );


            if (!response.ok) continue;


            const stages =
                await response.json();


            if (
                stages.length > 0 &&
                stages[0].status === "APPROVED"
            ) {

                approved++;

            }

        } catch (error) {

            console.error(error);

        }

    }


    document.getElementById(
        "approvedCount"
    ).textContent =
        approved;

}


/* =========================================================
   REQUESTED TOTAL
========================================================= */

function updateRequestedTotal() {

    const total =
        applications.reduce(
            (sum, application) => {

                return sum +
                    Number(
                        application.requestedAmount
                        || 0
                    );

            },
            0
        );


    document.getElementById(
        "requestedTotal"
    ).textContent =
        formatCurrency(total);

}


/* =========================================================
   ADD APPLICATION MODAL
========================================================= */

function openAddApplicationModal() {

    document.getElementById(
        "applicationModalTitle"
    ).textContent =
        "New Grant Application";


    document
        .getElementById("applicationForm")
        .reset();


    document.getElementById(
        "applicationId"
    ).value = "";


    document.getElementById(
        "applicationMessage"
    ).textContent = "";


    populateFacultyDropdown();


    openModal("applicationModal");

}


/* =========================================================
   EDIT APPLICATION
========================================================= */

function editApplication(id) {

    const application =
        applications.find(
            item => item.id === id
        );


    if (!application) {

        alert(
            "Application not found."
        );

        return;

    }


    document.getElementById(
        "applicationModalTitle"
    ).textContent =
        "Edit Grant Application";


    document.getElementById(
        "applicationId"
    ).value =
        application.id;


    populateFacultyDropdown();


    document.getElementById(
        "applicationFaculty"
    ).value =
        application.faculty
            ? application.faculty.id
            : "";


    document.getElementById(
        "applicationTitle"
    ).value =
        application.title || "";


    document.getElementById(
        "requestedAmount"
    ).value =
        application.requestedAmount || "";


    document.getElementById(
        "approvedAmount"
    ).value =
        application.approvedAmount || "";


    document.getElementById(
        "utilizationDeadline"
    ).value =
        application.utilizationDeadline || "";


    document.getElementById(
        "abstractText"
    ).value =
        application.abstractText || "";


    document.getElementById(
        "applicationMessage"
    ).textContent = "";


    openModal("applicationModal");

}


/* =========================================================
   SAVE APPLICATION
========================================================= */

async function saveApplication(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "applicationId"
        ).value;


    const facultyId =
        document.getElementById(
            "applicationFaculty"
        ).value;


    const title =
        document.getElementById(
            "applicationTitle"
        ).value.trim();


    const requestedAmount =
        document.getElementById(
            "requestedAmount"
        ).value;


    const approvedAmount =
        document.getElementById(
            "approvedAmount"
        ).value;


    const utilizationDeadline =
        document.getElementById(
            "utilizationDeadline"
        ).value;


    const abstractText =
        document.getElementById(
            "abstractText"
        ).value.trim();


    const message =
        document.getElementById(
            "applicationMessage"
        );


    if (!facultyId) {

        message.textContent =
            "Please select a faculty member.";

        message.style.color =
            "#dc2626";

        return;

    }


    message.textContent =
        "Saving...";

    message.style.color =
        "#64748b";


    try {

        let response;


        const body = {

            title,

            requestedAmount:
                Number(requestedAmount),

            abstractText,

            approvedAmount:
                approvedAmount
                    ? Number(approvedAmount)
                    : null,

            utilizationDeadline

        };


        if (id) {

            response =
                await fetch(
                    `${API_URL}/applications/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(body)
                    }
                );

        }

        else {

            response =
                await fetch(
                    `${API_URL}/applications?facultyId=${facultyId}`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(body)
                    }
                );

        }


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to save application"
            );

        }


        message.textContent =
            id
                ? "Application updated successfully."
                : "Application created successfully.";


        message.style.color =
            "#16a34a";


        await loadApplications();


        setTimeout(
            () => closeModal(
                "applicationModal"
            ),
            700
        );


    } catch (error) {

        console.error(error);


        message.textContent =
            error.message;


        message.style.color =
            "#dc2626";

    }

}


/* =========================================================
   DELETE APPLICATION
========================================================= */

async function deleteApplication(id) {

    const application =
        applications.find(
            item => item.id === id
        );


    if (!application) return;


    const confirmed =
        confirm(
            `Delete application "${application.title}"?`
        );


    if (!confirmed) return;


    try {

        const response =
            await fetch(
                `${API_URL}/applications/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            const data =
                await response.json();

            throw new Error(
                data.message ||
                "Unable to delete application"
            );

        }


        await loadApplications();


        alert(
            "Application deleted successfully."
        );


    } catch (error) {

        console.error(error);


        alert(
            "Unable to delete application: " +
            error.message
        );

    }

}


/* =========================================================
   VIEW APPLICATION
========================================================= */

async function viewApplication(id) {

    const application =
        applications.find(
            item => item.id === id
        );


    if (!application) return;


    let stages = [];


    try {

        const response =
            await fetch(
                `${API_URL}/applications/${id}/stages`
            );


        if (response.ok) {

            stages =
                await response.json();

        }

    } catch (error) {

        console.error(error);

    }


    const latestStatus =
        stages.length > 0
            ? stages[0].status
            : "SUBMITTED";


    const details =
        document.getElementById(
            "applicationDetails"
        );


    details.innerHTML = `

        <div class="detail-grid">

            <div class="detail-item">

                <div class="detail-label">
                    Application ID
                </div>

                <div class="detail-value">
                    ${application.id}
                </div>

            </div>


            <div class="detail-item">

                <div class="detail-label">
                    Status
                </div>

                <div class="detail-value">

                    ${createStatusBadge(
                        latestStatus
                    )}

                </div>

            </div>


            <div class="detail-item">

                <div class="detail-label">
                    Faculty
                </div>

                <div class="detail-value">

                    ${
                        application.faculty
                        ? escapeHtml(
                            application.faculty.name
                          )
                        : "-"
                    }

                </div>

            </div>


            <div class="detail-item">

                <div class="detail-label">
                    Department
                </div>

                <div class="detail-value">

                    ${
                        application.faculty
                        ? escapeHtml(
                            application.faculty.department
                          )
                        : "-"
                    }

                </div>

            </div>


            <div class="detail-item">

                <div class="detail-label">
                    Requested Amount
                </div>

                <div class="detail-value">

                    ${formatCurrency(
                        application.requestedAmount
                    )}

                </div>

            </div>


            <div class="detail-item">

                <div class="detail-label">
                    Approved Amount
                </div>

                <div class="detail-value">

                    ${
                        application.approvedAmount !== null
                        &&
                        application.approvedAmount !== undefined
                            ? formatCurrency(
                                application.approvedAmount
                              )
                            : "-"
                    }

                </div>

            </div>


            <div class="detail-item">

                <div class="detail-label">
                    Utilization Deadline
                </div>

                <div class="detail-value">

                    ${
                        application.utilizationDeadline
                        || "-"
                    }

                </div>

            </div>


            <div class="detail-item">

                <div class="detail-label">
                    Title
                </div>

                <div class="detail-value">

                    ${escapeHtml(
                        application.title
                    )}

                </div>

            </div>


            <div class="detail-item full">

                <div class="detail-label">
                    Abstract
                </div>

                <div class="detail-value">

                    ${escapeHtml(
                        application.abstractText
                        || "-"
                    )}

                </div>

            </div>


            <div class="detail-item full">

                <div class="detail-label">
                    Stage History
                </div>

                <div>

                    ${
                        stages.length === 0
                        ? "<p>No stage history.</p>"
                        : stages.map(stage => `

                            <div
                                style="
                                padding:10px 0;
                                border-bottom:1px solid #e2e8f0;
                                "
                            >

                                ${createStatusBadge(
                                    stage.status
                                )}

                                <strong>
                                    ${stage.stageDate || ""}
                                </strong>

                                <div
                                    style="
                                    margin-top:5px;
                                    color:#64748b;
                                    font-size:13px;
                                    "
                                >

                                    ${
                                        escapeHtml(
                                            stage.remarks
                                            || "No remarks"
                                        )
                                    }

                                </div>

                            </div>

                        `).join("")
                    }

                </div>

            </div>

        </div>

    `;


    openModal("detailsModal");

}


/* =========================================================
   STAGE MODAL
========================================================= */

function openStageModal(id) {

    document.getElementById(
        "stageApplicationId"
    ).value =
        id;


    document.getElementById(
        "stageStatus"
    ).value =
        "UNDER_REVIEW";


    document.getElementById(
        "stageRemarks"
    ).value = "";


    document.getElementById(
        "stageMessage"
    ).textContent = "";


    openModal("stageModal");

}


/* =========================================================
   UPDATE STAGE
========================================================= */

async function updateStage(event) {

    event.preventDefault();


    const applicationId =
        document.getElementById(
            "stageApplicationId"
        ).value;


    const status =
        document.getElementById(
            "stageStatus"
        ).value;


    const remarks =
        document.getElementById(
            "stageRemarks"
        ).value.trim();


    const message =
        document.getElementById(
            "stageMessage"
        );


    message.textContent =
        "Updating stage...";


    message.style.color =
        "#64748b";


    try {

        const params =
            new URLSearchParams();


        params.append(
            "status",
            status
        );


        if (remarks) {

            params.append(
                "remarks",
                remarks
            );

        }


        const response =
            await fetch(
                `${API_URL}/applications/${applicationId}/stage?${params.toString()}`,
                {
                    method: "PUT"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to update stage"
            );

        }


        message.textContent =
            "Stage updated successfully.";


        message.style.color =
            "#16a34a";


        await loadApplications();


        setTimeout(
            () => closeModal("stageModal"),
            700
        );


    } catch (error) {

        console.error(error);


        message.textContent =
            error.message;


        message.style.color =
            "#dc2626";

    }

}


/* =========================================================
   EXPENDITURE APPLICATION DROPDOWN
========================================================= */

function populateExpenditureApplications() {

    const select =
        document.getElementById(
            "expenditureApplicationSelect"
        );


    if (!select) return;


    const currentValue =
        select.value;


    select.innerHTML = `

        <option value="">
            Select an application
        </option>

    `;


    applications.forEach(application => {

        const option =
            document.createElement("option");


        option.value =
            application.id;


        option.textContent =
            `#${application.id} - ${application.title}`;


        select.appendChild(option);

    });


    if (currentValue) {

        select.value =
            currentValue;

    }

}


/* =========================================================
   LOAD EXPENDITURE
========================================================= */

async function loadSelectedExpenditure() {

    const select =
        document.getElementById(
            "expenditureApplicationSelect"
        );


    const applicationId =
        select.value;


    if (!applicationId) {

        alert(
            "Please select an application."
        );

        return;

    }


    selectedExpenditureApplicationId =
        applicationId;


    const application =
        applications.find(
            item =>
                String(item.id) ===
                String(applicationId)
        );


    if (!application) return;


    try {

        const response =
            await fetch(
                `${API_URL}/applications/${applicationId}/expenditures`
            );


        if (!response.ok) {

            const data =
                await response.json();

            throw new Error(
                data.message ||
                "Unable to load expenditure"
            );

        }


        const expenditures =
            await response.json();


        const total =
            expenditures.reduce(
                (sum, item) =>
                    sum +
                    Number(item.amount || 0),
                0
            );


        const approved =
            Number(
                application.approvedAmount || 0
            );


        const remaining =
            approved - total;


        document.getElementById(
            "approvedAmountDisplay"
        ).textContent =
            formatCurrency(approved);


        document.getElementById(
            "totalExpenditureDisplay"
        ).textContent =
            formatCurrency(total);


        document.getElementById(
            "remainingAmountDisplay"
        ).textContent =
            formatCurrency(
                Math.max(remaining, 0)
            );


        document
            .getElementById(
                "expenditureSummary"
            )
            .classList.remove("hidden");


        document
            .getElementById(
                "expenditureTableContainer"
            )
            .classList.remove("hidden");


        renderExpenditureTable(
            expenditures
        );


    } catch (error) {

        console.error(error);


        alert(
            "Unable to load expenditure: " +
            error.message
        );

    }

}


/* =========================================================
   EXPENDITURE TABLE
========================================================= */

function renderExpenditureTable(
    expenditures
) {

    const tbody =
        document.getElementById(
            "expenditureTableBody"
        );


    tbody.innerHTML = "";


    if (expenditures.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="loading">

                    No expenditure recorded.

                </td>

            </tr>

        `;

        return;

    }


    expenditures.forEach(item => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${item.id}
            </td>

            <td>
                ${escapeHtml(
                    item.description || "-"
                )}
            </td>

            <td>
                ${formatCurrency(
                    item.amount
                )}
            </td>

            <td>
                ${item.expenditureDate || "-"}
            </td>

        `;


        tbody.appendChild(row);

    });

}


/* =========================================================
   ADD EXPENDITURE MODAL
========================================================= */

function openAddExpenditureModal() {

    if (
        !selectedExpenditureApplicationId
    ) {

        alert(
            "Please select an application first."
        );

        return;

    }


    const application =
        applications.find(
            item =>
                String(item.id) ===
                String(
                    selectedExpenditureApplicationId
                )
        );


    if (
        !application ||
        !application.approvedAmount
    ) {

        alert(
            "This application does not have an approved amount."
        );

        return;

    }


    document
        .getElementById("expenditureForm")
        .reset();


    document.getElementById(
        "expenditureDate"
    ).value =
        new Date()
            .toISOString()
            .split("T")[0];


    document.getElementById(
        "expenditureMessage"
    ).textContent = "";


    openModal("expenditureModal");

}


/* =========================================================
   SAVE EXPENDITURE
========================================================= */

async function saveExpenditure(event) {

    event.preventDefault();


    const amount =
        document.getElementById(
            "expenditureAmount"
        ).value;


    const description =
        document.getElementById(
            "expenditureDescription"
        ).value.trim();


    const expenditureDate =
        document.getElementById(
            "expenditureDate"
        ).value;


    const message =
        document.getElementById(
            "expenditureMessage"
        );


    if (
        !selectedExpenditureApplicationId
    ) {

        message.textContent =
            "Please select an application.";

        message.style.color =
            "#dc2626";

        return;

    }


    message.textContent =
        "Saving expenditure...";


    message.style.color =
        "#64748b";


    try {

        const response =
            await fetch(
                `${API_URL}/applications/${selectedExpenditureApplicationId}/expenditures`,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            amount:
                                Number(amount),

                            description,

                            expenditureDate:
                                expenditureDate || null

                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to save expenditure"
            );

        }


        message.textContent =
            "Expenditure saved successfully.";


        message.style.color =
            "#16a34a";


        await loadSelectedExpenditure();


        setTimeout(
            () =>
                closeModal(
                    "expenditureModal"
                ),
            700
        );


    } catch (error) {

        console.error(error);


        message.textContent =
            error.message;


        message.style.color =
            "#dc2626";

    }

}


/* =========================================================
   UTILITIES
========================================================= */

function formatCurrency(value) {

    const number =
        Number(value || 0);


    return "₹" +
        number.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        );

}


function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


/* =========================================================
   ESC KEY CLOSE MODALS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") return;


        document
            .querySelectorAll(".modal.show")
            .forEach(modal => {

                modal.classList.remove(
                    "show"
                );

            });

    }
);
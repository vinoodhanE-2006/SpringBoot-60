const BACKEND_URL = "http://localhost:8080";

document
    .getElementById("loginForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value;

        const errorMessage =
            document.getElementById("loginError");

        errorMessage.textContent = "";

        const credentials =
            btoa(username + ":" + password);

        try {

            const response = await fetch(
                `${BACKEND_URL}/api/auth/me`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Basic " + credentials
                    }
                }
            );

            if (!response.ok) {

                errorMessage.textContent =
                    "Invalid username or password.";

                return;
            }

            const user = await response.json();

            localStorage.setItem(
                "granttrackAuth",
                credentials
            );

            localStorage.setItem(
                "granttrackUser",
                JSON.stringify(user)
            );

            window.location.href = "index.html";

        } catch (error) {

            console.error(error);

            errorMessage.textContent =
                "Unable to connect to GrantTrack server.";

        }

    });
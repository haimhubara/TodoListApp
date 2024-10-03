            // Fetch error data from the server
            fetch("/register/error")
                .then(response => {
                    if (response.ok) {
                        return response.text(); // Parse response body as text
                    } else {
                        throw new Error("Network response was not ok");
                    }
                })
                .then(registerErrorMessege => {
                    // Display error message in errorContainer if not empty
                    const errorContainer = document.getElementById("errorContainer");
                    if (registerErrorMessege.trim() !== "") {
                        errorContainer.innerHTML = `<div class="alert alert-danger">${registerErrorMessege}</div>`;
                        errorContainer.style.display = "block"; // Show the error container
                    } else {
                        errorContainer.style.display = "none"; // Hide the error container
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    // Optionally, handle the error here
                });
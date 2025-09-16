fetch("/register/error")
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error("Network response was not ok");
        }
    })
    .then(registerErrorMessege => {
        const errorContainer = document.getElementById("errorContainer");
        if (registerErrorMessege && registerErrorMessege.trim() !== "") {
            errorContainer.innerHTML = `<div class="alert alert-danger">${registerErrorMessege}</div>`;
            errorContainer.style.display = "block";
        } else {
            errorContainer.innerHTML = "";
            errorContainer.style.display = "none";
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("table-client");
    const addNewBtn = document.getElementById("addNew");
    const employeeForm = document.getElementById("clientForm");
    const empId = document.getElementById("cliId");
    const clientModal = new bootstrap.Modal(document.getElementById("clientModal"));

    // Nuevo para CSV
    const csvModal = new bootstrap.Modal(document.getElementById("csvModal"));
    const butoncsv = document.getElementById("butoncsv");
    const uploadForm = document.getElementById("uploadForm");
    const uploadStatus = document.getElementById("uploadStatus");

    loadClient();

    function loadClient() {
        fetch("/client")
            .then(res => res.json())
            .then(data => {
                tabla.innerHTML = data.map(cli => `
                    <tr>
                        <td>${cli.id}</td>
                        <td>${cli.name}</td>
                        <td>${cli.address}</td>
                        <td>${cli.phone}</td>
                        <td>${cli.email}</td>
                        <td>
                            <button class="btn btn-warning btn-sm edit-btn" data-id="${cli.id}">Edit</button>
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${cli.id}">Delete</button>
                        </td>
                    </tr>
                `).join("");
            });
    }

    addNewBtn.addEventListener("click", () => {
        clientForm.reset();
        cliId.value = "";
        clientModal.show();
    });

    clientForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(clientForm).entries());
        const method = data.id ? "PUT" : "POST";
        const url = data.id ? `/client/${data.id}` : "/client";

        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(res => {
            if (res.ok) {
                clientModal.hide();
                loadClient();
            }
        });
    });

    tabla.addEventListener("click", (e) => {
        const id = e.target.dataset.id;

        if (e.target.classList.contains("delete-btn")) {
            if (confirm("Delete this client?")) {
                fetch(`/client/${id}`, { method: "DELETE" })
                    .then(res => {
                        if (res.ok) loadClient();
                    });
            }
        }

        if (e.target.classList.contains("edit-btn")) {
            fetch(`/client`)
                .then(res => res.json())
                .then(data => {
                    const emp = data.find(emp => emp.id == id);
                    if (emp) {
                        for (const key in emp) {
                            if (employeeForm[key]) employeeForm[key].value = emp[key];
                        }
                        empId.value = emp.id;
                        employeeModal.show();
                    }
                });
        }
    });

    // ==================== Funcionalidad CSV =====================
    butoncsv.addEventListener("click", () => {
        uploadStatus.textContent = "";
        uploadForm.reset();
        csvModal.show();
    });

    uploadForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('csvFile');

        if (!fileInput.files.length) {
            alert('Select a CSV file');
            return;
        }

        const formData = new FormData();
        formData.append('csvFile', fileInput.files[0]);

        uploadStatus.style.color = 'black';
        uploadStatus.textContent = 'Loading...';

        fetch('/execute-csv', {
            method: 'POST',
            body: formData,
        })
        .then(res => res.json())
        .then(data => {
            uploadStatus.style.color = 'green';
            uploadStatus.textContent = data.message || `Loading completed: ${data.inserted || 0} inserted records`;
            loadClient();
            setTimeout(() => csvModal.hide(), 1500);
        })
        .catch(err => {
            uploadStatus.style.color = 'red';
            uploadStatus.textContent = 'Loading error: ' + err.message;
        });
    });
});

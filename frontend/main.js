document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("tabla-empleados");
    const addNewBtn = document.getElementById("addNew");
    const employeeForm = document.getElementById("employeeForm");
    const empId = document.getElementById("empId");
    const employeeModal = new bootstrap.Modal(document.getElementById("employeeModal"));

    // Nuevo para CSV
    const csvModal = new bootstrap.Modal(document.getElementById("csvModal"));
    const butoncsv = document.getElementById("butoncsv");
    const uploadForm = document.getElementById("uploadForm");
    const uploadStatus = document.getElementById("uploadStatus");

    loadEmployees();

    function loadEmployees() {
        fetch("/employees")
            .then(res => res.json())
            .then(data => {
                tabla.innerHTML = data.map(emp => `
                    <tr>
                        <td>${emp.id}</td>
                        <td>${emp.name}</td>
                        <td>${emp.lastname}</td>
                        <td>${emp.lastname2 || ""}</td>
                        <td>${emp.email}</td>
                        <td>${emp.charge}</td>
                        <td>${emp.city}</td>
                        <td>${emp.salary}</td>
                        <td>${emp.age}</td>
                        <td>
                            <button class="btn btn-warning btn-sm edit-btn" data-id="${emp.id}">Editar</button>
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${emp.id}">Eliminar</button>
                        </td>
                    </tr>
                `).join("");
            });
    }

    addNewBtn.addEventListener("click", () => {
        employeeForm.reset();
        empId.value = "";
        employeeModal.show();
    });

    employeeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(employeeForm).entries());
        const method = data.id ? "PUT" : "POST";
        const url = data.id ? `/employees/${data.id}` : "/employees";

        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(res => {
            if (res.ok) {
                employeeModal.hide();
                loadEmployees();
            }
        });
    });

    tabla.addEventListener("click", (e) => {
        const id = e.target.dataset.id;

        if (e.target.classList.contains("delete-btn")) {
            if (confirm("¿Eliminar este empleado?")) {
                fetch(`/employees/${id}`, { method: "DELETE" })
                    .then(res => {
                        if (res.ok) loadEmployees();
                    });
            }
        }

        if (e.target.classList.contains("edit-btn")) {
            fetch(`/employees`)
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
            alert('Selecciona un archivo CSV');
            return;
        }

        const formData = new FormData();
        formData.append('csvFile', fileInput.files[0]);

        uploadStatus.style.color = 'black';
        uploadStatus.textContent = 'Cargando...';

        fetch('/execute-csv', {
            method: 'POST',
            body: formData,
        })
        .then(res => res.json())
        .then(data => {
            uploadStatus.style.color = 'green';
            uploadStatus.textContent = data.message || `Carga completada: ${data.inserted || 0} registros insertados`;
            loadEmployees();
            setTimeout(() => csvModal.hide(), 1500);
        })
        .catch(err => {
            uploadStatus.style.color = 'red';
            uploadStatus.textContent = 'Error en la carga: ' + err.message;
        });
    });
});

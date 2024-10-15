let empleados = JSON.parse(localStorage.getItem('empleados')) || [];

let sectores = ['Administración', 'Ventas', 'Marketing', 'Sistemas', 'RRHH', 'Legal', 'Compras', 'Producción'];

// CONTROL DE VISIÓN DE BOTONES
function viewFuntionEmployee(divId) {
    // Ocultar todos los contenedores
    document.getElementById('containerListEmployees').style.display = 'none';
    document.getElementById('containerSearchEmployees').style.display = 'none';
    document.getElementById('containerAddEmployees').style.display = 'none';
    document.getElementById('containerDeleteEmployees').style.display = 'none';

    // Limpiar mensajes de resultados anteriores
    document.getElementById('resultAddEmployee').innerHTML = '';
    document.getElementById('resultDeleteEmployee').innerHTML = '';
    document.getElementById('resultSearchEmployee').innerHTML = '';

    // Si divId no es null o undefined, mostrar el contenedor correspondiente
    if (divId) {
        document.getElementById(divId).style.display = 'block';
    }
}

document.getElementById('btnListEmployees').addEventListener('click', function() {
    viewFuntionEmployee('containerListEmployees');
    listEmployees();
});

document.getElementById('btnSearchEmployees').addEventListener('click', function() {
    viewFuntionEmployee('containerSearchEmployees');
    document.getElementById('resultSearchEmployee').innerHTML = '';
});

document.getElementById('btnAddEmployees').addEventListener('click', function() {
    viewFuntionEmployee('containerAddEmployees');
    listSectors(sectores);
    controlChildren();
});

document.getElementById('btnDeleteEmployees').addEventListener('click', function() {
    viewFuntionEmployee('containerDeleteEmployees');
});

document.getElementById('btnSearchEmployee').addEventListener('click', function() {
    SearchEmployees();
});

document.getElementById('btnDeleteEmployee').addEventListener('click', function() {
    deleteEmployee();
});

document.getElementById('saveEmployee').addEventListener('click', function() {
    addEmployees();
});

viewFuntionEmployee();

// LISTAR EMPLEADOS
function listEmployees() {
    const tbody = document.getElementById('dataListEmployees');
    tbody.innerHTML = '';
    
    if (empleados) {
        empleados.forEach(empleado => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${empleado.legajo}</th>
                <td>${empleado.empleado}</td>
                <td>${empleado.sector}</th>
                <td>${empleado.hijos}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// BUSCAR EMPLEADO
function SearchEmployees() {
    const inputLegajo = document.getElementById('inputSearchEmployee').value;
    const searchEmployee = empleados.find(employee => employee.legajo === inputLegajo);
    const resultSearchEmployee = document.getElementById('resultSearchEmployee');
    
    if (searchEmployee) {
        resultSearchEmployee.innerHTML = `
            <table class="table">
                <thead class="table-primary">
                <tr>
                    <th scope="col">Legajo</th>
                    <th scope="col">Empleado</th>
                    <th scope="col">Sector</th>
                    <th scope="col">Cantidad de Hijos/as</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">${searchEmployee.legajo}</th>
                        <td>${searchEmployee.empleado}</td>
                        <td>${searchEmployee.sector}</td>
                        <td>${searchEmployee.hijos}</td>
                    </tr>
                </tbody>
            </table>
        `;
    } else {
        resultSearchEmployee.innerHTML = `<h6 class="marginElement mensergerDanger">No se encontró el empleado con legajo ${inputLegajo}</h6>`;
    }

    document.getElementById('inputSearchEmployee').value = '';
}

function controlChildren() {
    let count = document.getElementById('countChildren');
    let subtract = document.getElementById('subtractChildren');
    let add = document.getElementById('addChildren');
    let counter = 0;

    subtract.onclick = () => {
        if (counter > 0) {
            counter--;
            count.innerHTML = counter;
        }
    }
    add.onclick = () => {
        counter++;
        count.innerHTML = counter;
    }
}

// LISTAR SECTORES
function listSectors(sectores) {
    const selectSector = document.getElementById('selectSector');
    if (selectSector) {
        // Limpiar cualquier opción existente
        selectSector.innerHTML = '';

        // Agregar nuevas opciones
        for (const sector of sectores) {
            const option = document.createElement('option');
            option.value = sector;
            option.textContent = sector;
            selectSector.appendChild(option);
        }
    }
}

// AGREGAR EMPLEADO
function addEmployees() {
    const legajo = document.getElementById('legajo').value;
    const empleado = document.getElementById('empleado').value;
    const sector = document.getElementById('selectSector').value;
    const hijos = document.getElementById('countChildren').textContent;
    const resultAddEmployee = document.getElementById('resultAddEmployee');

    // Validar si ya existe el legajo
    const searchEmployee = empleados.find(employee => employee.legajo === legajo);

    if (searchEmployee) {
        resultAddEmployee.innerHTML = `<h6 class="marginElement mensergerDanger">Ya existe un empleado con legajo ${legajo}</h6>`;
        return;
    } else {
        const newEmployee = {
            id: empleados.length, // Asignar un ID basado en la longitud del array
            legajo: legajo,
            empleado: empleado,
            sector: sector,
            hijos: hijos
        };
    
        empleados.push(newEmployee);
        localStorage.setItem('empleados', JSON.stringify(empleados));
    
        document.getElementById('legajo').value = '';
        document.getElementById('empleado').value = '';
        document.getElementById('selectSector').value = '';
        document.getElementById('countChildren').textContent = 0;
    
        resultAddEmployee.innerHTML = `<h6 class="marginElement mensergerSuccess">Empleado con legajo ${legajo} agregado correctamente</h6>`;
    }
}

// ELIMINAR EMPLEADO
function deleteEmployee() {
    const inputLegajo = document.getElementById('inputDeleteEmployee').value;
    const resultDeleteEmployee = document.getElementById('resultDeleteEmployee');

    const searchEmployee = empleados.find(employee => employee.legajo === inputLegajo);

    if (searchEmployee) {
        const index = empleados.indexOf(searchEmployee);
        empleados.splice(index, 1);
        localStorage.setItem('empleados', JSON.stringify(empleados));
        resultDeleteEmployee.innerHTML = `<h6 class="marginElement mensergerSuccess">Empleado con legajo ${inputLegajo} eliminado correctamente</h6>`;
    } else {
        resultDeleteEmployee.innerHTML = `<h6 class="marginElement mensergerDanger">No se encontró el empleado con legajo ${inputLegajo}</h6>`;
    }

    document.getElementById('inputDeleteEmployee').value = '';
}
let empleados = [];

let sectores = ['Administración', 'Ventas', 'Marketing', 'Sistemas', 'RRHH', 'Legal', 'Compras', 'Producción'];

// CONTROL DE VISION DE BOTONES
function viewFuntionEmployee(divId) {
    // Ocultar todos los contenedores
    document.getElementById('containerListEmployees').style.display = 'none';
    document.getElementById('containerSearchEmployees').style.display = 'none';
    document.getElementById('containerAddEmployees').style.display = 'none';
    document.getElementById('containerDeleteEmployees').style.display = 'none';

    document.getElementById(divId).style.display = 'block';
}

document.getElementById('btnListEmployees').addEventListener('click', function() {
    viewFuntionEmployee('containerListEmployees'); // Mostrar el contenedor de "Listar Empleados"
    listEmployees(empleados);
});

document.getElementById('btnSearchEmployees').addEventListener('click', function() {
    viewFuntionEmployee('containerSearchEmployees'); // Mostrar el contenedor de "Buscar Empleados"
    document.getElementById('resultSearchEmployee').innerHTML = '';
    SearchEmployees();
});

document.getElementById('btnAddEmployees').addEventListener('click', function() {
    viewFuntionEmployee('containerAddEmployees'); // Mostrar el contenedor de "Agregar Empleados"
    addEmployees();
});

document.getElementById('btnDeleteEmployees').addEventListener('click', function() {
    viewFuntionEmployee('containerDeleteEmployees'); // Mostrar el contenedor de "Eliminar Empleados"
    deleteEmployee();
});

viewFuntionEmployee(null);

// FIN DE CONTROL DE VISION DE BOTON

// LISTAR EMPLEADOS
function listEmployees(empleados){
    const tbody = document.getElementById('dataListEmployees');
    tbody.innerHTML = '';
    const storedEmpleados = localStorage.getItem('empleados');
    
    if (storedEmpleados) {
        const empleados = JSON.parse(storedEmpleados);
        empleados.forEach(empleado => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${empleado.legajo}</th>
                <td>${empleado.empleado}</td>
                <td>${empleado.sector}</td>
                <td>${empleado.hijos}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// BUSCAR EMPLEADO
function SearchEmployees () {
    const btnSearchEmployees = document.getElementById('btnSearchEmployee');
    const localStorageEmployees = JSON.parse(localStorage.getItem('empleados'));

    btnSearchEmployees.onclick = () => {
        
        const inputLegajo = document.getElementById('inputSearchEmployee').value;
        const searchEmployee = localStorageEmployees.find(employee => employee.legajo === inputLegajo);
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
                        `
        } else {
            resultSearchEmployee.innerHTML = `<h6 class="marginElement mensergerDanger">No se encontró el empleado con legajo ${inputLegajo}</h6>`;
        }

        document.getElementById('inputSearchEmployee').value = '';
    }
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

//AGREGAR EMPLEADO
function addEmployees() {

    listSectors(sectores);
    controlChildren();

    const buttonAddEmployee = document.getElementById('saveEmployee');
    const resultAddEmployee = document.getElementById('resultAddEmployee');
    resultAddEmployee.innerHTML = '';

    buttonAddEmployee.onclick = () => {
        const legajo = document.getElementById('legajo').value;
        const empleado = document.getElementById('empleado').value;
        const sector = document.getElementById('selectSector').value;
        const hijos = document.getElementById('countChildren').textContent;
        
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
    const btnDeleteEmployee = document.getElementById('btnDeleteEmployee');
    const localStorageEmployees = JSON.parse(localStorage.getItem('empleados'));
    const resultDeleteEmployee = document.getElementById('resultDeleteEmployee');
    resultDeleteEmployee.innerHTML = '';

    btnDeleteEmployee.onclick = () => {
        const inputLegajo = document.getElementById('inputDeleteEmployee').value;
        const searchEmployee = localStorageEmployees.find(employee => employee.legajo === inputLegajo);

        if (searchEmployee) {
            const index = localStorageEmployees.indexOf(searchEmployee);
            localStorageEmployees.splice(index, 1);
            localStorage.setItem('empleados', JSON.stringify(localStorageEmployees));
            resultDeleteEmployee.innerHTML = `<h6 class="marginElement mensergerSuccess">Empleado con legajo ${inputLegajo} eliminado correctamente</h6>`;
        } else {
            resultDeleteEmployee.innerHTML = `<h6 class="marginElement mensergerDanger">No se encontró el empleado con legajo ${inputLegajo}</h6>`;
        }

        document.getElementById('inputDeleteEmployee').value = '';
    }
}
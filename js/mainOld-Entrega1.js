const nombre = prompt('Bienvenido, me dirias tu nombre por favor')

let empleados = [
    { 
        id: 0,
        empleado: 'Adrian',
        sector: 'Sistemas',
        hijos: 1
    }
]

let sectores = ['Administración, Ventas, Marketing, Sistemas, RRHH, Legal, Compras, Producción'];

function listarEmpleados(listaEmpleados){
    
    let contador = 1;
    for (let empleado of empleados) {
        listaEmpleados += contador + '. ' + empleado + '\n';
        contador++;
    }
    return listaEmpleados;
}

function buscarEmpleado (empleadoABuscar){

    for (const [index, empleado] of empleados.entries()) {
        if (empleado.toLowerCase() === empleadoABuscar.toLowerCase()) {
            return [index + 1, empleado];
        }
    }
    return null
}

function contarEmpleados (){
    return alert('Actualmente contamos con ' + empleados.length );
}

function eliminarEmpleado(empleadoAEliminar) {
    const resultado = buscarEmpleado(empleadoAEliminar);

    if (resultado !== null) {
        const [id, empleado] = resultado; 
        empleados.splice(id - 1, 1);
        alert('Empleado ' + empleado + ' ha sido eliminado exitosamente.');
    } else {
        alert('Empleado no encontrado.');
    }
}

// do {
//     opciones = parseInt(prompt('¿Qué deseas hacer ' + nombre + '?: \n\n1- Ver Empleados \n2- Cargar Empleados \n3- Buscar Empleado \n4- Cuantos Empleados Existen \n5- Eliminar Empleado \n6- Salir'));

//     switch (opciones) {
//         case 1:
//             console.log('Lista de Empleados:');
//             console.table(empleados);
//             let listaEmpleados = '';
//             listaEmpleados = listarEmpleados(listaEmpleados);
//             alert(listaEmpleados);
//             break;
        
//         case 2:
//             let nuevoEmpleado = prompt('Nombre del nuevo empleado: ');
//             let confirmacion = confirm('El nombre ' + nuevoEmpleado + ' es correcto?');
//             buscarEmpleado(nuevoEmpleado) !== null ? alert('Empleado ' + nuevoEmpleado + ' ya esta ingresado') : confirmacion ?  (empleados.push(nuevoEmpleado), alert('Empleado agregado')) : alert('empleado no agregado');
//             break;
          
//         case 3:
//             let nombreABuscar = prompt('Ingrese el nombre del empleado a buscar');
//             const resultadoBusqueda = buscarEmpleado(nombreABuscar);
//             if (resultadoBusqueda !== null) {
//                 const [id, empleadoEncontrado] = resultadoBusqueda;
//                 alert('Empleado encontrado, id: ' + id + ' - ' + empleadoEncontrado);
//             } else {
//                 alert('Empleado no encontrado');
//             }
//             break;
        
//         case 4: 
//             contarEmpleados();
//             break;

//         case 5:
//             let empleadoAEliminar = prompt('Ingrese el nombre del empleado a eliminar');
//             eliminarEmpleado(empleadoAEliminar);
//             break;

//         case 6:
//             alert('Gracias ' + nombre + ' por usar nuestro sistema, ¡que tengas un buen día!');
//             break;
        
//         default:
//             alert('Opción no válida. Por favor, selecciona una opción entre 1 y 6.');
//             break;
//     }
// } while (opciones !== 6);
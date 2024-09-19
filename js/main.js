const nombre = prompt('Bienvenido, me dirias tu nombre por favor')

let empleados = ['Adrian', 'Victor', 'Jose']

function mensaje(mensaje) {
    alert(mensaje);
}

function listarEmpleados(listaEmpleados){
    
    for (let i = 0; i < empleados.length; i++) {
        listaEmpleados += (i + 1) + '. ' + empleados[i] + '\n';
    }
    return listaEmpleados;
}

function buscarEmpleado (empleadoABuscar){

    for (const index in empleados){
        if (empleados[index].toLowerCase() === empleadoABuscar.toLowerCase()){
            return [parseInt(index) + 1, empleados[index]]
        }
    }
    return null
}

function contarEmpleados (){
    return mensaje('Actualmente contamos con ' + empleados.length );
}

function eliminarEmpleado(empleadoAEliminar) {
    const resultado = buscarEmpleado(empleadoAEliminar);

    if (resultado !== null) {
        const [id, empleado] = resultado; 
        empleados.splice(id - 1, 1);
        mensaje('Empleado ' + empleado + ' ha sido eliminado exitosamente.');
    } else {
        mensaje('Empleado no encontrado.');
    }
}

do {
    opciones = parseInt(prompt('¿Qué deseas hacer ' + nombre + '?: \n\n1- Ver Empleados \n2- Cargar Empleados \n3- Buscar Empleado \n4- Cuantos Empleados Existen \n5- Eliminar Empleado \n6- Salir'));

    switch (opciones) {
        case 1:
            console.log('Lista de Empleados:');
            console.table(empleados);
            let listaEmpleados = '';
            listaEmpleados = listarEmpleados(listaEmpleados);
            mensaje(listaEmpleados);
            break;
        
        case 2:
            let nuevoEmpleado = prompt('Nombre del nuevo empleado: ');
            let confirmacion = confirm('El nombre ' + nuevoEmpleado + ' es correcto?');
            buscarEmpleado(nuevoEmpleado) !== null ? mensaje('Empleado ' + nuevoEmpleado + ' ya esta ingresado') : confirmacion ?  (empleados.push(nuevoEmpleado), mensaje('Empleado agregado')) : mensaje('empleado no agregado');
            break;
          
        case 3:
            let nombreABuscar = prompt('Ingrese el nombre del empleado a buscar');
            const resultadoBusqueda = buscarEmpleado(nombreABuscar);
            if (resultadoBusqueda !== null) {
                const [id, empleadoEncontrado] = resultadoBusqueda;
                mensaje('Empleado encontrado, id: ' + id + ' - ' + empleadoEncontrado);
            } else {
                mensaje('Empleado no encontrado');
            }
            break;
        
        case 4: 
            contarEmpleados();
            break;

        case 5:
            let empleadoAEliminar = prompt('Ingrese el nombre del empleado a eliminar');
            eliminarEmpleado(empleadoAEliminar);
            break;

        case 6:
            mensaje('Gracias ' + nombre + ' por usar nuestro sistema, ¡que tengas un buen día!');
            break;
        
        default:
            mensaje('Opción no válida. Por favor, selecciona una opción entre 1 y 3.');
            break;
    }
} while (opciones !== 6);
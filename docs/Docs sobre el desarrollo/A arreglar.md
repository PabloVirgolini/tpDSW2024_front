0.- CheckToken
    a. Apenas se inicia la página aparece un error:

    "Failed to laod resorce: the server responded with a status 500".
    :3000/api/users/checkToken:1 

    Otro error inmediatamente:

    "checkToken failed: Http failure response for http://localhost:3000/api/users/checkToken: 500 Internal Server Error" 
    usuarios.service.ts:78


    b. El checkToken no está andando del todo. El AuthService Lo único que se fija es que exista un token, pero no lo valida contra el backend.



1.- Tipos de Volquete
    a. (RESUELTO)
    Se puede hacer click en "AGREGAR" indefinidamente sin terminar de haber definido el anteior a agregar.
    b. (RESUELTO)
    Cuando CANCELO igual me deja el item vacío. Debería eliminarlo (actualizar el listado ya sin el item, cuyo agregado se canceló)
    c. (RESUELTO)
    Cuando agrego, el nuevo aparece con "ID" = 0. Debería o ser correlativa o ocultarla hasta que esté agregado.

    d.
    Cuando agrego, si no completo la Descripcion y hago click en Guardar no lo guarda, pero genera un error y no avisa qué problema está teniendo el usuario. Debería manejar el error y dar una alerta para que complete la Descripcion.

    e. (RESUELTO) Que no te deje borrar un tipo de volquete que se este usando en la clase de VOLQUETE.
        
        e.1.- (RESUELTO) Que el mensaje de alerta lo tire el snackbar en lugar de un texto en la página.


2.- Usuarios
    a. (RESUELTO) no puedo editar el nivel de permiso.

    b. (RESUELTO) El nivel de permiso debería salir de un listado de niveles

    c. (RESUELTO) Cuando quiero agregar un usuario, no se me deja editar el nombre. Siempre me queda en blanco ese espacio, generando un error.


3.- (RESUELTO)
Falta que el usuario se logee

4.- Según el rol del usuario se debería poder ver "Configuraciones" o no.


5.- Volquetes
    a. (RESUELTO)
     En el listado de volquetes no se muestra la Descripcion del Tipo de Volquete sino el nro de descripcion del tipo. Hay que ir a buscar la descripcion y mostrar eso, no el nro.

    b. Falta ver el estado del volquete. Si está alquilado o disponible

    c. Hay que agregar accion de ver el "HISTORIAL DE ALQUILERES"

    d. Agendar alquiler del volquete

    e. Ver agenda de alquileres de forma que se pueda saber rápidamente si tengo algún volquete libre en un día determinado y qué tipo de volquete tengo libre.

    f. Ahora que el listado de volquetes muestra la DESCRIPCION DEL TIPO, a la hora de EDITAR el volquete tenemos que tener una lista desplegable del TIPO para editarlo, y vamos a tener que modificar el Update del servicio de VolqueteService para actualizar el id_tipo_volquete que tenemos guardado en la tabla de Volquetes si se cambia.

    g. Quiero filtrar por tipo y por estado

    h. Al AGREGAR o EDITAR un volquete se pide la ID del tipoVolquete. Hay que hacer como en USUARIOS cuando piden el ROL: Pedir la DESCRIPCION y de ahí obtener la ID del tipo.

    
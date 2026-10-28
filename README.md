# Centro de Citas Médicas

Tercer parcial (Corte 3, 20 %) de la materia Desarrollo de Dispositivos Móviles, del programa de Ingeniería de Software de la Universidad Surcolombiana (USCO), que consiste en una aplicación híbrida hecha con Ionic 8 y Angular 18 en la cual se consultan especialistas médicos desde una API REST, se filtran por ciudad y compañía y se les agenda una cita, todo en una sola pantalla que se adapta tanto a celular como a tableta.

## Funcionalidades

Al abrir la aplicación se cargan los especialistas una sola vez y se muestran en un dashboard con tres tarjetas que se calculan a partir de los datos: los especialistas que quedan con los filtros aplicados frente al total, las citas agendadas y las ciudades distintas que se atienden, estas últimas contadas con `reduce()`. Las tarjetas van en un `ion-grid` que en celular las apila y en tableta las pone en una sola fila. Debajo está la tarjeta de filtros, con un `ion-select` para la ciudad y otro para la compañía enlazados con `[(ngModel)]`, de modo que la lista se actualiza en el momento en que se cambia cualquiera de los dos, y un botón para limpiarlos y volver a ver a todos los especialistas.

Cada especialista aparece en la lista con su avatar, su nombre, la compañía y la ciudad, junto a un `ion-badge` que se muestra en verde con "Disponible" mientras no tenga citas y en amarillo con "Con cita" cuando ya tiene al menos una. Al tocarlo se abre un `ion-modal` con sus datos de contacto, un campo para el nombre del paciente y un `ion-datetime` para elegir la fecha y la hora, que no deja seleccionar momentos ya pasados. Si el nombre está vacío, tiene menos de 3 letras o incluye números, o si falta la fecha, aparece un Toast rojo, y si todo está completo un `IonAlert` pide confirmar la reserva, tras lo cual se cierra el modal y sale un Toast verde de 2,5 segundos con el nombre del especialista.

## Endpoint y regla de negocio

Los datos se obtienen de `GET https://jsonplaceholder.typicode.com/users`, que devuelve 10 usuarios de prueba. El servicio `SpecialistsService` hace la petición con `HttpClient` y transforma cada usuario al modelo `Specialist` con `map()`, tomando solo los campos que usa la aplicación: nombre, correo, teléfono, `address.city` y `company.name`.

Como la API no trae apellido, este se deriva del nombre completo partiéndolo por espacios y descartando los títulos que terminan en punto, como "Mrs.", y los sufijos como la "V" de "Nicholas Runolfsdottir V", para quedarse con la última palabra. Con eso, la regla obligatoria del parcial se cumple filtrando con `filter()` por ciudad y compañía sobre la lista original, que nunca se modifica, y ordenando el resultado alfabéticamente por apellido con `sort()` y `localeCompare`. La API tampoco tiene citas, por lo que estas se guardan en memoria mientras la aplicación está abierta y se pierden al recargar la página.

## Cómo ejecutarlo

Se necesita Node.js 20 o 22 con npm.

```bash
git clone https://github.com/JuanFierro15/tercer-parcial-citas-medicas.git
cd tercer-parcial-citas-medicas
npm ci
npx @ionic/cli serve
```

La aplicación se abre en http://localhost:8100. Para verla como celular o tableta se puede usar el modo de dispositivo de las herramientas de desarrollo del navegador (F12 y luego Ctrl+Shift+M).

## Autor

Juan David Fierro Calderón ([JuanFierro15](https://github.com/JuanFierro15)), estudiante de Ingeniería de Software de la Universidad Surcolombiana, 2026.

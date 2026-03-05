<h1 align="center">
  <img src="https://github.com/Inexsu-Coordinadora/iuKer/blob/release/sprint-1/documentacion/logos/logoVertical.svg" alt="Logo del proyecto" width="300" height="300">
</h1>

## 1️⃣ Clonar el repositorio
Al clonar el repositorio estas descargando una copia exacta del proyecto desde GitHub a tu computador, para que puedas trabajar y testear localmente en él.

Decide donde quieres guardar tu proyecto, dentro de esa carpeta ejecuta desde tu terminal:
```
git clone git@github.com:Inexsu-Coordinadora/iuKer.git
```

Esto creara una carpeta que incluira todos los archivos necesarios para iniciar

---

## 2️⃣ Instala las dependencias necesarias
Se deben instalar las dependencias para que el proyecto tenga todas las librerías y herramientas externas necesarias para funcionar correctamente. Sin ellas, el código no podría ejecutarse porque faltarian los módulos que requiere.

Ejecuta el siguiente comando para instalar los paquetes principales definidos en `package.json`:

```bash
npm install
```

luego de esto, verifica que todas las dependencias se hayan instalado correctamente, ejecutando este comando:
```bash
npm list
```

En tu terminal veras la lista de dependencias, deben coinicidir con la siguiente
<pre>
├── @types/jest@30.0.0
├── @types/node@24.9.2
├── @types/pg@8.15.6
├── @types/supertest@6.0.3
├── dotenv@17.2.3
├── fastify@5.6.1
├── jest@30.2.0
├── pg@8.16.3
├── supertest@7.1.4
├── ts-jest@29.4.5
├── tsx@4.20.6
├── typescript@5.9.3
└── zod@4.1.12
</pre>

Si coinicide, puedes continuar
Si tuviste algún error, ve a <a href="#erroresDependencias">este link</a>.

---

## 3️⃣ Crea tu archivo `.env`
El archivo .env contiene las variables de entorno, es decir, configuraciones y credenciales que la aplicacion necesita para ejecutarse.

En la raiz del proyecto, encontraras un archivo llamado `.env-ejemplo`. Sigue las instrucciones dentro de este para tener tu configuracion.

---

## 4️⃣ Crea las tablas e inserta los datos a tu BBDD
> [!WARNING]
> DEBES CREAR TU BASE DE DATOS ANTES DE EJECUTAR ESTOS SCRIPTS
>
>
> SU NOMBRE DEBE SER "iukerdb"
>
>
Luego de crear tu base de datos llamada "iukerdb", ejecuta los archivos que se encuentran en la carpeta `/migraciones` en el siguiente orden:

1. `iuKer_creacion_tablas.sql` que incluye el **script para crear el esquema y las tablas de la base de datos**.
2. `iuKer_insercion_datos.sql` que incluye la **insercion** de datos de prueba, para hacer test de CRUD.

---
## 5️⃣ Compila el proyecto
Al compilar se prepara el proyecto para produccion, se genera una version lista para su ejecucion.

Para compilar el proyecto, se debe ejecutar:

```bash
npm run build
```
---

## 6️⃣ Ejecuta el servidor
Se debe iniciar el servidor (o la aplicacion) del proyecto, siguiendo lo que se define en el archivo package.json.

Para iniciar el servidor, se debe ejecutar:

```bash
npm start
```

---

## 7️⃣ Ejecuta los tests automatizados

En este proyecto se configuraron pruebas unitarias y de integración usando Jest y Supertest, ejecutadas con Node en modo `--experimental-vm-modules` para soportar módulos ES.  
Los scripts de prueba están definidos en el archivo `package.json`, por lo que puedes ejecutarlos directamente con `npm test`.

### 7.1 Requisitos previos para los tests

Antes de correr los tests, asegúrate de que:

- Ya instalaste todas las dependencias con:
```bash
npm install
```
- Tu archivo `.env` está configurado correctamente (puedes reutilizar el mismo `.env` de desarrollo o uno específico para testing).
- Tienes la base de datos creada: Ya ejecutaste las migraciones y scripts de creacion e inserción de la carpeta `/migraciones`.

### 7.2 Ejecutar todas las pruebas una vez

Para ejecutar el conjunto completo de pruebas unitarias e integración una sola vez:
```bash
npm test
```

Este comando ejecuta Jest con el siguiente script interno:
```bash
node --experimental-vm-modules node_modules/jest/bin/jest.js
```
### 7.3 Interpretar los resultados

- Si todas las pruebas pasan, verás un resumen con el número total de tests ejecutados y el detalle por archivo.
- Si alguna prueba falla, Jest mostrará el mensaje de error, el archivo y el test específico que falló para facilitar la depuración.
- Revisa los porcentajes de **Statements**, **Branches**, **Functions** y **Lines** para validar que se cumple el objetivo de cobertura definido para el sprint.


<a id="erroresDependencias"></a>
# ⚠️ Errores

## Error al instalar dependencias
Si tuviste algun error al instalar alguna dependencia (no aparece listada) ejecuta el comando de forma individual

### Types NodeJs
```bash
npm install -D @types/node@24.9.2
```
### Types pg (postgres)
```bash
npm install -D @types/pg@8.15.6
```
### Dotenv
```bash
npm install dotenv@17.2.3
```
### Fastify
```bash
npm install fastify@5.6.1
```
### pg (postgres)
```bash
npm install pg@8.16.3
```
### Tsx
```bash
npm install -D tsx@4.20.6
```
### Typescript
```bash
npm install -D typescript@5.9.3
```
### Zod
```bash
npm install zod@4.1.12
```

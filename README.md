<h1 align="center">
  <img src="https://github.com/00Ssam00/iuKerV2-Uni/blob/main/documentacion/logos/logoVertical.svg" alt="Logo del proyecto" width="400" height="400">
</h1>

# Créditos 🏆

Fork del proyecto original por [Sebastian](https://github.com/Sr4v3), [Israel](https://github.com/isrameve), [Edwin](https://github.com/Edwin-Pena) y [Samuel](https://github.com/00Ssam00).

Colaboradores actuales: [Samuel](https://github.com/00Ssam00), [Alejandro](https://github.com/Tenkazito) y [Yuritza](https://github.com/yuritzamendoza845-glitch).


---

## 1️⃣ Clonar el repositorio
Al clonar el repositorio estás descargando una copia exacta del proyecto desde GitHub a tu computador, para que puedas trabajar y testear localmente en él.

Decide donde quieres guardar tu proyecto, dentro de esa carpeta ejecuta desde tu terminal:

### Con SSH
```bash
git clone git@github.com:00Ssam00/iuKerV2-Uni.git
```

### Con HTTPS
```bash
git clone https://github.com/00Ssam00/iuKerV2-Uni.git
```

Esto creará una carpeta que incluirá todos los archivos necesarios para iniciar

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

En tu terminal verás la lista de dependencias, deben coincidir con la siguiente
<pre>
├── @types/jest@30.0.0
├── @types/node@24.9.2
├── @types/pg@8.15.6
├── @types/supertest@6.0.3
├── dotenv@17.2.3
├── fastify@5.8.1
├── jest@30.2.0
├── pg@8.16.3
├── supertest@7.1.4
├── ts-jest@29.4.5
├── tsx@4.20.6
├── typescript@5.9.3
└── zod@4.1.12
</pre>

Si coincide, puedes continuar.
Si tuviste algún error, ve a <a href="#erroresDependencias">este link</a>.

---

## 3️⃣ Crea tu archivo `.env`
El archivo `.env` contiene las variables de entorno que la aplicación necesita para ejecutarse.

Dentro de la carpeta `backend/` encontrarás un archivo llamado `.env-ejemplo`. Cópialo con el nombre `.env` y completa los valores:

```bash
cp backend/.env-ejemplo backend/.env
```

Las variables que debes configurar son:

| Variable | Descripción |
|---|---|
| `PUERTO` | Puerto HTTP del servidor (ej: `3001`) |
| `DATABASE_URL` | URL de conexión a NeonDB (ver paso 4) |
| `FRONTEND_URL` | URL del frontend (ej: `http://localhost:5173`) |
| `NODE_ENV` | Entorno de ejecución (`development` o `production`) |

---

## 4️⃣ Configura la base de datos con NeonDB
Este proyecto usa **[NeonDB](https://neon.tech)** como base de datos PostgreSQL en la nube, en lugar de una instalación local.

### 4.1 Crear una cuenta y proyecto en Neon
1. Regístrate en [neon.tech](https://neon.tech) (puedes usar GitHub)
2. Crea un nuevo proyecto y una base de datos (puedes llamarla `iukerdb`)
3. En el dashboard de Neon, copia la **Connection string** — se ve así:
```
postgresql://usuario:contraseña@ep-xxx.us-east-1.aws.neon.tech/iukerdb?sslmode=require
```
4. Pégala como valor de `DATABASE_URL` en tu archivo `.env`

### 4.2 Ejecutar las migraciones
Con tu base de datos creada en Neon, ejecuta los scripts de la carpeta `backend/migraciones/` usando el editor SQL del dashboard de Neon o `psql`, en el siguiente orden:

1. `iuKer_creacion_tablas.sql` — crea el esquema y las tablas
2. `iuKer_insercion_datos.sql` — inserta datos de prueba para CRUD

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

En este proyecto se configuraron pruebas unitarias y de integración usando Jest y Supertest, ejecutadas con Node en modo `--experimental-vm-modules` para soportar módulos ES (ES: ECMAScript).
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

---

## 🌐 Despliegue en producción

El proyecto está desplegado en **[Railway](https://railway.app)**:

| Componente | URL |
|---|---|
| Frontend | https://iuker.up.railway.app |
| Backend | https://iukerback.up.railway.app |
| Base de datos | NeonDB (PostgreSQL serverless) |

### Variables de entorno en Railway

**Backend:**
| Variable | Valor |
|---|---|
| `DATABASE_URL` | URL de conexión de NeonDB |
| `FRONTEND_URL` | `https://iuker.up.railway.app` |
| `NODE_ENV` | `production` |
| `PORT` | `3001` |

**Frontend:**
| Variable | Valor |
|---|---|
| `VITE_API_URL` | `https://iukerback.up.railway.app` |

---

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
npm install fastify@5.8.1
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
### Jest
```bash
npm install -D jest@30.2.0
```
### Supertest
```bash
npm install -D supertest@7.1.4
```
### Ts-jest
```bash
npm install -D ts-jest@29.4.5
```
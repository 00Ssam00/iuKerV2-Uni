# frontDocs.md — Documentación técnica del frontend iuKer

> **Audiencia:** Desarrolladores del equipo que necesiten entender, mantener o extender el frontend.
> **Fecha:** 2026-03-16
> **Versión:** basada en el código del branch `feature/01-historia-usuario`

---

## 1. Visión general

El frontend de **iuKer** es una SPA (Single-Page Application) construida con React y TypeScript. Gestiona dos módulos principales:

- **Citas Médicas** — listado, búsqueda, agendamiento, reagendamiento, cancelación y eliminación de citas.
- **Historial de Paciente** — consulta del historial clínico por número de documento, registro de nuevas entradas y vista detalle de cada registro.

La aplicación consume una API REST corriendo en `http://localhost:3001/api`.

### Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18+ | UI declarativa con hooks |
| TypeScript | 5+ | Tipado estático |
| Vite | — | Bundler y servidor de desarrollo |
| Tailwind CSS | 3+ | Estilos utilitarios |
| Axios | — | Cliente HTTP |
| Lucide React | — | Iconografía SVG |

---

## 2. Estructura de carpetas

```
front2/
├── public/
│   └── logoVerticalNoCreditos.svg   # Logo de la app usado en el navbar
├── src/
│   ├── main.tsx                     # Punto de entrada; monta <App> en #root
│   ├── App.tsx                      # Mini-router con estado; define tipos de navegación
│   ├── index.css                    # Estilos base (Tailwind directives)
│   ├── components/
│   │   └── dataTable.tsx            # Componente central de citas médicas (802 líneas)
│   └── pages/
│       ├── citasMedicas.tsx         # Wrapper page que configura DataTable
│       └── historialPaciente.tsx    # Página completa del historial clínico
├── frontDocs.md                     # Este documento
└── package.json
```

---

## 3. App.tsx — Enrutamiento y navegación

`App.tsx` implementa un mini-router basado en estado de React. No usa React Router ni ninguna librería de enrutamiento externa.

### Tipos exportados

```ts
export type Pagina = 'citas' | 'historial';
export type NavParams = { buscarId?: string };
```

- **`Pagina`** — identifica cuál de las dos páginas está activa.
- **`NavParams`** — parámetros opcionales que se pasan entre páginas. Por ahora solo `buscarId` (para pre-rellenar la búsqueda en Citas Médicas desde Historial).

### Estado interno

| Estado | Tipo | Propósito |
|---|---|---|
| `pagina` | `Pagina` | Controla qué página se renderiza |
| `navParams` | `NavParams` | Parámetros que acompañan la navegación |

### Función `handleNavigate`

```ts
const handleNavigate = (p: Pagina, params: NavParams = {}) => {
  setNavParams(params);
  setPagina(p);
};
```

Actualiza ambos estados en un solo llamado. Se pasa como prop `onNavigate` a los componentes hijos. El orden importa: `setNavParams` primero garantiza que el componente destino reciba los parámetros cuando se monte.

### Renderizado condicional

```ts
return pagina === 'citas'
  ? <CitasMedicas onNavigate={handleNavigate} initialSearch={navParams.buscarId} />
  : <HistorialPaciente onNavigate={handleNavigate} />;
```

---

## 4. citasMedicas.tsx — Wrapper de configuración

Archivo delgado que instancia `DataTable` con la configuración del módulo de citas.

```ts
interface CitasMedicasProps {
  onNavigate: (p: Pagina, params?: NavParams) => void;
  initialSearch?: string;
}
```

Pasa dos props de configuración a `DataTable`:
- `baseUrl='http://localhost:3001/api/citas-medicas'` — URL base de la API de citas.
- `primaryColor='#2563EB'` — color azul Tailwind-600 aplicado a botones, spinners y ring de focus.

> **Patrón:** El wrapper existe para desacoplar la configuración (URLs, colores de marca) del componente genérico `DataTable`. Si se añadiera otro módulo similar, bastaría crear otro wrapper con diferente `baseUrl` y `primaryColor`.

---

## 5. dataTable.tsx — Componente central de citas (802 líneas)

### 5.1 Interfaces de datos

```ts
interface CitaMedica {
  idCita: string;              // UUID de la cita
  paciente: string;            // Nombre completo del paciente
  tipoDocPaciente: string;     // Sigla: CC, CE, PA, TI
  numeroDocPaciente: string;   // Número de documento
  medico: string;              // Nombre completo del médico
  medicoTarjeta: string;       // Tarjeta profesional del médico (código)
  ubicacion: string | null;    // Ciudad/sede (puede ser null)
  consultorio: string | null;  // Número de consultorio (puede ser null)
  fecha: string;               // ISO 8601 fecha de la cita
  horaInicio: string;          // HH:MM:SS
  codigoEstadoCita: number;    // Código numérico del estado
  estadoCita: string;          // Texto: Activa, Finalizada, Cancelada, Reprogramada, Actualizada
  idCitaAnterior: string | null; // UUID de cita anterior si fue reprogramada
}

interface ApiResponse {
  cantidadCitas: number;
  citasEncontradas: CitaMedica[];
}

interface Medico {
  tarjetaProfesional: string;  // Código único del médico
  nombre: string;
  apellido: string;
}

interface HistorialCita {
  idHistorial: string;
  idCita: string;
  paciente: string;
  medico: string;
  fecha: string;
  diagnostico: string;
  descripcion: string | null;
  fechaRegistro: string;
}

interface DataTableProps {
  baseUrl: string;             // URL base de la API de citas
  primaryColor: string;        // Color hex para elementos de marca
  onNavigate: (p: Pagina, params?: NavParams) => void;
  initialSearch?: string;      // Valor inicial del campo de búsqueda
}
```

### 5.2 Estados (16)

| Estado | Tipo | Propósito |
|---|---|---|
| `data` | `CitaMedica[]` | Lista de citas actualmente mostradas en la tabla |
| `loading` | `boolean` | Controla el spinner de carga |
| `error` | `string \| null` | Mensaje de error visible al usuario |
| `searchId` | `string` | Valor del input de búsqueda |
| `openMenuId` | `string \| null` | ID de la cita cuyo menú desplegable está abierto |
| `showModal` | `boolean` | Visibilidad del modal de agendar/reagendar cita |
| `isEditing` | `boolean` | `true` si el modal está en modo reagendar, `false` si es nueva cita |
| `currentCitaId` | `string \| null` | ID de la cita que se está editando |
| `copiedId` | `string \| null` | ID copiado al portapapeles; se limpia tras 1800 ms |
| `medicoSugerido` | `string` | Tarjeta profesional del primer médico disponible (autosugerencia) |
| `menuPos` | `{ top: number; right: number } \| null` | Posición absoluta del menú desplegable en viewport |
| `historialModal` | `HistorialCita \| null \| 'vacio'` | Datos del historial a mostrar; `'vacio'` indica que no hay historial |
| `loadingHistorial` | `boolean` | Spinner dentro del modal de historial |
| `citaIdParaHistorial` | `string \| null` | ID de la cita cuyo historial se está consultando |
| `formHistorialInline` | `{ diagnostico: string; descripcion: string }` | Campos del formulario de registro inline de historial |
| `submittingHistorial` | `boolean` | Previene doble envío del formulario de historial |
| `medicoActualNombre` | `string` | Nombre del médico de la cita que se está reagendando |
| `formData` | `{ medico, tipoDocPaciente, numeroDocPaciente, fecha, horaInicio }` | Campos del formulario de agendar/reagendar |

> Nota: `formData` y `medicoActualNombre` suman 18 piezas de estado, pero el componente los gestiona de forma cohesiva.

### 5.3 Funciones (14)

#### `fetchAllCitas(): Promise<void>`
- **Endpoint:** `GET {baseUrl}`
- Carga todas las citas, activa el spinner, guarda el arreglo en `data`.

#### `fetchCitaById(id: string): Promise<void>`
- **Lógica dual de búsqueda:**
  1. Si `id` vacío → llama `fetchAllCitas()`.
  2. Si `id` **no** es UUID → hace `GET {baseUrl}`, filtra localmente por `numeroDocPaciente === id`.
  3. Si `id` **es** UUID → `GET {baseUrl}/{id}`, maneja tres formatos de respuesta posibles.
- **Endpoints:** `GET {baseUrl}` y `GET {baseUrl}/{id}`

#### `fetchMedicoSugerido(): Promise<void>`
- **Endpoint:** `GET http://localhost:3001/api/medicos?limite=1`
- Obtiene el primer médico disponible y guarda su `tarjetaProfesional` en `medicoSugerido`. Se llama al abrir el modal de nueva cita.

#### `handleVerHistorial(idCita: string): Promise<void>`
- **Endpoint:** `GET http://localhost:3001/api/historial-paciente/cita/{idCita}`
- Abre el modal de historial. Si el servidor responde 404, establece `historialModal = 'vacio'` para mostrar el formulario de registro inline.

#### `handleRegistrarHistorialInline(e: React.FormEvent): Promise<void>`
- **Endpoints:** `POST http://localhost:3001/api/historial-paciente` y luego `GET .../cita/{id}` para refrescar.
- Valida que `diagnostico` no esté vacío. Envía `{ idCita, diagnostico, descripcion? }`. Al éxito, refresca el modal con el historial recién creado.

#### `toggleMenu(citaId: string, e: React.MouseEvent): void`
- Calcula la posición del botón pulsado usando `getBoundingClientRect()` y la almacena en `menuPos` para posicionar el menú con `position: fixed` (evita el clipping de `overflow: hidden` en la tabla).

#### `handleCopiarId(id: string): Promise<void>`
- Escribe el UUID completo al portapapeles con la API nativa `navigator.clipboard.writeText`.
- Activa el estado `copiedId` durante 1800 ms para mostrar el ícono de check.

#### `handleReagendar(cita: CitaMedica): void`
- Prepopula `formData` con los datos de la cita (convirtiendo `tipoDocPaciente` de sigla a número con `tipoDocMap`).
- Establece `isEditing = true` y abre el modal.

#### `handleCancelar(cita: CitaMedica): Promise<void>`
- **Endpoint:** `PUT {baseUrl}/cancelacion/{idCita}`
- Solicita confirmación con `window.confirm` antes de enviar.

#### `handleEliminar(cita: CitaMedica): Promise<void>`
- **Endpoint:** `DELETE {baseUrl}/eliminacion/{idCita}`
- Solicita confirmación. Al éxito recarga toda la tabla.

#### `handleOpenModal(): void`
- Resetea `formData` y llama `fetchMedicoSugerido()` en paralelo.

#### `handleCloseModal(): void`
- Limpia `showModal`, `isEditing`, `currentCitaId` y `medicoActualNombre`.

#### `handleInputChange(e): void`
- Handler genérico para todos los inputs del formulario de cita. Usa `name` del input como key en `formData`.

#### `handleSubmitCita(e: React.FormEvent): Promise<void>`
- **Endpoints:**
  - Nueva cita: `POST {baseUrl}` con `{ medico, tipoDocPaciente: number, numeroDocPaciente, fecha, horaInicio }`
  - Reagendar: `PUT {baseUrl}/reprogramacion/{currentCitaId}` con el mismo payload
- Valida que todos los campos estén completos antes de enviar.

#### `handleSearch(e: React.FormEvent): void`
- Llama `fetchCitaById(searchId)`. Disparado por el formulario de búsqueda o por la tecla Enter.

#### `formatDate(dateString): string`
- Formatea una fecha ISO al formato `DD/MM/AAAA` en locale `es-CO`. Retorna `'-'` si el valor es null o inválido.

#### `formatTime(timeString): string`
- Recorta un string de tiempo `HH:MM:SS` a `HH:MM`. Retorna `'-'` si es null.

### 5.4 Función auxiliar: `estadoBadge`

```ts
const estadoBadge = (estadoCita: string): string
```

Retorna clases Tailwind para colorear el badge de estado. Ver [Sección 9 — Paleta de estados](#9-paleta-de-estados).

### 5.5 Secciones JSX (6)

1. **Navbar** — Logo + dos botones de navegación (Citas Médicas / Historial). El botón activo usa `primaryColor`.
2. **Barra de búsqueda + botón "Nueva cita"** — Input con icono `Search`, lógica de búsqueda al submit y al Enter.
3. **Tabla de citas** — 10 columnas; estados de loading/error/vacío. Columna ID con truncado y botón copiar. Columna Estado: si es `Finalizada`, el badge es clickeable para abrir el historial.
4. **Modal cita** — Formulario para agendar/reagendar. El título cambia según `isEditing`. En modo nueva cita muestra la sugerencia de médico como botón clickeable para autocompletar.
5. **Modal historial clínico** — Tres sub-estados: cargando, vacío (con formulario inline de registro), o con datos (grid 2×2 con metadata + diagnóstico + descripción opcional).
6. **Menú desplegable de acciones** — Posicionado con `fixed` usando `menuPos`. Contiene: Reagendar (deshabilitado si Cancelada/Finalizada), Cancelar cita (ídem), Eliminar cita. Un overlay transparente cierra el menú al hacer clic fuera.

---

## 6. historialPaciente.tsx — Página de historial completo

### 6.1 Interfaces de datos

```ts
interface HistorialEntry {
  idHistorial: string;
  idCita: string;
  paciente: string;
  medico: string;
  fecha: string;               // Fecha de la cita asociada
  diagnostico: string;
  descripcion: string | null;  // Notas adicionales (opcional)
  fechaRegistro: string;       // Timestamp de creación del registro
}

interface HistorialApiResponse {
  cantidadRegistros: number;
  historial: HistorialEntry[];
}
```

### 6.2 Estados (8)

| Estado | Tipo | Propósito |
|---|---|---|
| `data` | `HistorialEntry[]` | Registros de historial encontrados |
| `loading` | `boolean` | Spinner de búsqueda |
| `error` | `string \| null` | Mensaje de error |
| `searched` | `boolean` | Indica si ya se realizó al menos una búsqueda (controla el estado inicial vacío) |
| `searchDoc` | `string` | Valor del input de búsqueda por documento |
| `showModal` | `boolean` | Visibilidad del modal de registro manual |
| `submitting` | `boolean` | Previene doble envío del formulario del modal |
| `selectedEntry` | `HistorialEntry \| null` | Registro seleccionado; activa la vista detalle |
| `formData` | `{ idCita, diagnostico, descripcion }` | Campos del formulario de registro manual |

### 6.3 Funciones (6)

#### `buscarHistorial(e?: React.FormEvent): Promise<void>`
- **Endpoint:** `GET http://localhost:3001/api/historial-paciente/paciente/{numeroDocumento}`
- Resetea `selectedEntry` antes de buscar para siempre retornar a la vista lista.
- Si responde 404, establece `data = []` sin mostrar error (el paciente simplemente no tiene historial).
- Establece `searched = true` para distinguir el estado "sin buscar" del estado "buscó pero no encontró".

#### `handleRegistrar(e: React.FormEvent): Promise<void>`
- **Endpoints:** `POST http://localhost:3001/api/historial-paciente` + `GET .../paciente/{doc}` para refrescar.
- Valida `idCita` y `diagnostico` como obligatorios.
- Si hay una búsqueda activa (`searched && searchDoc`), refresca la lista al registrar.

#### `formatDate(dateString): string`
- Formato largo: `"16 de marzo de 2026"` (locale `es-CO` con `month: 'long'`). Usado en la vista detalle.

#### `formatDateShort(dateString): string`
- Formato corto: `"16/03/2026"`. Usado en las tarjetas del grid.

#### `formatDateTime(dateString): string`
- Fecha + hora: `"16/03/2026, 10:30"`. Usado en el pie de tarjetas y metadata de detalle.

#### `irACita(idCita: string): void`
- Llama `onNavigate('citas', { buscarId: idCita })` para navegar al módulo de Citas con la búsqueda pre-rellenada con el UUID de la cita.

### 6.4 Vista lista (grid de tarjetas)

Condiciones de renderizado:
1. **`loading`** → spinner centrado
2. **`error`** → ícono de error + mensaje
3. **`!searched`** → estado inicial con ícono `ClipboardList` e instrucción al usuario
4. **`data.length === 0`** → "no hay registros" con ícono `FileText`
5. **Datos** → grid responsive (`1 col / 2 col / 3 col`) de tarjetas clicables

Cada tarjeta muestra: nombre del paciente, fecha corta, nombre del médico, diagnóstico truncado a 2 líneas (`line-clamp-2`), y timestamp de registro.

### 6.5 Vista detalle

Se activa cuando `selectedEntry !== null`. Renderiza una tarjeta estructurada como documento clínico formal:
- **Cabecera azul** con ícono `FileText` y nombre del paciente.
- **Metadata** en grid 2×2: médico, fecha de cita, timestamp de registro, y botón con el UUID de la cita (clickeable → navega a Citas Médicas).
- **Cuerpo** con secciones Diagnóstico y Descripción (si existe).

Botón "Volver al historial" limpia `selectedEntry` para regresar a la vista lista.

### 6.6 Modal de registro manual

Campos: ID de cita (UUID, input `font-mono`), Diagnóstico (textarea, obligatorio), Descripción (textarea, opcional). El modal advierte que la cita debe estar en estado `Finalizada`.

### 6.7 Componente interno `Navbar`

Definido como función interna del componente (no exportada). Estructura idéntica al navbar de `dataTable.tsx`. El botón activo en esta página es "Historial" (hardcodeado con `bg-blue-600`).

---

## 7. Tabla de endpoints API

| Método | URL | Descripción |
|---|---|---|
| `GET` | `/api/citas-medicas` | Obtiene todas las citas médicas |
| `GET` | `/api/citas-medicas/{id}` | Obtiene una cita específica por UUID |
| `POST` | `/api/citas-medicas` | Agenda una nueva cita |
| `PUT` | `/api/citas-medicas/reprogramacion/{id}` | Reagenda una cita existente |
| `PUT` | `/api/citas-medicas/cancelacion/{id}` | Cancela una cita |
| `DELETE` | `/api/citas-medicas/eliminacion/{id}` | Elimina una cita permanentemente |
| `GET` | `/api/medicos?limite=1` | Obtiene el primer médico (para autosugerencia) |
| `GET` | `/api/historial-paciente/cita/{idCita}` | Obtiene el historial de una cita específica |
| `GET` | `/api/historial-paciente/paciente/{doc}` | Obtiene todos los registros de un paciente por documento |
| `POST` | `/api/historial-paciente` | Registra un nuevo historial clínico |

**Payload de cita (POST/PUT):**
```json
{
  "medico": "MP001",
  "tipoDocPaciente": 1,
  "numeroDocPaciente": "100001",
  "fecha": "2026-03-20",
  "horaInicio": "09:00"
}
```

**Payload de historial (POST):**
```json
{
  "idCita": "uuid-de-la-cita",
  "diagnostico": "Texto del diagnóstico",
  "descripcion": "Notas opcionales"
}
```

---

## 8. Flujos de usuario

### Flujo 1: Ver todas las citas
1. Usuario abre la app → se monta `CitasMedicas` → `useEffect` llama `fetchAllCitas()`.
2. Spinner visible mientras carga.
3. Tabla renderiza todas las citas.

### Flujo 2: Buscar por número de documento
1. Usuario escribe un número de documento en el input de búsqueda.
2. Presiona Enter o el botón de búsqueda.
3. `fetchCitaById` detecta que no es UUID → descarga todas las citas y filtra localmente.
4. La tabla muestra solo las citas del paciente.

### Flujo 3: Buscar por UUID de cita
1. Usuario pega un UUID completo en el input.
2. `fetchCitaById` detecta el formato UUID → hace `GET /api/citas-medicas/{uuid}`.
3. La tabla muestra la cita encontrada (o mensaje de error si no existe).

### Flujo 4: Agendar nueva cita
1. Usuario hace clic en "Nueva cita" → `handleOpenModal()` abre el modal y llama `fetchMedicoSugerido()`.
2. Se muestra el código del primer médico disponible como sugerencia clickeable.
3. Usuario completa el formulario.
4. Clic en "Agendar cita" → `handleSubmitCita()` envía `POST /api/citas-medicas`.
5. Modal se cierra y la tabla se recarga.

### Flujo 5: Reagendar una cita
1. Usuario abre el menú de acciones (⋮) de una cita Activa o Reprogramada.
2. Clic en "Reagendar cita" → `handleReagendar()` prepopula el formulario con los datos actuales.
3. Modal se abre en modo edición (título "Reagendar cita", botón "Reagendar").
4. Usuario modifica los campos y confirma.
5. Se envía `PUT /api/citas-medicas/reprogramacion/{id}`.

### Flujo 6: Ver historial desde cita finalizada
1. Usuario ve una cita con estado "Finalizada" en la tabla.
2. Hace clic en el badge "Finalizada" (es un botón).
3. Se abre el modal de historial con spinner.
4. Si existe historial: se muestra metadata + diagnóstico + descripción.
5. Si no existe: se muestra formulario inline para registrar el historial en el momento.

### Flujo 7: Consultar historial completo de un paciente
1. Usuario navega a la página "Historial" (botón en navbar).
2. Escribe el número de documento del paciente.
3. Presiona Enter o el botón de búsqueda → `buscarHistorial()` consulta `GET /api/historial-paciente/paciente/{doc}`.
4. Se muestra el grid de tarjetas con todos los registros del paciente.
5. Clic en una tarjeta → vista detalle del registro.
6. En la vista detalle, el usuario puede hacer clic en el UUID de la cita para navegar directamente a esa cita en el módulo de Citas Médicas (usando `irACita()`).

---

## 9. Paleta de estados de cita

| Estado | Fondo | Texto | Borde |
|---|---|---|---|
| `Activa` | `emerald-50` | `emerald-700` | `emerald-200` |
| `Finalizada` | `blue-50` | `blue-700` | `blue-200` |
| `Cancelada` | `red-50` | `red-600` | `red-200` |
| `Reprogramada` | `orange-50` | `orange-700` | `orange-200` |
| `Actualizada` | `yellow-50` | `yellow-700` | `yellow-200` |
| *(desconocido)* | `gray-50` | `gray-600` | `gray-200` |

Los estilos se definen con la clase `ring-1` de Tailwind para el borde.

---

## 10. Mejoras de UX implementadas

### 1. Búsqueda dual (UUID / número de documento)
En `fetchCitaById`, se evalúa el input con una regex de UUID. Si coincide, se hace una petición directa al backend con el UUID. Si no coincide, se asume que es un número de documento y se filtra localmente tras descargar todas las citas. Esto evita que el usuario tenga que saber si tiene el UUID o el documento.

### 2. Médico pre-rellenado al crear cita
Al abrir el modal de nueva cita, `fetchMedicoSugerido()` consulta `GET /api/medicos?limite=1` y muestra la tarjeta del primer médico como un botón clickeable debajo del campo. Un clic autocompleta el campo sin que el usuario tenga que recordar el código.

### 3. Historial inline desde tabla de citas
El badge de estado "Finalizada" es interactivo. Al hacer clic, se abre un modal de historial. Si la cita no tiene historial registrado, el modal muestra directamente un formulario para crearlo sin necesidad de cambiar de módulo. Al registrar, el modal se actualiza automáticamente mostrando el historial recién creado.

### 4. Menú de acciones con posición fixed
El botón "⋮" calcula su posición en el viewport con `getBoundingClientRect()` y el menú se posiciona con `position: fixed`. Esto evita que el menú quede recortado por el `overflow: hidden` o `overflow-x: auto` de la tabla.

### 5. Tecla Enter activa búsqueda
Tanto en `dataTable.tsx` (búsqueda por ID/documento) como en `historialPaciente.tsx` (búsqueda por documento), el evento `onKeyDown` detecta `e.key === 'Enter'` y dispara la búsqueda sin necesidad de hacer clic en el botón. Complementa el submit del formulario para mayor consistencia.

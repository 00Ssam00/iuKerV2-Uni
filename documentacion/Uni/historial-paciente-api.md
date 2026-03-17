# API — Historial del Paciente

Módulo que permite registrar el diagnóstico de una cita médica finalizada y consultar el historial clínico de un paciente.

**Base URL:** `http://localhost:3001/api`

---

## Reglas de negocio

- Solo se puede registrar historial para citas en estado **Finalizada**.
- Cada cita puede tener **como máximo un historial** (relación 1:1).
- El campo `descripcion` es **opcional**.
- El campo `fechaRegistro` lo asigna automáticamente la base de datos.

---

## Endpoints

### 1. Registrar historial

Registra el diagnóstico de una cita médica finalizada.

```
POST /api/historial-paciente
Content-Type: application/json
```

#### Body

| Campo        | Tipo   | Requerido | Restricciones                     |
|--------------|--------|-----------|-----------------------------------|
| idCita       | string | Sí        | UUID válido                       |
| diagnostico  | string | Sí        | Mínimo 5, máximo 500 caracteres   |
| descripcion  | string | No        | Máximo 1000 caracteres            |

**Con descripción:**
```json
{
  "idCita": "f9ad42c5-877c-4841-ab95-9d19f7684dd4",
  "diagnostico": "Hipertensión arterial grado 1",
  "descripcion": "Paciente presenta valores de presión elevados de forma sostenida"
}
```

**Sin descripción:**
```json
{
  "idCita": "f9ad42c5-877c-4841-ab95-9d19f7684dd4",
  "diagnostico": "Hipertensión arterial grado 1"
}
```

#### Respuestas

**201 Created — Historial registrado exitosamente**
```json
{
  "mensaje": "Historial registrado correctamente",
  "historialRegistrado": {
    "idHistorial": "a1b2c3d4-0000-0000-0000-000000000001",
    "idCita": "f9ad42c5-877c-4841-ab95-9d19f7684dd4",
    "paciente": "Ana García",
    "medico": "Carlos Pérez",
    "fecha": "2026-03-10",
    "diagnostico": "Hipertensión arterial grado 1",
    "descripcion": "Paciente presenta valores de presión elevados de forma sostenida",
    "fechaRegistro": "2026-03-16T14:30:00.000Z"
  }
}
```

**400 Bad Request — idCita no es UUID válido**
```json
{
  "mensaje": "Error de validación en la petición. Revise los parámetros enviados.",
  "error": "El idCita debe ser un UUID válido",
  "detalles": [
    {
      "ruta": "idCita",
      "mensaje": "El idCita debe ser un UUID válido"
    }
  ]
}
```

**400 Bad Request — diagnostico vacío o muy corto**
```json
{
  "mensaje": "Error de validación en la petición. Revise los parámetros enviados.",
  "error": "El diagnóstico debe tener al menos 5 caracteres",
  "detalles": [
    {
      "ruta": "diagnostico",
      "mensaje": "El diagnóstico debe tener al menos 5 caracteres"
    }
  ]
}
```

**404 Not Found — La cita no existe**
```json
{
  "codigoInterno": "CITA001",
  "mensaje": "La cita solicita no existe en el sistema"
}
```

**409 Conflict — La cita no está finalizada**
```json
{
  "codigoInterno": "HIST002",
  "mensaje": "Solo se puede registrar historial para citas en estado Finalizada"
}
```

**409 Conflict — Ya existe historial para esa cita**
```json
{
  "codigoInterno": "HIST003",
  "mensaje": "Ya existe un historial registrado para esta cita"
}
```

---

### 2. Obtener historial por cita

Retorna el historial registrado para una cita específica.

```
GET /api/historial-paciente/cita/:idCita
```

#### Parámetros de ruta

| Parámetro | Tipo   | Descripción          |
|-----------|--------|----------------------|
| idCita    | string | UUID de la cita      |

**Ejemplo:**
```
GET /api/historial-paciente/cita/f9ad42c5-877c-4841-ab95-9d19f7684dd4
```

#### Respuestas

**200 OK — Historial encontrado**
```json
{
  "mensaje": "Historial encontrado",
  "historial": {
    "idHistorial": "a1b2c3d4-0000-0000-0000-000000000001",
    "idCita": "f9ad42c5-877c-4841-ab95-9d19f7684dd4",
    "paciente": "Ana García",
    "medico": "Carlos Pérez",
    "fecha": "2026-03-10",
    "diagnostico": "Hipertensión arterial grado 1",
    "descripcion": "Paciente presenta valores de presión elevados de forma sostenida",
    "fechaRegistro": "2026-03-16T14:30:00.000Z"
  }
}
```

**404 Not Found — No existe historial para esa cita**
```json
{
  "codigoInterno": "HIST001",
  "mensaje": "El historial solicitado no existe en el sistema"
}
```

---

### 3. Obtener historial por paciente

Retorna todos los historiales registrados de un paciente, ordenados de más reciente a más antiguo.

```
GET /api/historial-paciente/paciente/:numeroDoc
```

#### Parámetros de ruta

| Parámetro  | Tipo   | Descripción                    |
|------------|--------|--------------------------------|
| numeroDoc  | string | Número de documento del paciente |

**Ejemplo:**
```
GET /api/historial-paciente/paciente/1234567890
```

#### Respuestas

**200 OK — Con historiales**
```json
{
  "cantidadRegistros": 2,
  "historial": [
    {
      "idHistorial": "a1b2c3d4-0000-0000-0000-000000000002",
      "idCita": "aaaabbbb-0000-0000-0000-000000000001",
      "paciente": "Ana García",
      "medico": "Carlos Pérez",
      "fecha": "2026-03-10",
      "diagnostico": "Hipertensión arterial grado 1",
      "descripcion": null,
      "fechaRegistro": "2026-03-16T14:30:00.000Z"
    },
    {
      "idHistorial": "a1b2c3d4-0000-0000-0000-000000000001",
      "idCita": "aaaabbbb-0000-0000-0000-000000000002",
      "paciente": "Ana García",
      "medico": "Luis Ramírez",
      "fecha": "2026-01-15",
      "diagnostico": "Gastritis crónica",
      "descripcion": "Se recomienda dieta blanda y evitar irritantes",
      "fechaRegistro": "2026-01-15T09:00:00.000Z"
    }
  ]
}
```

**200 OK — Paciente sin historiales**
```json
{
  "cantidadRegistros": 0,
  "historial": []
}
```

---

## Flujo de uso completo

```
1. GET  /api/citas-medicas                              → buscar una cita con estadoCita "Finalizada"
2. POST /api/citas-medicas/finalizacion/:idCita         → (si no hay) finalizar una cita
3. POST /api/historial-paciente                         → registrar diagnóstico
4. GET  /api/historial-paciente/cita/:idCita            → verificar el historial creado
5. GET  /api/historial-paciente/paciente/:numeroDoc     → ver historial completo del paciente
```

---

## Códigos de error del módulo

| Código   | HTTP | Descripción                                          |
|----------|------|------------------------------------------------------|
| CITA001  | 404  | La cita no existe                                    |
| HIST001  | 404  | El historial no existe                               |
| HIST002  | 409  | La cita no está en estado Finalizada                 |
| HIST003  | 409  | Ya existe un historial registrado para esta cita     |

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP SCHEMA IF EXISTS iuker CASCADE;
CREATE SCHEMA iuker;
SET search_path TO iuker;

CREATE TABLE IF NOT EXISTS tipo_documentos(
  id_documento INT PRIMARY KEY,
  descripcion VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS estados(
	id_estado INT PRIMARY KEY,
	descripcion VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS pacientes (
  tipo_doc INT NOT NULL REFERENCES tipo_documentos (id_documento),
  numero_doc VARCHAR(15) NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  sexo CHAR(1) NOT NULL,
  email VARCHAR(200) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  direccion VARCHAR(100) NOT NULL,

  PRIMARY KEY (tipo_doc, numero_doc)
);

CREATE TABLE IF NOT EXISTS medicos (
  tarjeta_profesional VARCHAR(15) PRIMARY KEY,
  tipo_doc INT NOT NULL REFERENCES tipo_documentos (id_documento),
  numero_doc VARCHAR(15) NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  sexo CHAR(1) NOT NULL,
  especialidad VARCHAR(50) NOT NULL,
  email VARCHAR(200) NOT NULL,
  telefono VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS consultorios (
  id_consultorio VARCHAR(5) PRIMARY KEY,
  ubicacion VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS asignacion_medicos (
  id_asignacion  SERIAL PRIMARY KEY,
  tarjeta_profesional_medico VARCHAR(15) NOT NULL REFERENCES medicos (tarjeta_profesional),
  id_consultorio VARCHAR(5) NOT NULL REFERENCES consultorios (id_consultorio),
  dia_semana INT NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),
  inicio_jornada TIME NOT NULL,
  fin_jornada TIME NOT NULL,
  UNIQUE (tarjeta_profesional_medico, id_consultorio, dia_semana, inicio_jornada, fin_jornada)
);

CREATE TABLE IF NOT EXISTS citas_medicas (
  id_cita UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
  medico VARCHAR(15) NOT NULL REFERENCES medicos (tarjeta_profesional),
  tipo_doc_paciente INT NOT NULL,
  numero_doc_paciente VARCHAR(15) NOT NULL,
  fecha DATE NOT NULL,
  duracion INTERVAL NOT NULL DEFAULT INTERVAL '30 minutes',
  hora_inicio TIME NOT NULL,
  hora_fin TIME GENERATED ALWAYS AS (hora_inicio + duracion) STORED,
  estado INT NOT NULL REFERENCES estados(id_estado),
  id_cita_anterior UUID REFERENCES citas_medicas (id_cita),
  FOREIGN KEY (tipo_doc_paciente, numero_doc_paciente) REFERENCES pacientes(tipo_doc, numero_doc)
);

ALTER DATABASE iukerdb SET search_path TO iuker;
-- ==============================================================
-- INSERCIÓN DE DATOS
-- ==============================================================

-- TIPOS DE DOCUMENTO
INSERT INTO tipo_documentos (id_documento, descripcion) VALUES
(1, 'Cédula'),
(2, 'Tarjeta Identidad'),
(3, 'Cédula Extranjería'),
(4, 'Pasaporte');

-- ESTADOS GENERALES
INSERT INTO estados (id_estado, descripcion) VALUES
(1, 'Activa'),
(2, 'Actualizada'),
(3, 'Reprogramada'),
(4, 'Finalizada'),
(5, 'Cancelada');

-- PACIENTES
INSERT INTO pacientes (tipo_doc, numero_doc, nombre, apellido, fecha_nacimiento, sexo, email, telefono, direccion)
VALUES
(1, '100001', 'Juan', 'Pérez', '1995-06-15', 'M', 'juan.perez@mail.com', '3001112233', 'Cra 45 #12-30'),
(3, '100002', 'Laura', 'Gómez', '1992-04-20', 'F', 'laura.gomez@mail.com', '3012223344', 'Cll 80 #45-10'),
(2, '100003', 'Andrés', 'Ramírez', '1988-10-05', 'M', 'andres.ramirez@mail.com', '3023334455', 'Av 30 #9-22'),
(4, '100004', 'María', 'López', '2000-01-12', 'F', 'maria.lopez@mail.com', '3044445566', 'Cll 10 #50-60');

-- MÉDICOS
INSERT INTO medicos (tarjeta_profesional, tipo_doc, numero_doc, nombre, apellido, fecha_nacimiento, sexo, especialidad, email, telefono)
VALUES
('MP001', 1, '900001', 'Carlos', 'Rodríguez', '1980-03-12', 'M', 'Medicina General', 'carlos.rodriguez@clinicaiuker.com', '3105556677'),
('MP002', 1, '900002', 'Sofía', 'Martínez', '1985-11-23', 'F', 'Pediatría', 'sofia.martinez@clinicaiuker.com', '3116667788'),
('MP003', 1, '900003', 'Julián', 'García', '1978-09-08', 'M', 'Cardiología', 'julian.garcia@clinicaiuker.com', '3127778899'),
('MP004', 1, '900004', 'Valentina', 'Ruiz', '1990-02-17', 'F', 'Dermatología', 'valentina.ruiz@clinicaiuker.com', '3138889900');

-- CONSULTORIOS
INSERT INTO consultorios (id_consultorio, ubicacion)
VALUES
('C101', 'Edificio E, Piso 3'),
('C102', 'Edificio A, Piso 5'),
('C201', 'Edificio D, Piso 2'),
('C202', 'Edificio B, Piso 6');


INSERT INTO asignacion_medicos (tarjeta_profesional_medico, dia_semana, inicio_jornada, fin_jornada, id_consultorio)
VALUES
('MP001', 2, '08:00', '12:00', 'C101'),
('MP001', 2, '14:00', '20:00', 'C101'),
('MP002', 2, '08:00', '12:00', 'C102'),
('MP001', 4, '14:00', '18:00', 'C101'),
('MP003', 5, '10:00', '16:00', 'C202'),
('MP004', 6, '14:00', '20:00', 'C201');

-- CITAS MÉDICAS
INSERT INTO citas_medicas (medico, tipo_doc_paciente, numero_doc_paciente, fecha, hora_inicio, estado, id_cita_anterior)
VALUES
('MP001', 1, '100001', '2025-11-25', '08:00', 1, NULL),
('MP002', 3, '100002', '2025-11-25', '09:00', 1, NULL),
('MP003', 2, '100003', '2025-11-28', '10:30', 1, NULL),
('MP004', 4, '100004', '2025-11-29', '14:00', 1, NULL);

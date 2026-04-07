-- ==============================================================
-- SCRIPT SQL PARA AGREGAR MÁS DATOS DE PRUEBA
-- Ejecuta este script en tu BD para poblar con datos de ejemplo
-- ==============================================================

-- ASEGURAR QUE EXISTAN TIPOS DE DOCUMENTO Y ESTADOS
INSERT INTO tipo_documentos (id_documento, descripcion) VALUES
(1, 'Cédula'),
(2, 'Tarjeta Identidad'),
(3, 'Cédula Extranjería'),
(4, 'Pasaporte')
ON CONFLICT DO NOTHING;

INSERT INTO estados (id_estado, descripcion) VALUES
(1, 'Activa'),
(2, 'Actualizada'),
(3, 'Reprogramada'),
(4, 'Finalizada'),
(5, 'Cancelada')
ON CONFLICT DO NOTHING;

-- NUEVOS PACIENTES (6 más)
INSERT INTO pacientes (tipo_doc, numero_doc, nombre, apellido, fecha_nacimiento, sexo, email, telefono, direccion)
VALUES
(1, '100013', 'Sebastián', 'Morales', '1997-04-11', 'M', 'sebastian.morales@mail.com', '3133334455', 'Cra 52 #89-100'),
(2, '100014', 'Miranda', 'Castillo', '1999-06-08', 'F', 'miranda.castillo@mail.com', '3144445566', 'Av 45 #23-34'),
(3, '100015', 'Cristóbal', 'Rivas', '1993-12-16', 'M', 'cristobal.rivas@mail.com', '3155556677', 'Cll 72 #11-22'),
(1, '100016', 'Elvira', 'Mendoza', '2000-08-30', 'F', 'elvira.mendoza@mail.com', '3166667788', 'Tr 60 #44-55'),
(4, '100017', 'Cornelio', 'Prado', '1986-05-21', 'M', 'cornelio.prado@mail.com', '3177778899', 'Av 87 #56-78'),
(1, '100018', 'Norma', 'Silva', '1995-09-14', 'F', 'norma.silva@mail.com', '3188889900', 'Cra 33 #67-89')
ON CONFLICT DO NOTHING;

-- NUEVOS MÉDICOS (4 más)
INSERT INTO medicos (tarjeta_profesional, tipo_doc, numero_doc, nombre, apellido, fecha_nacimiento, sexo, especialidad, email, telefono)
VALUES
('MP009', 1, '900009', 'Emilio', 'Vargas', '1981-06-25', 'M', 'Psiquiatría', 'emilio.vargas@clinicaiuker.com', '3199990011'),
('MP010', 1, '900010', 'Rocío', 'Benítez', '1993-03-09', 'F', 'Endocrinología', 'rocio.benitez@clinicaiuker.com', '3200001122'),
('MP011', 1, '900011', 'Héctor', 'Ramos', '1984-10-28', 'M', 'Neumología', 'hector.ramos@clinicaiuker.com', '3211112233'),
('MP012', 1, '900012', 'Mariana', 'Toledo', '1989-07-12', 'F', 'Gastroenterología', 'mariana.toledo@clinicaiuker.com', '3222223344')
ON CONFLICT DO NOTHING;

-- NUEVOS CONSULTORIOS (4 más)
INSERT INTO consultorios (id_consultorio, ubicacion)
VALUES
('C403', 'Edificio I, Piso 2, Ala Este'),
('C404', 'Edificio J, Piso 8, Ala Sur'),
('C501', 'Edificio K, Piso 1, Ala Centro'),
('C502', 'Edificio L, Piso 4, Ala Norte')
ON CONFLICT DO NOTHING;

-- NUEVAS ASIGNACIONES
INSERT INTO asignacion_medicos (tarjeta_profesional_medico, dia_semana, inicio_jornada, fin_jornada, id_consultorio)
VALUES
('MP009', 1, '14:00', '20:00', 'C403'),
('MP009', 4, '14:00', '20:00', 'C403'),
('MP010', 2, '08:00', '14:00', 'C404'),
('MP010', 5, '08:00', '14:00', 'C404'),
('MP011', 3, '10:00', '16:00', 'C501'),
('MP011', 6, '10:00', '16:00', 'C501'),
('MP012', 1, '08:00', '14:00', 'C502'),
('MP012', 5, '14:00', '20:00', 'C502')
ON CONFLICT DO NOTHING;

-- CITAS ACTIVAS - NUEVAS
INSERT INTO citas_medicas (medico, tipo_doc_paciente, numero_doc_paciente, fecha, hora_inicio, estado, id_cita_anterior)
VALUES
('MP009', 1, '100013', '2025-12-24', '15:00', 1, NULL),
('MP010', 2, '100014', '2025-12-25', '09:00', 1, NULL),
('MP011', 3, '100015', '2025-12-26', '11:30', 1, NULL),
('MP012', 1, '100016', '2025-12-27', '13:00', 1, NULL),
('MP001', 4, '100017', '2025-12-28', '10:00', 1, NULL),
('MP002', 1, '100018', '2025-12-29', '16:30', 1, NULL)
ON CONFLICT DO NOTHING;

-- CITAS FINALIZADAS - NUEVAS (para ver más historiales)
INSERT INTO citas_medicas (medico, tipo_doc_paciente, numero_doc_paciente, fecha, hora_inicio, estado, id_cita_anterior)
VALUES
('MP009', 1, '100013', '2025-10-20', '15:00', 4, NULL),
('MP010', 2, '100014', '2025-10-22', '09:00', 4, NULL),
('MP011', 3, '100015', '2025-10-25', '11:30', 4, NULL),
('MP012', 1, '100016', '2025-10-15', '13:00', 4, NULL),
('MP001', 4, '100017', '2025-10-18', '10:00', 4, NULL),
('MP002', 1, '100018', '2025-10-21', '16:30', 4, NULL)
ON CONFLICT DO NOTHING;

-- NUEVOS HISTORIALES
INSERT INTO historial_paciente (id_cita, diagnostico, descripcion, fecha_registro)
VALUES
-- Cita finalizada: MP009 con Paciente 100013
((SELECT id_cita FROM citas_medicas WHERE medico='MP009' AND numero_doc_paciente='100013' AND fecha='2025-10-20' LIMIT 1), 'Ansiedad generalizada', 'Paciente presenta síntomas de ansiedad con insomnio desde hace 3 meses. Se inició terapia con Sertralina 50mg diarios. Se recomienda terapia psicológica complementaria.', NOW()),

-- Cita finalizada: MP010 con Paciente 100014
((SELECT id_cita FROM citas_medicas WHERE medico='MP010' AND numero_doc_paciente='100014' AND fecha='2025-10-22' LIMIT 1), 'Diabetes tipo 2', 'Glucosa en ayunas: 145 mg/dL. HbA1c: 7.2%. Se inició Metformina 500mg dos veces al día. Dieta y ejercicio son fundamentales.', NOW()),

-- Cita finalizada: MP011 con Paciente 100015
((SELECT id_cita FROM citas_medicas WHERE medico='MP011' AND numero_doc_paciente='100015' AND fecha='2025-10-25' LIMIT 1), 'Asma leve persistente', 'Paciente con silbancia frecuente por las noches. Se prescribió Salbutamol inhalador de rescate y Fluticasona como mantenimiento. Plan de acción asma entregado.', NOW()),

-- Cita finalizada: MP012 con Paciente 100016
((SELECT id_cita FROM citas_medicas WHERE medico='MP012' AND numero_doc_paciente='100016' AND fecha='2025-10-15' LIMIT 1), 'Gastritis crónica', 'Dolor epigástrico recurrente. Endoscopia muestra inflamación gástrica. Test de H. pylori positivo. Se inició triple terapia: Omeprazol, Amoxicilina y Claritromicina.', NOW()),

-- Cita finalizada: MP001 con Paciente 100017
((SELECT id_cita FROM citas_medicas WHERE medico='MP001' AND numero_doc_paciente='100017' AND fecha='2025-10-18' LIMIT 1), 'Dislipidemia mixta', 'Colesterol total 320, Triglicéridos 280. Se prescribió Rosuvastatina 10mg diarios y Fenofibrato 145mg. Se reforzó importancia de dieta.', NOW()),

-- Cita finalizada: MP002 con Paciente 100018
((SELECT id_cita FROM citas_medicas WHERE medico='MP002' AND numero_doc_paciente='100018' AND fecha='2025-10-21' LIMIT 1), 'Alergia estacional', 'Rinitis alérgica por polen. Se prescribió Loratadina 10mg al acostarse. Uso de spray nasal con corticoides según síntomas. Se derivó a alergía.', NOW());

-- Mostrar resumen de datos insertados
SELECT 'Total de Pacientes:' as tipo, COUNT(*) as cantidad FROM pacientes
UNION ALL
SELECT 'Total de Médicos', COUNT(*) FROM medicos
UNION ALL
SELECT 'Total de Consultorios', COUNT(*) FROM consultorios
UNION ALL
SELECT 'Total de Citas', COUNT(*) FROM citas_medicas
UNION ALL
SELECT 'Total de Historiales', COUNT(*) FROM historial_paciente;

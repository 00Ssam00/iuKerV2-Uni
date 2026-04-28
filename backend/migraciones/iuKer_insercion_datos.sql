-- ==============================================================
-- INSERCIÓN DE DATOS COMPLETA - VERSIÓN 2026
-- Con fechas actuales (Abril 2026) y distintos estados de citas
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

-- ========================
-- PACIENTES (30 PACIENTES)
-- ========================
INSERT INTO pacientes (tipo_doc, numero_doc, nombre, apellido, fecha_nacimiento, sexo, email, telefono, direccion)
VALUES
(1, '100001', 'Juan', 'Pérez', '1995-06-15', 'M', 'juan.perez@mail.com', '3001112233', 'Cra 45 #12-30'),
(3, '100002', 'Laura', 'Gómez', '1992-04-20', 'F', 'laura.gomez@mail.com', '3012223344', 'Cll 80 #45-10'),
(2, '100003', 'Andrés', 'Ramírez', '1988-10-05', 'M', 'andres.ramirez@mail.com', '3023334455', 'Av 30 #9-22'),
(4, '100004', 'María', 'López', '2000-01-12', 'F', 'maria.lopez@mail.com', '3044445566', 'Cll 10 #50-60'),
(1, '100005', 'Diego', 'Martínez', '1998-07-22', 'M', 'diego.martinez@mail.com', '3055556677', 'Tv 15 #66-80'),
(1, '100006', 'Catalina', 'Sánchez', '1994-03-18', 'F', 'catalina.sanchez@mail.com', '3066667788', 'Cra 70 #23-45'),
(2, '100007', 'Roberto', 'Fernández', '1987-11-30', 'M', 'roberto.fernandez@mail.com', '3077778899', 'Av 19 #100-120'),
(3, '100008', 'Isabela', 'Guzmán', '2001-05-14', 'F', 'isabela.guzman@mail.com', '3088889900', 'Cll 50 #35-55'),
(1, '100009', 'Felipe', 'Cruz', '1993-09-28', 'M', 'felipe.cruz@mail.com', '3099990011', 'Cra 87 #45-67'),
(4, '100010', 'Gabriela', 'Herrera', '1996-12-05', 'F', 'gabriela.herrera@mail.com', '3100001122', 'Av 68 #12-34'),
(2, '100011', 'Marcos', 'Salazar', '1989-02-17', 'M', 'marcos.salazar@mail.com', '3111112233', 'Cll 5 #78-90'),
(1, '100012', 'Verónica', 'Acosta', '1991-08-09', 'F', 'veronica.acosta@mail.com', '3122223344', 'Tr 90 #11-33'),
(1, '100013', 'Sebastián', 'Morales', '1997-04-11', 'M', 'sebastian.morales@mail.com', '3133334455', 'Cra 52 #89-100'),
(2, '100014', 'Miranda', 'Castillo', '1999-06-08', 'F', 'miranda.castillo@mail.com', '3144445566', 'Av 45 #23-34'),
(3, '100015', 'Cristóbal', 'Rivas', '1993-12-16', 'M', 'cristobal.rivas@mail.com', '3155556677', 'Cll 72 #11-22'),
(1, '100016', 'Elvira', 'Mendoza', '2000-08-30', 'F', 'elvira.mendoza@mail.com', '3166667788', 'Tr 60 #44-55'),
(4, '100017', 'Cornelio', 'Prado', '1986-05-21', 'M', 'cornelio.prado@mail.com', '3177778899', 'Av 87 #56-78'),
(1, '100018', 'Norma', 'Silva', '1995-09-14', 'F', 'norma.silva@mail.com', '3188889900', 'Cra 33 #67-89'),
(1, '100019', 'Ricardo', 'Vega', '1990-03-03', 'M', 'ricardo.vega@mail.com', '3199990011', 'Cll 25 #12-45'),
(2, '100020', 'Damaris', 'Ríos', '1998-11-11', 'F', 'damaris.rios@mail.com', '3200001122', 'Av 73 #89-100'),
(1, '100021', 'Gustavo', 'Campos', '1992-05-05', 'M', 'gustavo.campos@mail.com', '3211112233', 'Cra 15 #23-34'),
(3, '100022', 'Elisa', 'Torres', '1994-08-19', 'F', 'elisa.torres@mail.com', '3222223344', 'Cll 88 #56-67'),
(1, '100023', 'Víctor', 'Navarro', '1996-01-25', 'M', 'victor.navarro@mail.com', '3233334455', 'Tv 50 #11-22'),
(2, '100024', 'Roxana', 'Molina', '1991-07-14', 'F', 'roxana.molina@mail.com', '3244445566', 'Av 80 #33-44'),
(4, '100025', 'Óscar', 'Peña', '1995-10-10', 'M', 'oscar.pena@mail.com', '3255556677', 'Cll 40 #55-66'),
(1, '100026', 'Liliana', 'Romero', '1993-03-30', 'F', 'liliana.romero@mail.com', '3266667788', 'Cra 65 #77-88'),
(2, '100027', 'Arturo', 'Serrano', '1997-12-12', 'M', 'arturo.serrano@mail.com', '3277778899', 'Av 22 #44-55'),
(1, '100028', 'Susana', 'Valdez', '1989-06-06', 'F', 'susana.valdez@mail.com', '3288889900', 'Cll 99 #12-23'),
(3, '100029', 'Fernando', 'Vargas', '1994-04-04', 'M', 'fernando.vargas@mail.com', '3299990011', 'Tr 30 #67-78'),
(1, '100030', 'Tatiana', 'Zambrano', '1996-09-09', 'F', 'tatiana.zambrano@mail.com', '3210001122', 'Cra 60 #34-45');

-- ========================
-- MÉDICOS (16 MÉDICOS)
-- ========================
INSERT INTO medicos (tarjeta_profesional, tipo_doc, numero_doc, nombre, apellido, fecha_nacimiento, sexo, especialidad, email, telefono)
VALUES
('MP001', 1, '900001', 'Carlos', 'Rodríguez', '1980-03-12', 'M', 'Medicina General', 'carlos.rodriguez@clinicaiuker.com', '3105556677'),
('MP002', 1, '900002', 'Sofía', 'Martínez', '1985-11-23', 'F', 'Pediatría', 'sofia.martinez@clinicaiuker.com', '3116667788'),
('MP003', 1, '900003', 'Julián', 'García', '1978-09-08', 'M', 'Cardiología', 'julian.garcia@clinicaiuker.com', '3127778899'),
('MP004', 1, '900004', 'Valentina', 'Ruiz', '1990-02-17', 'F', 'Dermatología', 'valentina.ruiz@clinicaiuker.com', '3138889900'),
('MP005', 1, '900005', 'Alejandro', 'Flores', '1982-07-14', 'M', 'Ortopedia', 'alejandro.flores@clinicaiuker.com', '3149990011'),
('MP006', 1, '900006', 'Daniela', 'Vásquez', '1986-01-25', 'F', 'Oftalmología', 'daniela.vasquez@clinicaiuker.com', '3150001122'),
('MP007', 1, '900007', 'Gustavo', 'Moreno', '1979-10-03', 'M', 'Neurología', 'gustavo.moreno@clinicaiuker.com', '3161112233'),
('MP008', 1, '900008', 'Patricia', 'Castillo', '1988-04-19', 'F', 'Oncología', 'patricia.castillo@clinicaiuker.com', '3172223344'),
('MP009', 1, '900009', 'Emilio', 'Vargas', '1981-06-25', 'M', 'Psiquiatría', 'emilio.vargas@clinicaiuker.com', '3183334455'),
('MP010', 1, '900010', 'Rocío', 'Benítez', '1993-03-09', 'F', 'Endocrinología', 'rocio.benitez@clinicaiuker.com', '3194445566'),
('MP011', 1, '900011', 'Héctor', 'Ramos', '1984-10-28', 'M', 'Neumología', 'hector.ramos@clinicaiuker.com', '3205556677'),
('MP012', 1, '900012', 'Mariana', 'Toledo', '1989-07-12', 'F', 'Gastroenterología', 'mariana.toledo@clinicaiuker.com', '3216667788'),
('MP013', 1, '900013', 'Eduardo', 'Jiménez', '1987-02-14', 'M', 'Urología', 'eduardo.jimenez@clinicaiuker.com', '3227778899'),
('MP014', 1, '900014', 'Francisca', 'Silva', '1992-09-22', 'F', 'Ginecología', 'francisca.silva@clinicaiuker.com', '3238889900'),
('MP015', 1, '900015', 'Raúl', 'Medina', '1981-11-11', 'M', 'Reumatología', 'raul.medina@clinicaiuker.com', '3249990011'),
('MP016', 1, '900016', 'Lorena', 'Ponce', '1988-12-30', 'F', 'Hematología', 'lorena.ponce@clinicaiuker.com', '3250001122');

-- ========================
-- CONSULTORIOS (12 CONSULTORIOS)
-- ========================
INSERT INTO consultorios (id_consultorio, ubicacion)
VALUES
('C101', 'Edificio A, Piso 1, Ala Este'),
('C102', 'Edificio A, Piso 1, Ala Oeste'),
('C201', 'Edificio A, Piso 2, Ala Centro'),
('C202', 'Edificio A, Piso 2, Ala Sur'),
('C301', 'Edificio B, Piso 3, Ala Este'),
('C302', 'Edificio B, Piso 3, Ala Oeste'),
('C401', 'Edificio C, Piso 4, Ala Norte'),
('C402', 'Edificio C, Piso 4, Ala Sur'),
('C501', 'Edificio D, Piso 5, Ala Centro'),
('C502', 'Edificio D, Piso 5, Ala Este'),
('C601', 'Edificio E, Piso 6, Ala Oeste'),
('C602', 'Edificio E, Piso 6, Ala Norte');

-- ========================
-- ASIGNACIONES MÉDICOS (24 ASIGNACIONES)
-- ========================
INSERT INTO asignacion_medicos (tarjeta_profesional_medico, dia_semana, inicio_jornada, fin_jornada, id_consultorio)
VALUES
('MP001', 1, '08:00', '14:00', 'C101'),
('MP001', 3, '14:00', '20:00', 'C101'),
('MP001', 5, '08:00', '14:00', 'C102'),
('MP002', 2, '08:00', '12:00', 'C102'),
('MP002', 4, '14:00', '18:00', 'C102'),
('MP002', 6, '09:00', '15:00', 'C201'),
('MP003', 1, '10:00', '16:00', 'C202'),
('MP003', 3, '10:00', '16:00', 'C202'),
('MP003', 5, '13:00', '19:00', 'C202'),
('MP004', 2, '14:00', '20:00', 'C301'),
('MP004', 4, '14:00', '20:00', 'C301'),
('MP005', 1, '08:00', '14:00', 'C302'),
('MP005', 4, '14:00', '20:00', 'C302'),
('MP006', 2, '10:00', '16:00', 'C401'),
('MP006', 5, '10:00', '16:00', 'C401'),
('MP007', 3, '08:00', '14:00', 'C402'),
('MP007', 6, '14:00', '20:00', 'C402'),
('MP008', 2, '08:00', '14:00', 'C501'),
('MP008', 4, '14:00', '20:00', 'C501'),
('MP009', 1, '14:00', '20:00', 'C502'),
('MP009', 5, '14:00', '20:00', 'C502'),
('MP010', 3, '09:00', '15:00', 'C601'),
('MP011', 2, '10:00', '16:00', 'C602'),
('MP012', 4, '08:00', '14:00', 'C602');

-- ========================
-- CITAS MÉDICAS - FINALIZADAS (Enero-Febrero 2026)
-- ========================
INSERT INTO citas_medicas (medico, tipo_doc_paciente, numero_doc_paciente, fecha, hora_inicio, estado, id_cita_anterior, id_consultorio)
VALUES
-- Enero 2026
('MP001', 1, '100001', '2026-01-08', '08:30', 4, NULL, 'C101'),
('MP002', 3, '100002', '2026-01-09', '09:00', 4, NULL, 'C102'),
('MP003', 2, '100003', '2026-01-10', '10:30', 4, NULL, 'C202'),
('MP004', 4, '100004', '2026-01-13', '14:00', 4, NULL, 'C301'),
('MP005', 1, '100005', '2026-01-15', '11:00', 4, NULL, 'C302'),
('MP006', 1, '100006', '2026-01-16', '15:30', 4, NULL, 'C401'),
('MP007', 2, '100007', '2026-01-20', '09:30', 4, NULL, 'C402'),
('MP008', 3, '100008', '2026-01-21', '16:00', 4, NULL, 'C501'),
-- Febrero 2026
('MP009', 1, '100009', '2026-02-02', '13:00', 4, NULL, 'C502'),
('MP010', 4, '100010', '2026-02-05', '10:00', 4, NULL, 'C601'),
('MP011', 2, '100011', '2026-02-09', '14:30', 4, NULL, 'C602'),
('MP012', 1, '100012', '2026-02-11', '08:30', 4, NULL, 'C602'),
('MP001', 1, '100013', '2026-02-17', '09:00', 4, NULL, 'C101'),
('MP002', 2, '100014', '2026-02-19', '11:30', 4, NULL, 'C102'),
('MP003', 3, '100015', '2026-02-24', '13:00', 4, NULL, 'C202'),
('MP004', 1, '100016', '2026-02-26', '10:00', 4, NULL, 'C301');

-- ========================
-- CITAS MÉDICAS - CANCELADAS (Marzo 2026)
-- ========================
INSERT INTO citas_medicas (medico, tipo_doc_paciente, numero_doc_paciente, fecha, hora_inicio, estado, id_cita_anterior, id_consultorio)
VALUES
('MP005', 4, '100017', '2026-03-05', '14:00', 5, NULL, 'C302'),
('MP006', 1, '100018', '2026-03-08', '16:30', 5, NULL, 'C401'),
('MP007', 1, '100019', '2026-03-12', '11:00', 5, NULL, 'C402'),
('MP008', 2, '100020', '2026-03-15', '09:30', 5, NULL, 'C501');

-- ========================
-- CITAS MÉDICAS - REPROGRAMADAS (Marzo 2026)
-- ========================
INSERT INTO citas_medicas (medico, tipo_doc_paciente, numero_doc_paciente, fecha, hora_inicio, estado, id_cita_anterior, id_consultorio)
VALUES
('MP009', 1, '100021', '2026-03-18', '15:00', 3, NULL, 'C502'),
('MP010', 3, '100022', '2026-03-22', '10:30', 3, NULL, 'C601');

-- ========================
-- CITAS MÉDICAS - ACTIVAS/PRÓXIMAS (Abril-Junio 2026)
-- ========================
INSERT INTO citas_medicas (medico, tipo_doc_paciente, numero_doc_paciente, fecha, hora_inicio, estado, id_cita_anterior, id_consultorio)
VALUES
-- Abril 2026
('MP011', 1, '100023', '2026-04-09', '11:00', 1, NULL, 'C602'),
('MP012', 2, '100024', '2026-04-10', '14:00', 1, NULL, 'C602'),
('MP001', 4, '100025', '2026-04-12', '09:30', 1, NULL, 'C101'),
('MP002', 1, '100026', '2026-04-14', '15:30', 1, NULL, 'C102'),
('MP003', 2, '100027', '2026-04-16', '10:00', 1, NULL, 'C202'),
('MP004', 1, '100028', '2026-04-17', '13:00', 1, NULL, 'C301'),
('MP005', 3, '100029', '2026-04-19', '16:00', 1, NULL, 'C302'),
('MP006', 1, '100030', '2026-04-21', '11:30', 1, NULL, 'C401'),
-- Mayo 2026
('MP007', 1, '100001', '2026-05-05', '09:00', 1, NULL, 'C402'),
('MP008', 3, '100002', '2026-05-08', '14:30', 1, NULL, 'C501'),
('MP009', 2, '100003', '2026-05-12', '10:15', 1, NULL, 'C502'),
('MP010', 4, '100004', '2026-05-15', '15:00', 1, NULL, 'C601'),
('MP011', 1, '100005', '2026-05-18', '08:45', 1, NULL, 'C602'),
('MP012', 1, '100006', '2026-05-20', '11:00', 1, NULL, 'C602'),
-- Junio 2026
('MP001', 2, '100007', '2026-06-02', '13:30', 1, NULL, 'C101'),
('MP002', 3, '100008', '2026-06-05', '09:30', 1, NULL, 'C102'),
('MP003', 1, '100009', '2026-06-08', '16:00', 1, NULL, 'C202'),
('MP004', 4, '100010', '2026-06-10', '10:30', 1, NULL, 'C301'),
('MP005', 2, '100011', '2026-06-12', '14:00', 1, NULL, 'C302'),
('MP006', 1, '100012', '2026-06-15', '11:30', 1, NULL, 'C401');

-- ========================
-- HISTORIALES CLÍNICOS (16 historiales - Citas finalizadas)
-- ========================
INSERT INTO historial_paciente (id_cita, diagnostico, descripcion, fecha_registro)
VALUES
-- Enero
((SELECT id_cita FROM citas_medicas WHERE medico='MP001' AND numero_doc_paciente='100001' AND fecha='2026-01-08' LIMIT 1),
'Hipertensión arterial',
'Paciente presenta presión arterial elevada (150/95). Se recomendó dieta baja en sodio y ejercicio regular. Se prescribió Lisinopril 10mg diarios.', NOW()),

((SELECT id_cita FROM citas_medicas WHERE medico='MP002' AND numero_doc_paciente='100002' AND fecha='2026-01-09' LIMIT 1),
'Otitis media aguda',
'Paciente con dolor en oído derecho y fiebre. Se observó enrojecimiento de membrana timpánica. Se prescribió Amoxicilina 500mg cada 8 horas.', NOW()),

((SELECT id_cita FROM citas_medicas WHERE medico='MP003' AND numero_doc_paciente='100003' AND fecha='2026-01-10' LIMIT 1),
'Arritmia cardíaca',
'ECG muestra taquicardia sinusal. Paciente refiere palpitaciones frecuentes. Se recomienda reducir estrés y cafeína. Seguimiento con Holter.', NOW()),

((SELECT id_cita FROM citas_medicas WHERE medico='MP004' AND numero_doc_paciente='100004' AND fecha='2026-01-13' LIMIT 1),
'Dermatitis atópica',
'Lesiones pruriginosas en zona cervical y brazos. Se pautó crema hidratante y Hidrocortisona al 1%. Evitar irritantes.', NOW()),

((SELECT id_cita FROM citas_medicas WHERE medico='MP005' AND numero_doc_paciente='100005' AND fecha='2026-01-15' LIMIT 1),
'Esguince de tobillo grado II',
'Esguince lateral de tobillo derecho. Se recomendó inmovilización, hielo y elevación. Prescripción de Ibuprofeno 400mg cada 6 horas.', NOW()),

((SELECT id_cita FROM citas_medicas WHERE medico='MP006' AND numero_doc_paciente='100006' AND fecha='2026-01-16' LIMIT 1),
'Presbicia y astigmatismo',
'Paciente requiere gafas bifocales. Se realizó optometría completa. Graduación: +2.50 esf -0.75 cil eje 180.', NOW()),

((SELECT id_cita FROM citas_medicas WHERE medico='MP007' AND numero_doc_paciente='100007' AND fecha='2026-01-20' LIMIT 1),
'Migraña crónica',
'Cefalea hemicraneal con fotofobia y náuseas. Se prescribió Sumatriptán 50mg. Preventivo: Propranolol 40mg diarios.', NOW()),

((SELECT id_cita FROM citas_medicas WHERE medico='MP008' AND numero_doc_paciente='100008' AND fecha='2026-01-21' LIMIT 1),
'Control post-operatorio satisfactorio',
'Seguimiento favorable tras cirugía. Cicatrización adecuada. Se retiraron puntos sin complicaciones. Continuar cuidados locales.', NOW()),

-- Febrero
((SELECT id_cita FROM citas_medicas WHERE medico='MP009' AND numero_doc_paciente='100009' AND fecha='2026-02-02' LIMIT 1),
'Ansiedad generalizada',
'Paciente presenta síntomas de ansiedad con insomnio desde hace 2 meses. Se inició terapia con Sertralina 50mg diarios. Se recomienda terapia psicológica.', NOW()),

((SELECT id_cita FROM citas_medicas WHERE medico='MP010' AND numero_doc_paciente='100010' AND fecha='2026-02-05' LIMIT 1),
'Diabetes tipo 2',
'Glucosa en ayunas: 145 mg/dL. HbA1c: 7.2%. Se inició Metformina 500mg dos veces al día. Dieta y ejercicio son fundamentales.', NOW()),

((SELECT id_cita FROM citas_medicas WHERE medico='MP011' AND numero_doc_paciente='100011' AND fecha='2026-02-09' LIMIT 1),
'Asma leve persistente',
'Paciente con silbancia frecuente por las noches. Se prescribió Salbutamol inhalador de rescate y Fluticasona como mantenimiento.', NOW()),

((SELECT id_cita FROM citas_medicas WHERE medico='MP012' AND numero_doc_paciente='100012' AND fecha='2026-02-11' LIMIT 1),
'Gastritis crónica',
'Dolor epigástrico recurrente. Endoscopia muestra inflamación gástrica. Test de H. pylori positivo. Se inició triple terapia.', NOW()),

((SELECT id_cita FROM citas_medicas WHERE medico='MP001' AND numero_doc_paciente='100013' AND fecha='2026-02-17' LIMIT 1),
'Dislipidemia mixta',
'Colesterol total 320, Triglicéridos 280. Se prescribió Rosuvastatina 10mg y Fenofibrato 145mg. Se reforzó importancia de dieta.', NOW()),

((SELECT id_cita FROM citas_medicas WHERE medico='MP002' AND numero_doc_paciente='100014' AND fecha='2026-02-19' LIMIT 1),
'Alergia estacional',
'Rinitis alérgica por polen. Se prescribió Loratadina 10mg al acostarse. Uso de spray nasal con corticoides según síntomas.', NOW()),

((SELECT id_cita FROM citas_medicas WHERE medico='MP003' AND numero_doc_paciente='100015' AND fecha='2026-02-24' LIMIT 1),
'Cefalea tensional episódica',
'Paciente con cefalea no pulsátil, bilateral. Se prescribió Paracetamol 500mg y se recomienda técnicas de relajación.', NOW()),

((SELECT id_cita FROM citas_medicas WHERE medico='MP004' AND numero_doc_paciente='100016' AND fecha='2026-02-26' LIMIT 1),
'Acné juvenil moderado',
'Lesiones inflamatorias en cara y espalda. Se prescribió Adapaleno 0.1% nocturno y Peróxido de Benzoílo 5% en la mañana.', NOW());

-- Resumen de datos
SELECT 'Base de datos poblada exitosamente ✓' as resultado;
SELECT COUNT(*) as "Total Pacientes" FROM pacientes;
SELECT COUNT(*) as "Total Médicos" FROM medicos;
SELECT COUNT(*) as "Total Consultorios" FROM consultorios;
SELECT COUNT(*) as "Total Asignaciones" FROM asignacion_medicos;
SELECT COUNT(*) as "Total Citas" FROM citas_medicas;
SELECT COUNT(*) as "Total Historiales" FROM historial_paciente;

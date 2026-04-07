-- ==============================================================
-- INSERCIÓN DE DATOS - VERSIÓN COMPLETA CON CITAS FINALIZADAS
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

-- PACIENTES (Expandido a 12 pacientes)
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
(1, '100012', 'Verónica', 'Acosta', '1991-08-09', 'F', 'veronica.acosta@mail.com', '3122223344', 'Tr 90 #11-33');

-- MÉDICOS (Expandido a 8 médicos)
INSERT INTO medicos (tarjeta_profesional, tipo_doc, numero_doc, nombre, apellido, fecha_nacimiento, sexo, especialidad, email, telefono)
VALUES
('MP001', 1, '900001', 'Carlos', 'Rodríguez', '1980-03-12', 'M', 'Medicina General', 'carlos.rodriguez@clinicaiuker.com', '3105556677'),
('MP002', 1, '900002', 'Sofía', 'Martínez', '1985-11-23', 'F', 'Pediatría', 'sofia.martinez@clinicaiuker.com', '3116667788'),
('MP003', 1, '900003', 'Julián', 'García', '1978-09-08', 'M', 'Cardiología', 'julian.garcia@clinicaiuker.com', '3127778899'),
('MP004', 1, '900004', 'Valentina', 'Ruiz', '1990-02-17', 'F', 'Dermatología', 'valentina.ruiz@clinicaiuker.com', '3138889900'),
('MP005', 1, '900005', 'Alejandro', 'Flores', '1982-07-14', 'M', 'Ortopedia', 'alejandro.flores@clinicaiuker.com', '3149990011'),
('MP006', 1, '900006', 'Daniela', 'Vásquez', '1986-01-25', 'F', 'Oftalmología', 'daniela.vasquez@clinicaiuker.com', '3150001122'),
('MP007', 1, '900007', 'Gustavo', 'Moreno', '1979-10-03', 'M', 'Neurología', 'gustavo.moreno@clinicaiuker.com', '3161112233'),
('MP008', 1, '900008', 'Patricia', 'Castillo', '1988-04-19', 'F', 'Oncología', 'patricia.castillo@clinicaiuker.com', '3172223344');

-- CONSULTORIOS (Expandido a 8 consultorios)
INSERT INTO consultorios (id_consultorio, ubicacion)
VALUES
('C101', 'Edificio E, Piso 3, Ala Este'),
('C102', 'Edificio A, Piso 5, Ala Oeste'),
('C201', 'Edificio D, Piso 2, Ala Centro'),
('C202', 'Edificio B, Piso 6, Ala Sur'),
('C301', 'Edificio C, Piso 4, Ala Norte'),
('C302', 'Edificio F, Piso 1, Ala Este'),
('C401', 'Edificio G, Piso 7, Ala Oeste'),
('C402', 'Edificio H, Piso 3, Ala Centro');

-- ASIGNACIONES DE MÉDICOS A CONSULTORIOS (Expandido)
INSERT INTO asignacion_medicos (tarjeta_profesional_medico, dia_semana, inicio_jornada, fin_jornada, id_consultorio)
VALUES
('MP001', 1, '08:00', '14:00', 'C101'),
('MP001', 3, '14:00', '20:00', 'C101'),
('MP001', 5, '08:00', '14:00', 'C101'),
('MP002', 2, '08:00', '12:00', 'C102'),
('MP002', 4, '14:00', '18:00', 'C102'),
('MP003', 1, '10:00', '16:00', 'C202'),
('MP003', 3, '10:00', '16:00', 'C202'),
('MP004', 2, '14:00', '20:00', 'C201'),
('MP004', 5, '14:00', '20:00', 'C201'),
('MP005', 1, '08:00', '14:00', 'C301'),
('MP005', 4, '14:00', '20:00', 'C301'),
('MP006', 2, '10:00', '16:00', 'C302'),
('MP006', 5, '10:00', '16:00', 'C302'),
('MP007', 3, '08:00', '14:00', 'C401'),
('MP007', 6, '14:00', '20:00', 'C401'),
('MP008', 2, '08:00', '14:00', 'C402'),
('MP008', 4, '14:00', '20:00', 'C402');

-- CITAS MÉDICAS - CITAS ACTIVAS (futuras/próximas)
INSERT INTO citas_medicas (medico, tipo_doc_paciente, numero_doc_paciente, fecha, hora_inicio, estado, id_cita_anterior)
VALUES
('MP001', 1, '100001', '2025-12-15', '08:30', 1, NULL),
('MP002', 3, '100002', '2025-12-16', '09:00', 1, NULL),
('MP003', 2, '100003', '2025-12-17', '10:30', 1, NULL),
('MP004', 4, '100004', '2025-12-18', '14:00', 1, NULL),
('MP005', 1, '100005', '2025-12-19', '11:00', 1, NULL),
('MP006', 1, '100006', '2025-12-20', '15:00', 1, NULL),
('MP007', 2, '100007', '2025-12-22', '09:30', 1, NULL),
('MP008', 3, '100008', '2025-12-23', '16:00', 1, NULL);

-- CITAS MÉDICAS - CITAS FINALIZADAS (pasadas - para ver historiales)
INSERT INTO citas_medicas (medico, tipo_doc_paciente, numero_doc_paciente, fecha, hora_inicio, estado, id_cita_anterior)
VALUES
('MP001', 1, '100001', '2025-11-10', '08:00', 4, NULL),
('MP002', 3, '100002', '2025-11-12', '09:00', 4, NULL),
('MP003', 2, '100003', '2025-11-05', '10:30', 4, NULL),
('MP004', 4, '100004', '2025-11-08', '14:00', 4, NULL),
('MP001', 1, '100005', '2025-11-03', '11:00', 4, NULL),
('MP005', 1, '100006', '2025-11-07', '15:30', 4, NULL),
('MP006', 2, '100007', '2025-11-09', '09:30', 4, NULL),
('MP007', 3, '100008', '2025-11-11', '16:00', 4, NULL),
('MP008', 1, '100009', '2025-11-06', '13:00', 4, NULL),
('MP002', 4, '100010', '2025-11-04', '10:00', 4, NULL),
('MP003', 2, '100011', '2025-11-02', '14:30', 4, NULL),
('MP001', 1, '100012', '2025-11-01', '08:30', 4, NULL);

-- HISTORIALES CLÍNICOS (Para las citas finalizadas)
INSERT INTO historial_paciente (id_cita, diagnostico, descripcion, fecha_registro)
VALUES
-- Cita 1: MP001 con Paciente 100001
((SELECT id_cita FROM citas_medicas WHERE medico='MP001' AND numero_doc_paciente='100001' AND fecha='2025-11-10' LIMIT 1), 'Hipertensión arterial', 'Paciente presenta presión arterial elevada (150/95). Se recomendó dieta baja en sodio y ejercicio regular. Se prescribió Lisinopril 10mg diarios.', NOW()),

-- Cita 2: MP002 con Paciente 100002
((SELECT id_cita FROM citas_medicas WHERE medico='MP002' AND numero_doc_paciente='100002' AND fecha='2025-11-12' LIMIT 1), 'Otitis media aguda', 'Niña de 10 años con dolor en oído derecho y fiebre. Se observó enrojecimiento de membrana timpánica. Se prescribió Amoxicilina 500mg cada 8 horas.', NOW()),

-- Cita 3: MP003 con Paciente 100003
((SELECT id_cita FROM citas_medicas WHERE medico='MP003' AND numero_doc_paciente='100003' AND fecha='2025-11-05' LIMIT 1), 'Arritmia cardíaca', 'ECG muestra taquicardia sinusal. Paciente refiere palpitaciones frecuentes. Se recomienda reducir estrés, cafeína y realizar seguimiento con Holter.', NOW()),

-- Cita 4: MP004 con Paciente 100004
((SELECT id_cita FROM citas_medicas WHERE medico='MP004' AND numero_doc_paciente='100004' AND fecha='2025-11-08' LIMIT 1), 'Dermatitis atópica', 'Lesiones en zona cervical y brazos. Se pautó crema hidratante, vaselina y se prescribió Hidrocortisona al 1%.', NOW()),

-- Cita 5: MP001 con Paciente 100005
((SELECT id_cita FROM citas_medicas WHERE medico='MP001' AND numero_doc_paciente='100005' AND fecha='2025-11-03' LIMIT 1), 'Resfriado común', 'Síntomas de congestión nasal y tos leve. Se recomienda reposo, hidratación abundante y paracetamol según sea necesario.', NOW()),

-- Cita 6: MP005 con Paciente 100006
((SELECT id_cita FROM citas_medicas WHERE medico='MP005' AND numero_doc_paciente='100006' AND fecha='2025-11-07' LIMIT 1), 'Esguince de tobillo grado II', 'Esguince lateral de tobillo derecho. Se recomendó inmovilización con vendaje, hielo y elevación. Prescripción de Ibuprofeno 400mg cada 6 horas.', NOW()),

-- Cita 7: MP006 con Paciente 100007
((SELECT id_cita FROM citas_medicas WHERE medico='MP006' AND numero_doc_paciente='100007' AND fecha='2025-11-09' LIMIT 1), 'Presbicia y astigmatismo', 'Paciente requiere gafas bifocales. Se realizó optometría completa. Se prescribió graduación +2.50 esf -0.75 cil eje 180.', NOW()),

-- Cita 8: MP007 con Paciente 100008
((SELECT id_cita FROM citas_medicas WHERE medico='MP007' AND numero_doc_paciente='100008' AND fecha='2025-11-11' LIMIT 1), 'Migraña crónica', 'Cefalea hemicraneal con fotofobia y náuseas. Se prescribió Sumatriptán 50mg en caso de crisis. Preventivo: Propranolol 40mg diarios.', NOW()),

-- Cita 9: MP008 con Paciente 100009
((SELECT id_cita FROM citas_medicas WHERE medico='MP008' AND numero_doc_paciente='100009' AND fecha='2025-11-06' LIMIT 1), 'Control post-operatorio', 'Seguimiento favorable tras cirugía. Cicatrización adecuada. Se retiraron puntos sin complicaciones. Continuar cuidados locales durante 2 semanas.', NOW()),

-- Cita 10: MP002 con Paciente 100010
((SELECT id_cita FROM citas_medicas WHERE medico='MP002' AND numero_doc_paciente='100010' AND fecha='2025-11-04' LIMIT 1), 'Faringitis aguda', 'Dolor de garganta y dificultad para tragar. Se observó enrojecimiento de faringe. Rápida positiva. Se prescribió Penicilina 500mg cada 6 horas.', NOW()),

-- Cita 11: MP003 con Paciente 100011
((SELECT id_cita FROM citas_medicas WHERE medico='MP003' AND numero_doc_paciente='100011' AND fecha='2025-11-02' LIMIT 1), 'Colesterol elevado', 'Análisis muestra colesterol total 280 mg/dL. Se recomendó dieta baja en grasas saturadas y ejercicio. Se prescribió Atorvastatina 20mg.', NOW()),

-- Cita 12: MP001 con Paciente 100012
((SELECT id_cita FROM citas_medicas WHERE medico='MP001' AND numero_doc_paciente='100012' AND fecha='2025-11-01' LIMIT 1), 'Anemia leve', 'Hemoglobina 11.2 g/dL. Paciente refiere fatiga. Se prescribió Sulfato ferroso 325mg diarios y se recomienda dieta rica en hierro.', NOW());

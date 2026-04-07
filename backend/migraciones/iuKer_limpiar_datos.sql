-- ==============================================================
-- SCRIPT PARA LIMPIAR TODOS LOS DATOS DE LA BD
-- Mantiene la estructura de tablas intacta
-- ==============================================================

-- Limpiar datos preservando auto-increment sequences
TRUNCATE TABLE historial_paciente CASCADE;
TRUNCATE TABLE citas_medicas CASCADE;
TRUNCATE TABLE asignacion_medicos CASCADE;
TRUNCATE TABLE pacientes CASCADE;
TRUNCATE TABLE medicos CASCADE;
TRUNCATE TABLE consultorios CASCADE;
TRUNCATE TABLE estados CASCADE;
TRUNCATE TABLE tipo_documentos CASCADE;

-- Reiniciar las secuencias de IDs (opcional, solo si necesitas IDs desde 1)
-- ALTER SEQUENCE historial_paciente_id_historial_seq RESTART;
-- ALTER SEQUENCE citas_medicas_id_cita_seq RESTART;
-- ALTER SEQUENCE asignacion_medicos_id_asignacion_seq RESTART;

SELECT 'Base de datos limpiada exitosamente ✓' as resultado;

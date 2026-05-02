-- Permite actualizar tipo_doc en pacientes propagando el cambio a citas_medicas
ALTER TABLE citas_medicas
  DROP CONSTRAINT citas_medicas_tipo_doc_paciente_numero_doc_paciente_fkey;

ALTER TABLE citas_medicas
  ADD CONSTRAINT citas_medicas_tipo_doc_paciente_numero_doc_paciente_fkey
  FOREIGN KEY (tipo_doc_paciente, numero_doc_paciente)
  REFERENCES pacientes (tipo_doc, numero_doc)
  ON UPDATE CASCADE;

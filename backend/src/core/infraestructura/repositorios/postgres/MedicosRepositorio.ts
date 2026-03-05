import { IMedicosRepositorio } from '../../../dominio/medico/IMedicosRepositorio.js';
import { ejecutarConsulta } from './clientePostgres.js';
import { IMedico } from '../../../dominio/medico/IMedico.js';
import { camelCaseASnakeCase } from '../../../../common/camelCaseASnakeCase.js';
import { MedicoFila, mapFilaMedico } from './mappers/medico.mappers.js';
import { MedicoRepuestaDTO } from './dtos/MedicoRespuestaDTO.js';

export class MedicosRepositorio implements IMedicosRepositorio {
    async crearMedico(datosMedico : IMedico) : Promise <MedicoRepuestaDTO> {
        const keys = Object.keys(datosMedico);
        const snakeColumn = keys.map((k) => camelCaseASnakeCase(k));
        const parametros = keys.map((k) => (datosMedico as any) [k]);
        const placeholders = parametros.map((_,i) => `$${i+1}`).join(", ");

        const query = `
        INSERT INTO medicos (${snakeColumn.join(", ")})
        VALUES (${placeholders})
        RETURNING
        tarjeta_profesional AS "tarjetaProfesional",
        tipo_doc AS "tipoDoc",
        numero_doc AS "numeroDoc",
        nombre,
        apellido,
        fecha_nacimiento AS "fechaNacimiento",
        sexo,
        especialidad,
        email,
        telefono;
        `;

        const resultado = await ejecutarConsulta(query, parametros);
        const fila: MedicoFila = resultado.rows[0];
        const medico = mapFilaMedico(fila);
        return medico;
    };

    async listarMedicos(limite? : number) : Promise <MedicoRepuestaDTO[]> {
        let query =
        `SELECT m.tarjeta_profesional AS "tarjetaProfesional", tp.descripcion AS "tipoDoc", m.numero_doc AS "numeroDoc", m.nombre,
        m.apellido, m.fecha_nacimiento AS "fechaNacimiento", m.sexo, m.especialidad, m.email, m.telefono
        FROM medicos m
		LEFT JOIN tipo_documentos tp ON tp.id_documento = m.tipo_doc
        ORDER BY m.tarjeta_profesional ASC`;

        const valores : number[] = [];

        if(limite !== undefined){
            query += ' LIMIT $1';
            valores.push(limite);
        }

        const resultado = await ejecutarConsulta(query, valores);
        const filas: MedicoFila[] = resultado.rows;
        const medicos = filas.map(mapFilaMedico);
        return medicos;
    };

    async obtenerMedicoPorTarjetaProfesional(tarjetaProfesional: string) : Promise <MedicoRepuestaDTO | null> {
        const query = `
        SELECT m.tarjeta_profesional AS "tarjetaProfesional", tp.descripcion AS "tipoDoc", m.numero_doc AS "numeroDoc", m.nombre,
        m.apellido, m.fecha_nacimiento AS "fechaNacimiento", m.sexo, m.especialidad, m.email, m.telefono
        FROM medicos m
		LEFT JOIN tipo_documentos tp ON tp.id_documento = m.tipo_doc
        WHERE m.tarjeta_profesional = $1
        `;

        const resultado = await ejecutarConsulta(query, [tarjetaProfesional]);
        const filas: MedicoFila[] = resultado.rows;
        const medicos = filas.map(mapFilaMedico);
        return medicos[0] || null;
    };

    async actualizarMedico(tarjetaProfesional : string, datosMedico : Partial <IMedico>) : Promise <MedicoRepuestaDTO | null> {

        const entries = Object.entries(datosMedico).filter(([, v]) => v !== undefined);
        if (entries.length === 0) {
            return await this.obtenerMedicoPorTarjetaProfesional(tarjetaProfesional);
        }

        const snakeColumn = entries.map(([k]) => camelCaseASnakeCase(k));
        const parametros = entries.map(([, v]) => v);
        const setClause = snakeColumn.map((col,i) => `${col}=$${i+1}`).join(", ");
        parametros.push(tarjetaProfesional);

        const query =`
        UPDATE medicos m
        SET ${setClause}
        FROM tipo_documentos tp
        WHERE tarjeta_profesional = $${parametros.length}
        AND tp.id_documento = m.tipo_doc
        RETURNING
        m.tarjeta_profesional AS "tarjetaProfesional",
        tp.descripcion AS "tipoDoc",
        m.numero_doc AS "numeroDoc",
        m.nombre,
        m.apellido,
        m.fecha_nacimiento AS "fechaNacimiento",
        m.sexo,
        m.especialidad,
        m.email,
        m.telefono;
        `;

        const resultado = await ejecutarConsulta(query, parametros);
        const filas: MedicoFila[] = resultado.rows;
        const medicos = filas.map(mapFilaMedico);
        return medicos[0] || null;
    };

    async eliminarMedico(tarjetaProfesional : string) : Promise <void>{
        await ejecutarConsulta("DELETE FROM medicos WHERE tarjeta_profesional = $1", [tarjetaProfesional]);
    };
}
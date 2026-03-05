import { describe, it, expect, beforeEach, afterEach, jest as jestImport } from '@jest/globals';
import { ConsultorioCasosUso } from '../../../src/core/aplicacion/consultorio/ConsultoriosCasosUso.js';
import { IConsultoriosRepositorio } from '../../../src/core/dominio/consultorio/IConsultoriosRepositorio.js';
import { IConsultorio } from '../../../src/core/dominio/consultorio/IConsultorio.js';
import { ConsultorioRespuestaDTO } from '../../../src/core/infraestructura/repositorios/postgres/dtos/consultorioRespuestaDTO.js';

describe('ConsultorioCasosUso', () => {
  // Varibles usadas en todos los test
  let consultorioCasosUso: ConsultorioCasosUso;
  let mockRepositorio: jest.Mocked<IConsultoriosRepositorio>;

  // Datos de prueba para todas las comprobaciones
  const consultorioMock: IConsultorio = {
    idConsultorio: 'C101',
    ubicacion: 'Edificio A, Piso 2',
  };

  const consultorioRespuestaMock: ConsultorioRespuestaDTO = {
    idConsultorio: 'C101',
    ubicacion: 'Edificio A, Piso 2',
  };
  // Funcion que se ejecuta antes de cada test
  beforeEach(() => {
    // Crear mock del repositorio
    mockRepositorio = {
      agregarConsultorio: jestImport.fn() as any,
      listarConsultorios: jestImport.fn() as any,
      obtenerConsultorioPorId: jestImport.fn() as any,
      actualizarConsultorio: jestImport.fn() as any,
      eliminarConsultorio: jestImport.fn() as any,
    } as jest.Mocked<IConsultoriosRepositorio>;

    // Crear instancia del caso de uso con el mock
    consultorioCasosUso = new ConsultorioCasosUso(mockRepositorio);

    // 'silencia' console.log para evitar salida en tests
    jestImport.spyOn(console, 'log').mockImplementation(() => {});
  });
  // Al conttrario de beforeEach, este se ejecuta DESPUES de cada test
  afterEach(() => {
    jestImport.clearAllMocks();
  });

  describe('agregarConsultorio', () => {
    // it define un test individual
    it('debería agregar un consultorio exitosamente cuando no existe', async () => {
      // Se usa el patron AAA
      // Arrange (Preparar) 'configura que debe retornar el Mock'
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(null);
      (mockRepositorio.agregarConsultorio as jest.Mock).mockResolvedValue(consultorioRespuestaMock);

      // Act (Actuar) 'Ejecuta la funcion'
      const resultado = await consultorioCasosUso.agregarConsultorio(consultorioMock);

      // Assert (Verificar) 'Verifica que todo funciono como se esperaba'
      expect(mockRepositorio.obtenerConsultorioPorId).toHaveBeenCalledWith('C101');
      expect(mockRepositorio.agregarConsultorio).toHaveBeenCalledWith(consultorioMock);
      expect(resultado).toEqual(consultorioRespuestaMock);
    });

    it('debería lanzar error cuando el consultorio ya existe', async () => {
      // Arrange (Preparar)
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(consultorioRespuestaMock);

      // Act (Actuar) & Assert (Verificar)
      await expect(consultorioCasosUso.agregarConsultorio(consultorioMock)).rejects.toThrow();
      // .rejects.toThrow verifica que funcion lanza error cuando se debe
      expect(mockRepositorio.obtenerConsultorioPorId).toHaveBeenCalledWith('C101');
      expect(mockRepositorio.agregarConsultorio).not.toHaveBeenCalled();
    });

    it('debería validar que se llame al repositorio con los datos correctos', async () => {
      // Arrange (Preparar)
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(null);
      (mockRepositorio.agregarConsultorio as jest.Mock).mockResolvedValue(consultorioRespuestaMock);

      const nuevoConsultorio: IConsultorio = {
        idConsultorio: 'C102',
        ubicacion: 'Edificio B, Piso 1',
      };

      // Act (Actuar)
      await consultorioCasosUso.agregarConsultorio(nuevoConsultorio);

      // Assert (Verificar)
      expect(mockRepositorio.agregarConsultorio).toHaveBeenCalledWith(nuevoConsultorio);
    });
  });

  describe('listarConsultorios', () => {
    it('debería listar todos los consultorios sin límite', async () => {
      // Arrange (Preparar)
      const consultoriosEsperados: ConsultorioRespuestaDTO[] = [
        { idConsultorio: 'C101', ubicacion: 'Edificio A' },
        { idConsultorio: 'C102', ubicacion: 'Edificio B' },
        { idConsultorio: 'C103', ubicacion: 'Edificio C' },
      ];
      (mockRepositorio.listarConsultorios as jest.Mock).mockResolvedValue(consultoriosEsperados);

      // Act (Actuar)
      const resultado = await consultorioCasosUso.listarConsultorios();

      // Assert (Verificar)
      expect(mockRepositorio.listarConsultorios).toHaveBeenCalledWith(undefined);
      expect(resultado).toEqual(consultoriosEsperados);
      expect(resultado).toHaveLength(3);
    });

    it('debería listar consultorios con límite especificado', async () => {
      // Arrange (Preparar)
      const limite = 5;
      const consultoriosEsperados: ConsultorioRespuestaDTO[] = [
        { idConsultorio: 'C101', ubicacion: 'Edificio A' },
        { idConsultorio: 'C102', ubicacion: 'Edificio B' },
      ];
      (mockRepositorio.listarConsultorios as jest.Mock).mockResolvedValue(consultoriosEsperados);

      // Act (Actuar)
      const resultado = await consultorioCasosUso.listarConsultorios(limite);

      // Assert (Verificar)
      expect(mockRepositorio.listarConsultorios).toHaveBeenCalledWith(limite);
      expect(resultado).toEqual(consultoriosEsperados);
    });

    it('debería retornar array vacío cuando no hay consultorios', async () => {
      // Arrange (Preparar)
      (mockRepositorio.listarConsultorios as jest.Mock).mockResolvedValue([]);

      // Act (Actuar)
      const resultado = await consultorioCasosUso.listarConsultorios();

      // Assert (Verificar)
      expect(resultado).toEqual([]);
      expect(resultado).toHaveLength(0);
    });
  });

  describe('obtenerConsultorioPorId', () => {
    it('debería obtener un consultorio existente por ID', async () => {
      // Arrange (Preparar)
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(consultorioRespuestaMock);

      // Act (Actuar)
      const resultado = await consultorioCasosUso.obtenerConsultorioPorId('C101');

      // Assert (Verificar)
      expect(mockRepositorio.obtenerConsultorioPorId).toHaveBeenCalledWith('C101');
      expect(resultado).toEqual(consultorioRespuestaMock);
    });

    it('debería lanzar error cuando el consultorio no existe', async () => {
      // Arrange (Preparar)
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(null);

      // Act (Actuar) & Assert (Verificar)
      await expect(consultorioCasosUso.obtenerConsultorioPorId('CONS-999')).rejects.toThrow();

      expect(mockRepositorio.obtenerConsultorioPorId).toHaveBeenCalledWith('CONS-999');
    });

    it('debería hacer log del consultorio encontrado', async () => {
      // Arrange (Preparar)
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(consultorioRespuestaMock);

      // Act (Actuar)
      await consultorioCasosUso.obtenerConsultorioPorId('C101');
    });
  });

  describe('actualizarConsultorio', () => {
    it('debería actualizar un consultorio existente', async () => {
      // Arrange (Preparar)
      const consultorioActualizado: ConsultorioRespuestaDTO = {
        idConsultorio: 'C101',
        ubicacion: 'Edificio A, Piso 3 - Actualizado',
      };
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(consultorioRespuestaMock);
      (mockRepositorio.actualizarConsultorio as jest.Mock).mockResolvedValue(consultorioActualizado);

      const datosActualizacion: IConsultorio = {
        idConsultorio: 'C101',
        ubicacion: 'Edificio A, Piso 3 - Actualizado',
      };

      // Act (Actuar)
      const resultado = await consultorioCasosUso.actualizarConsultorio('C101', datosActualizacion);

      // Assert (Verificar)
      expect(mockRepositorio.obtenerConsultorioPorId).toHaveBeenCalledWith('C101');
      expect(mockRepositorio.actualizarConsultorio).toHaveBeenCalledWith('C101', datosActualizacion);
      expect(resultado).toEqual(consultorioActualizado);
    });

    it('debería lanzar error cuando el consultorio a actualizar no existe', async () => {
      // Arrange (Preparar)
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(null);

      const datosActualizacion: IConsultorio = {
        idConsultorio: 'CONS-999',
        ubicacion: 'Nueva ubicación',
      };

      // Act (Actuar) & Assert (Verificar)
      await expect(consultorioCasosUso.actualizarConsultorio('CONS-999', datosActualizacion)).rejects.toThrow();

      expect(mockRepositorio.obtenerConsultorioPorId).toHaveBeenCalledWith('CONS-999');
      expect(mockRepositorio.actualizarConsultorio).not.toHaveBeenCalled();
    });

    it('debería retornar null cuando la actualización no retorna datos', async () => {
      // Arrange (Preparar)
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(consultorioRespuestaMock);
      (mockRepositorio.actualizarConsultorio as jest.Mock).mockResolvedValue(null);

      const datosActualizacion: IConsultorio = {
        idConsultorio: 'C101',
        ubicacion: 'Nueva ubicación',
      };

      // Act (Actuar)
      const resultado = await consultorioCasosUso.actualizarConsultorio('C101', datosActualizacion);

      // Assert (Verificar)
      expect(resultado).toBeNull();
    });
  });

  describe('eliminarConsultorio', () => {
    it('debería eliminar un consultorio existente', async () => {
      // Arrange (Preparar)
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(consultorioRespuestaMock);
      (mockRepositorio.eliminarConsultorio as jest.Mock).mockResolvedValue(undefined);

      // Act (Actuar)
      await consultorioCasosUso.eliminarConsultorio('C101');

      // Assert (Verificar)
      expect(mockRepositorio.obtenerConsultorioPorId).toHaveBeenCalledWith('C101');
      expect(mockRepositorio.eliminarConsultorio).toHaveBeenCalledWith('C101');
    });

    it('debería lanzar error cuando el consultorio a eliminar no existe', async () => {
      // Arrange (Preparar)
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(null);

      // Act (Actuar) & Assert (Verificar)
      await expect(consultorioCasosUso.eliminarConsultorio('CONS-999')).rejects.toThrow();

      expect(mockRepositorio.obtenerConsultorioPorId).toHaveBeenCalledWith('CONS-999');
      expect(mockRepositorio.eliminarConsultorio).not.toHaveBeenCalled();
    });

    it('debería verificar existencia antes de eliminar', async () => {
      // Arrange (Preparar)
      const ordenDeLlamadas: string[] = [];

      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockImplementation(async (id: string) => {
        ordenDeLlamadas.push('obtener');
        return consultorioRespuestaMock;
      });
      (mockRepositorio.eliminarConsultorio as jest.Mock).mockImplementation(async (id: string) => {
        ordenDeLlamadas.push('eliminar');
      });

      // Act (Actuar)
      await consultorioCasosUso.eliminarConsultorio('C101');

      // Assert (Verificar)
      expect(ordenDeLlamadas).toEqual(['obtener', 'eliminar']);
      expect(mockRepositorio.obtenerConsultorioPorId).toHaveBeenCalledWith('C101');
      expect(mockRepositorio.eliminarConsultorio).toHaveBeenCalledWith('C101');
    });
  });

  describe('Casos de borde y validaciones', () => {
    it('debería manejar consultorios con ubicación null', async () => {
      // Arrange (Preparar)
      const consultorioSinUbicacion: IConsultorio = {
        idConsultorio: 'C103',
        ubicacion: null,
      };
      const respuesta: ConsultorioRespuestaDTO = {
        idConsultorio: 'C103',
        ubicacion: '',
      };
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(null);
      (mockRepositorio.agregarConsultorio as jest.Mock).mockResolvedValue(respuesta);

      // Act (Actuar)
      const resultado = await consultorioCasosUso.agregarConsultorio(consultorioSinUbicacion);

      // Assert (Verificar)
      expect(mockRepositorio.agregarConsultorio).toHaveBeenCalledWith(consultorioSinUbicacion);
      expect(resultado).toEqual(respuesta);
    });

    it('debería manejar consultorios con ubicación undefined', async () => {
      // Arrange (Preparar)
      const consultorioSinUbicacion: IConsultorio = {
        idConsultorio: 'C104',
        ubicacion: undefined,
      };
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(null);
      (mockRepositorio.agregarConsultorio as jest.Mock).mockResolvedValue({
        idConsultorio: 'C104',
        ubicacion: '',
      });

      // Act (Actuar)
      await consultorioCasosUso.agregarConsultorio(consultorioSinUbicacion);

      // Assert (Verificar)
      expect(mockRepositorio.agregarConsultorio).toHaveBeenCalledWith(consultorioSinUbicacion);
    });
  });
});

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, Plus, MoreVertical, Calendar, Trash2 } from 'lucide-react';

// Tipos de datos
interface CitaMedica {
  idCita: string;
  paciente: string;
  tipoDocPaciente: string;
  numeroDocPaciente: string;
  medico: string;
  ubicacion: string | null;
  consultorio: string | null;
  fecha: string;
  horaInicio: string;
  codigoEstadoCita: number;
  estadoCita: string;
  idCitaAnterior: string | null;
}

interface ApiResponse {
  cantidadCitas: number;
  citasEncontradas: CitaMedica[];
}

interface DataTableProps {
  baseUrl: string;
  title: string;
  primaryColor: string;
}

const DataTable: React.FC<DataTableProps> = ({ baseUrl, title, primaryColor }) => {
  const [data, setData] = useState<CitaMedica[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchId, setSearchId] = useState<string>('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentCitaId, setCurrentCitaId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    medico: '',
    tipoDocPaciente: '',
    numeroDocPaciente: '',
    fecha: '',
    horaInicio: '',
  });
  const menuRef = useRef<HTMLDivElement>(null);

  // Función para obtener todas las citas
  const fetchAllCitas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<ApiResponse>(baseUrl);
      setData(response.data.citasEncontradas);
    } catch (err) {
      setError('Error al cargar las citas médicas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Función para buscar por ID
  const fetchCitaById = async (id: string) => {
    if (!id.trim()) {
      fetchAllCitas();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${baseUrl}/${id}`);

      if (response.data.citasEncontradas && Array.isArray(response.data.citasEncontradas)) {
        setData(response.data.citasEncontradas);
      } else if (response.data.citaEncontrada) {
        setData([response.data.citaEncontrada]);
      } else if (response.data.idCita) {
        setData([response.data]);
      } else {
        console.error('Formato de respuesta no reconocido:', response.data);
        setError('Formato de respuesta no válido');
        setData([]);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError('No se encontró la cita con ese ID');
        } else {
          setError('Error al buscar la cita');
        }
      } else {
        setError('Error al buscar la cita');
      }
      setData([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchAllCitas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Alternar menú desplegable
  const toggleMenu = (citaId: string) => {
    setOpenMenuId(openMenuId === citaId ? null : citaId);
  };

  // Manejar reagendamiento
  const handleReagendar = (cita: CitaMedica) => {
    setIsEditing(true);
    setCurrentCitaId(cita.idCita);

    // Prellenar el formulario con los datos actuales
    const tipoDocMap: { [key: string]: string } = {
      CC: '1',
      CE: '2',
      PA: '3',
      TI: '4',
    };

    setFormData({
      medico: '',
      tipoDocPaciente: tipoDocMap[cita.tipoDocPaciente] || '1',
      numeroDocPaciente: cita.numeroDocPaciente,
      fecha: cita.fecha.split('T')[0], // Formatear fecha para input type="date"
      horaInicio: cita.horaInicio,
    });

    setShowModal(true);
    setOpenMenuId(null);
  };

  // Manejar eliminación
  const handleEliminar = async (cita: CitaMedica) => {
    if (!window.confirm(`¿Está seguro que desea eliminar la cita ${cita.idCita}?`)) {
      return;
    }

    try {
      await axios.delete(`${baseUrl}/eliminacion/${cita.idCita}`);
      await fetchAllCitas();
      alert('Cita eliminada exitosamente');
    } catch (err) {
      console.error('Error al eliminar la cita:', err);
      alert('Error al eliminar la cita');
    }
    setOpenMenuId(null);
  };

  // Abrir modal para agendar cita
  const handleOpenModal = () => {
    setIsEditing(false);
    setCurrentCitaId(null);
    setShowModal(true);
    setFormData({
      medico: '',
      tipoDocPaciente: '',
      numeroDocPaciente: '',
      fecha: '',
      horaInicio: '',
    });
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentCitaId(null);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Agendar o reagendar cita
  const handleSubmitCita = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.medico ||
      !formData.tipoDocPaciente ||
      !formData.numeroDocPaciente ||
      !formData.fecha ||
      !formData.horaInicio
    ) {
      alert('Por favor complete todos los campos');
      return;
    }

    try {
      const payload = {
        medico: formData.medico,
        tipoDocPaciente: parseInt(formData.tipoDocPaciente),
        numeroDocPaciente: formData.numeroDocPaciente,
        fecha: formData.fecha,
        horaInicio: formData.horaInicio,
      };

      if (isEditing && currentCitaId) {
        // Reagendar (PUT)
        await axios.put(`${baseUrl}/reprogramacion/${currentCitaId}`, payload);
        alert('Cita reagendada exitosamente');
      } else {
        // Agendar nueva (POST)
        await axios.post(baseUrl, payload);
        alert('Cita agendada exitosamente');
      }

      handleCloseModal();
      await fetchAllCitas();
    } catch (err) {
      console.error('Error al procesar la cita:', err);
      alert(`Error al ${isEditing ? 'reagendar' : 'agendar'} la cita`);
    }
  };

  // Manejar búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCitaById(searchId);
  };

  // Formatear fecha
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return '-';
    }
  };

  // Formatear hora
  const formatTime = (timeString: string | null) => {
    if (!timeString) return '-';
    return timeString.slice(0, 5);
  };

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-light text-gray-800 text-center mb-6'>{title}</h1>

          {/* Barra de búsqueda */}
          <div className='flex gap-4 items-center'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400' size={20} />
                <input
                  type='text'
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                  placeholder='Buscar por ID de cita...'
                  className='w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
                  style={{ borderColor: primaryColor }}
                />
              </div>
            </div>
            <button
              className='p-3 rounded-lg text-white hover:opacity-90 transition-opacity'
              style={{ backgroundColor: primaryColor }}
              onClick={handleOpenModal}
            >
              <Plus size={24} />
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className='bg-white rounded-lg border-2 overflow-hidden shadow-sm' style={{ borderColor: primaryColor }}>
          {loading ? (
            <div className='text-center py-12'>
              <p className='text-gray-500'>Cargando...</p>
            </div>
          ) : error ? (
            <div className='text-center py-12'>
              <p className='text-red-500'>{error}</p>
              <button
                onClick={fetchAllCitas}
                className='mt-4 px-6 py-2 text-white rounded-lg hover:opacity-90'
                style={{ backgroundColor: primaryColor }}
              >
                Recargar
              </button>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-100 border-b-2' style={{ borderColor: primaryColor }}>
                  <tr>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Código cita</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Paciente</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Documento</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>N. documento</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Médico</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Consultorio</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Fecha</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Hora</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Estado</th>
                    <th className='px-6 py-4 text-center text-sm font-semibold text-gray-700'>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={10} className='px-6 py-12 text-center text-gray-500'>
                        No se encontraron citas médicas
                      </td>
                    </tr>
                  ) : (
                    data.map((cita, index) => (
                      <tr
                        key={`${cita.idCita}-${index}`}
                        className={`border-b-2 hover:bg-gray-50 transition-colors ${
                          index === data.length - 1 ? 'border-b-0' : ''
                        }`}
                        style={{ borderColor: index !== data.length - 1 ? primaryColor : 'transparent' }}
                      >
                        <td className='px-6 py-4 text-sm text-gray-700 font-mono'>{cita.idCita}</td>
                        <td className='px-6 py-4 text-sm text-gray-700'>{cita.paciente}</td>
                        <td className='px-6 py-4 text-sm text-gray-700'>{cita.tipoDocPaciente}</td>
                        <td className='px-6 py-4 text-sm text-gray-700'>{cita.numeroDocPaciente}</td>
                        <td className='px-6 py-4 text-sm text-gray-700'>{cita.medico}</td>
                        <td className='px-6 py-4 text-sm text-gray-700'>{cita.consultorio || '-'}</td>
                        <td className='px-6 py-4 text-sm text-gray-700'>{formatDate(cita.fecha)}</td>
                        <td className='px-6 py-4 text-sm text-gray-700'>{formatTime(cita.horaInicio)}</td>
                        <td className='px-6 py-4'>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              cita.estadoCita === 'Activa' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {cita.estadoCita}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-center'>
                          <div className='relative' ref={openMenuId === cita.idCita ? menuRef : null}>
                            <button
                              className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                              onClick={() => toggleMenu(cita.idCita)}
                            >
                              <MoreVertical size={18} className='text-gray-600' />
                            </button>

                            {openMenuId === cita.idCita && (
                              <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10'>
                                <button
                                  onClick={() => handleReagendar(cita)}
                                  className='w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                                >
                                  <Calendar size={16} style={{ color: primaryColor }} />
                                  <span>Reagendar cita</span>
                                </button>
                                <div className='border-t border-gray-100'></div>
                                <button
                                  onClick={() => handleEliminar(cita)}
                                  className='w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg'
                                >
                                  <Trash2 size={16} />
                                  <span>Eliminar cita</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='text-center mt-8 text-sm text-gray-500'>Copyright © 2025 iuKer®</div>

        {/* Modal para agendar/reagendar cita */}
        {showModal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
              {/* Header del modal */}
              <div className='p-6 border-b' style={{ borderColor: primaryColor }}>
                <h2 className='text-2xl font-semibold text-gray-800'>
                  {isEditing ? 'Reagendar Cita' : 'Agendar Nueva Cita'}
                </h2>
              </div>

              {/* Formulario */}
              <div className='p-6'>
                <div className='space-y-4'>
                  {/* Código del Médico */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Código del Médico *</label>
                    <input
                      type='text'
                      name='medico'
                      value={formData.medico}
                      onChange={handleInputChange}
                      placeholder='Ej: MP002'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50'
                      required
                    />
                  </div>

                  {/* Tipo de Documento */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Tipo de Documento *</label>
                    <select
                      name='tipoDocPaciente'
                      value={formData.tipoDocPaciente}
                      onChange={handleInputChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50'
                      required
                    >
                      <option value=''>Seleccione...</option>
                      <option value='1'>Cédula de Ciudadanía</option>
                      <option value='2'>Cédula de Extranjería</option>
                      <option value='3'>Pasaporte</option>
                      <option value='4'>Tarjeta de Identidad</option>
                    </select>
                  </div>

                  {/* Número de Documento */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Número de Documento *</label>
                    <input
                      type='text'
                      name='numeroDocPaciente'
                      value={formData.numeroDocPaciente}
                      onChange={handleInputChange}
                      placeholder='Ej: 100001'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50'
                      required
                    />
                  </div>

                  {/* Fecha */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Fecha de la Cita *</label>
                    <input
                      type='date'
                      name='fecha'
                      value={formData.fecha}
                      onChange={handleInputChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50'
                      required
                    />
                  </div>

                  {/* Hora */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Hora de Inicio *</label>
                    <input
                      type='time'
                      name='horaInicio'
                      value={formData.horaInicio}
                      onChange={handleInputChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50'
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Footer del modal con botones */}
              <div className='p-6 border-t border-gray-200 flex gap-3 justify-end'>
                <button
                  type='button'
                  onClick={handleCloseModal}
                  className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitCita}
                  className='px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity'
                  style={{ backgroundColor: primaryColor }}
                >
                  {isEditing ? 'Reagendar Cita' : 'Agendar Cita'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;

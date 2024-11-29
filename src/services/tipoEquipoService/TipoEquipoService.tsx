import apiClient from '../api';
import { TipoEquipoModel } from '../../models/tipoEquipoModel';
const complementURL = 'tipoEquipo'

interface TipoEquipoResponse {
    response: TipoEquipoModel[];
}

interface CreateTipoEquipoResponse {
    response: {
        status: string;
        message: string;
    };
}

export const getTipoEquipos = async (): Promise<TipoEquipoModel[]> => {
    try {
        const response = await apiClient.get<TipoEquipoResponse>(`${complementURL}/getAllTipoEquipo`);
        return response.data.response;
    }
    catch (error) {
        throw new Error('No se pudieron obtener los Tipos de Equipo. Por favor, intenta de nuevo más tarde.');
    }
};

export const getTipoEquiposActivos = async (): Promise<TipoEquipoModel[]> => {
    try {
        const response = await apiClient.get<TipoEquipoResponse>(`${complementURL}/getActiveTipoEquipo`);
        return response.data.response;
    }
    catch (error) {
        throw new Error('No se pudieron obtener los Tipos de Equipo. Por favor, intenta de nuevo más tarde.');
    }
};

export const createTipoEquipo = async (tipoEquipo: TipoEquipoModel): Promise<{ status: string; message: string }> => {
    try {
        const response = await apiClient.post<CreateTipoEquipoResponse>(`${complementURL}/createTipoEquipo`, tipoEquipo);
        const { status, message } = response.data.response;
        if (status === 'ERROR' || status === 'ALERT') 
        {
            throw { status, message };
        }
        return { status, message }; 
    } catch (error: any) {
        const errorResponse = error.response?.data || {};
        const errorMessage = errorResponse.message || error;
        const errorStatus = errorResponse.status || 'ERROR';
        throw { status: errorStatus, message: errorMessage };
    }
};

export const updateTipoEquipo = async (employeeType: TipoEquipoModel): Promise<{ status: string; message: string }> => {
    try {
        const response = await apiClient.put<CreateTipoEquipoResponse>(`${complementURL}/updateTipoEquipo`, employeeType);
        const { status, message } = response.data.response;
        if (status === 'ERROR' || status === 'ALERT') 
        {
            throw { status, message };
        }
        return { status, message }; 
    } catch (error: any) {
        const errorResponse = error.response?.data || {};
        const errorMessage = errorResponse.message || error;
        const errorStatus = errorResponse.status || 'ERROR';
        throw { status: errorStatus, message: errorMessage };
    }
};

export const deleteTipoEquipo = async (employeeType: TipoEquipoModel): Promise<{ status: string; message: string }> => {
    try {
        const response = await apiClient.put<CreateTipoEquipoResponse>(`${complementURL}/deleteTipoEquipo`, employeeType);
        const { status, message } = response.data.response;
        if (status === 'ERROR' || status === 'ALERT') 
        {
            throw { status, message };
        }
        return { status, message }; 
    } catch (error: any) {
        const errorResponse = error.response?.data || {};
        const errorMessage = errorResponse.message || error;
        const errorStatus = errorResponse.status || 'ERROR';
        throw { status: errorStatus, message: errorMessage };
    }
};
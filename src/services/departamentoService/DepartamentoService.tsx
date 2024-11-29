import apiClient from '../api';
import { DepartamentoModel } from '../../models/departamentoModel';
const complementURL = 'departamento'

interface DepartamentoResponse {
    response: DepartamentoModel[];
}

interface CreateDepartamentoResponse {
    response: {
        status: string;
        message: string;
    };
}

export const getDepartamentos = async (): Promise<DepartamentoModel[]> => {
    try {
        const response = await apiClient.get<DepartamentoResponse>(`${complementURL}/getAllDepartamento`);
        return response.data.response;
    }
    catch (error) {
        throw new Error('No se pudieron obtener los Departamentos. Por favor, intenta de nuevo más tarde.');
    }
};

export const getDepartamentosActivos = async (): Promise<DepartamentoModel[]> => {
    try {
        const response = await apiClient.get<DepartamentoResponse>(`${complementURL}/getActiveDepartamento`);
        return response.data.response;
    }
    catch (error) {
        throw new Error('No se pudieron obtener los Departamentos. Por favor, intenta de nuevo más tarde.');
    }
};

export const createDepartamento = async (departamento: DepartamentoModel): Promise<{ status: string; message: string }> => {
    try {
        const response = await apiClient.post<CreateDepartamentoResponse>(`${complementURL}/createDepartamento`, departamento);
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

export const updateDepartamento = async (employeeType: DepartamentoModel): Promise<{ status: string; message: string }> => {
    try {
        const response = await apiClient.put<CreateDepartamentoResponse>(`${complementURL}/updateDepartamento`, employeeType);
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

export const deleteDepartamento = async (employeeType: DepartamentoModel): Promise<{ status: string; message: string }> => {
    try {
        const response = await apiClient.put<CreateDepartamentoResponse>(`${complementURL}/deleteDepartamento`, employeeType);
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
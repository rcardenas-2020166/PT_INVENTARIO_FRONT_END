import apiClient from '../api';
import { InventarioModel } from '../../models/inventarioModel';
const complementURL = 'inventario'

interface InventarioResponse {
    response: InventarioModel[];
}

interface CreateInventarioResponse {
    response: {
        status: string;
        message: string;
    };
}

export const getInventarios = async (): Promise<InventarioModel[]> => {
    try {
        const response = await apiClient.get<InventarioResponse>(`${complementURL}/getAllControlInventario`);
        return response.data.response;
    }
    catch (error) {
        throw new Error('No se pudieron obtener los Tipos de Equipo. Por favor, intenta de nuevo más tarde.');
    }
};

export const createInventario = async (inventario: InventarioModel): Promise<{ status: string; message: string }> => {
    try {
        const response = await apiClient.post<CreateInventarioResponse>(`${complementURL}/createControlInventario`, inventario);
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

export const updateInventario = async (employeeType: InventarioModel): Promise<{ status: string; message: string }> => {
    try {
        const response = await apiClient.put<CreateInventarioResponse>(`${complementURL}/updateControlInventario`, employeeType);
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

export const deleteInventario = async (employeeType: InventarioModel): Promise<{ status: string; message: string }> => {
    try {
        const response = await apiClient.put<CreateInventarioResponse>(`${complementURL}/deleteControlInventario`, employeeType);
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
'use server'

import { getCookie } from "../shared/cookies/cookies";
import { get, post, put } from "../shared/services/services";
import { Employee } from "@/components/employees/types";

export const getEmployees = async () => {
    const token = await getCookie('Token');
    return await get('Employee/GetAllEmployees', { token });
}

export const addEmployee = async (employee: Employee) => {
    const token = await getCookie('Token');
    const data = await (await post('Employee/AddEmployee', { data: employee, token }));

    console.log("data from addEmployee: " + data)
    
    return data;
}

export const updateEmployee = async (employee: Employee) => {
    const token = await getCookie('Token');
    
    await put('Employee/UpdateEmployee', { data: employee, token });
    return true;
}

export const deleteEmployee = async (id: number) => {
    const token = await getCookie('Token');

    await put(`Employee/DeleteEmployee/${id}`, { token });
    return true;
}

export const updateEmployeeDetails = async (employee: Employee) => {
    const token = await getCookie('Token');

    await put('Employee/UpdateEmployeeDetails', { data: employee, token });
    return true;
}

export const getEmployeeById = async (id: number) => {
    const token = await getCookie('Token');
    return await get(`Employee/GetEmployeeById/${id}`, { token });
}
'use server'

import { ActionResult } from "../shared/actions/action-interfaces";
import { Employee } from "@/components/employees/types";
import { addEmployee, deleteEmployee, getEmployeeById, getEmployees, updateEmployee, updateEmployeeDetails } from "./employee-services";

export const getEmployeesAction = async (): Promise<ActionResult<Employee[]>> => {
    try {
        const result = await getEmployees();
        return { success: result, message: result ? 'Employees retrieved successfully.' : 'Error retrieving employees.', data: result };
    } catch (error) {
        return { success: false, message: 'Error retrieving employees.' };
    }
}

export const addEmployeeAction = async (employee: Employee): Promise<ActionResult> => {
    try {
        const result = await addEmployee(employee);
        return { success: result, message: result ? 'Employee added successfully.' : 'Error adding employee.' };
    } catch (error) {
        return { success: false, message: 'Error adding employee.' };
    }
}

export const updateEmployeeAction = async (employee: Employee): Promise<ActionResult> => {
    try {
        const result = await updateEmployee(employee);
        return { success: result, message: result ? 'Employee updated successfully.' : 'Error updating employee.' };
    } catch (error) {
        return { success: false, message: 'Error updating employee.' };
    }
}

export const deleteEmployeeAction = async (id: number): Promise<ActionResult> => {
    try {
        const result = await deleteEmployee(id);
        return { success: result, message: result ? 'Employee removed successfully.' : 'Error removing employee.' };
    } catch (error) {
        return { success: false, message: 'Error removing employee.' };
    }
}

export const updateEmployeeDetailsAction = async (employee: Employee): Promise<ActionResult> => {
    try {
        const result = await updateEmployeeDetails(employee);
        return { success: result, message: result ? 'Employee updated successfully.' : 'Error updating employee.' };
    } catch (error) {
        return { success: false, message: 'Error updating employee.' };
    }
}

export const getEmployeeByIdAction = async (id: number): Promise<ActionResult<Employee>> => {
    try {
        const result = await getEmployeeById(id);
        return { success: result, message: result ? 'Employee retrieved successfully.' : 'Error retrieving employee.', data: result };
    } catch (error) {
        return { success: false, message: 'Error retrieving employee.' };
    }
}
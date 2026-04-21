'use client'

import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Employee } from '@/components/employees/types';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { addEmployeeAction, updateEmployeeAction } from '@/lib/employees/employee-actions';


// Valid values for type: "Add" & "Edit"
const EmployeeForm = ({ type, employee, refreshEmployees }: { type: 'Add' | 'Edit', employee: Employee | null, refreshEmployees: () => Promise<void> }) => {

    // useStates
    const [openModal, setOpenModal] = useState(false);
    const [originalEmployee, setOriginalEmployee] = useState<Employee>({
        id: 0,
        name: "",
        jobTitle: "",
        hireDate: "",
        details: "",
        status: ""
    });
    // const [isFormValid, setIsFormValid] = useState(true);


    const isFormValid =
        originalEmployee.name.trim() !== "" &&
        originalEmployee.jobTitle.trim() !== "" &&
        originalEmployee.hireDate !== "";



    // Modal Functions
    const resetForm = () => {
        if (type === "Add") {
            setOriginalEmployee(employee as Employee);
        }

        setOpenModal(true);
    };

    const submitForm = () => {
        setOpenModal(false);
        setOriginalEmployee({ id: 0, name: "", jobTitle: "", hireDate: "", details: "", status: "" });
    };

    // Change employee functions
    const handleEmployeeToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOriginalEmployee({
            ...originalEmployee,
            [e.target.id]: e.target.value,
        });
    };

    const handleEmployeeToChangeHireDate = (date: string) => {
        setOriginalEmployee({
            ...originalEmployee,
            hireDate: date,
        });
    };

    // Date functions
    const parseDateString = (date: string) => {
        if (!date) return undefined;

        const [year, month, day] = date.toString().split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    const validateDateFormat = (date: Date | undefined) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    // Add & Edit function
    const validateEmployeeData = async () => {
        try {
            const employeeWithChanges = {
                ...originalEmployee,
                name: originalEmployee.name.trim(),
                jobTitle: originalEmployee.jobTitle.trim(),
            };

            console.log('employee data validated successfully');

            if (type === "Add") {
                const result = await addEmployeeAction(employeeWithChanges);
                if (result.success) {
                    refreshEmployees();
                }
            } else {
                const result = await updateEmployeeAction(employeeWithChanges);
                if (result.success) {
                    refreshEmployees();
                }
            }

            setOriginalEmployee({
                id: 0,
                name: "",
                jobTitle: "",
                hireDate: "",
                details: "",
                status: ""
            });
        } catch (error) {
            console.log("error", error);
        }

        submitForm();
    };

    return (
        <Dialog >
            <DialogTrigger asChild>
                {/* <Button variant="outline">Edit Profile</Button> */}
                <Button
                    color="success"
                    className={type === "Add" ? "flex items-center gap-1" : ""}
                    onClick={resetForm}
                >
                    {type === "Add" ? <FaPlus className="mt-[0.2rem]" /> : "Edit"}
                </Button>
            </DialogTrigger>
            <DialogContent className='w-[40rem]'>
                <DialogHeader className='pb-3'>
                    <DialogTitle>
                        {type === "Add"
                            ? "Add New Employee"
                            : "Update Employee Information"}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 min-h-[30rem]">
                    <div>
                        <div className='pb-5'>
                            <div className="mb-2 block">
                                <Label htmlFor="name">Employee name</Label>
                            </div>
                            <Input
                                id="name"
                                value={originalEmployee.name}
                                onChange={handleEmployeeToChange}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="jobTitle">Job title</Label>
                            </div>
                            <Input
                                id="jobTitle"
                                value={originalEmployee.jobTitle}
                                onChange={handleEmployeeToChange}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label>Date hired</Label>
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !originalEmployee.hireDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {originalEmployee.hireDate ? originalEmployee.hireDate : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={parseDateString(originalEmployee.hireDate)}
                                    onSelect={(e) =>
                                        handleEmployeeToChangeHireDate(validateDateFormat(e))
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            onClick={validateEmployeeData}
                            color="success"
                            disabled={!isFormValid}
                        >
                            {type === "Add" ? "Add" : "Update"} Employee
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EmployeeForm

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
import { Employee } from '@/lib/employees/employee-interfaces';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { addEmployeeAction, updateEmployeeAction } from '@/lib/employees/employee-actions';


// Valid values for type: "Add" & "Edit"
const EmployeeModal = ({ type, employee, refreshEmployees }: { type: 'Add' | 'Edit', employee: Employee | null, refreshEmployees: () => Promise<void> }) => {

    // useStates
    const [openModal, setOpenModal] = useState(false);
    const [employeeToChange, setEmployeeToChange] = useState<Employee>({
        id: 0,
        name: "",
        jobTitle: "",
        hireDate: "",
        details: "",
        status: ""
    });

    const disableBtn =
        employeeToChange.name.trim() == "" ||
        employeeToChange.jobTitle.trim() == "" ||
        employeeToChange.hireDate == "";

    // Modal Functions
    const onOpenModal = () => {
        if (type === "Edit") {
            setEmployeeToChange(employee as Employee);
        }

        setOpenModal(true);
    };

    const onCloseModal = () => {
        setOpenModal(false);
        setEmployeeToChange({ id: 0, name: "", jobTitle: "", hireDate: "", details: "", status: "" });
    };

    // Change employee functions
    const handleEmployeeToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmployeeToChange({
            ...employeeToChange,
            [e.target.id]: e.target.value,
        });
    };

    const handleEmployeeToChangeHireDate = (date: string) => {
        setEmployeeToChange({
            ...employeeToChange,
            hireDate: date,
        });
    };

    // Date functions
    const formatDateForInput = (date: string) => {
        if (!date) return undefined;

        const [year, month, day] = date.toString().split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    const formatDateFromInput = (date: Date | undefined) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    // Add & Edit function
    const handleEmployee = async () => {
        try {
            const employeeWithChanges = {
                ...employeeToChange,
                name: employeeToChange.name.trim(),
                jobTitle: employeeToChange.jobTitle.trim(),
            };

            if (type === "Add") {
                const result = await addEmployeeAction(employeeWithChanges);
                if (result.success) {
                    await refreshEmployees();
                }
            } else {
                const result = await updateEmployeeAction(employeeWithChanges);
                if (result.success) {
                    await refreshEmployees();
                }
            }

            setEmployeeToChange({
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

        onCloseModal();
    };

    return (
        <Dialog >
            <DialogTrigger asChild>
                {/* <Button variant="outline">Edit Profile</Button> */}
                <Button
                    color="success"
                    className={type === "Add" ? "flex items-center gap-1" : ""}
                    onClick={onOpenModal}
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
                                value={employeeToChange.name}
                                onChange={handleEmployeeToChange}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="jobTitle">Job title</Label>
                            </div>
                            <Input
                                id="jobTitle"
                                value={employeeToChange.jobTitle}
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
                                        !employeeToChange.hireDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {employeeToChange.hireDate ? employeeToChange.hireDate : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={formatDateForInput(employeeToChange.hireDate)}
                                    onSelect={(e) =>
                                        handleEmployeeToChangeHireDate(formatDateFromInput(e))
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
                            onClick={handleEmployee}
                            color="success"
                            disabled={disableBtn}
                        >
                            {type === "Add" ? "Add" : "Update"} Employee
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EmployeeModal
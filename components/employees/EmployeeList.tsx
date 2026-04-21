'use client'

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import EmployeeForm from './EmployeeForm';
import { Employee } from '@/components/employees/types';
import { deleteEmployeeAction, getEmployeesAction } from '@/lib/employees/employee-actions';

const EmployeeList = () => {
    const { push } = useRouter();

    // useStates
    const [deletedEmployees, setDeletedEmployees] = useState<Employee[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);

    const [filterType, setFilterType] = useState("");
    const [selectedSort, setSelectedSort] = useState("");

    // Function to get employees
    const clearEmployeeCache = async () => {
        try {
            // const result: Employee[] | "Not Authorized" = [];
            const result = await getEmployeesAction();
            // const result = { success: false, data: [] };

            console.log('result: ', result);
            console.log('this seems fine');

            if(result.success){

                setDeletedEmployees(result.data!);
                setEmployees(result.data!)
            }
            else
                console.log(result)

        } catch (error) {
            console.log("error", error);
        }
    };

    // Updating sort functions
    const resetSortOrder = (value: string) => {
        if (value == "name" && filterType == "name") {
            setFilterType(`${value}-reverse`);
        } else if (value == "hire-date" && filterType == "hire-date") {
            setFilterType(`${value}-reverse`);
        } else {
            setFilterType(value);
        }

        if (selectedSort) {
            setSelectedSort("");
        }
    };

    const changeSortByJob = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterType("job-title");

        setSelectedSort(e.target.value);
    };

    // Delete employee
    const refreshEmployeeData = async (id: number) => {
        try {
            console.log('probably not the issue');
            deleteEmployeeAction(id);
            if (true) {
                await clearEmployeeCache();
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleViewEmployee = async (id: number) => {
        push(`/employees/${id}`);
    };

    // Fetching employees after token is set
    useEffect( () => {
        const handleGet = async () => {
            await clearEmployeeCache();
        }

        handleGet();
    }, [])

    // Sorting the employees
    useEffect(() => {
        const sortingEmployees = deletedEmployees;

        const handleSorting = () => {
            console.log('sorting employees correctly');
            switch (filterType) {
                case "name":
                    setEmployees(sortingEmployees.sort((a: Employee, b: Employee) => a.name.localeCompare(b.name)));
                    break;
                case "name-reverse":
                    setEmployees(sortingEmployees.sort((a: Employee, b: Employee) => b.name.localeCompare(a.name)));
                    break;
                case "hire-date":
                    setEmployees(sortingEmployees.sort(
                        (a: Employee, b: Employee) => Number(new Date(b.hireDate)) - Number(new Date(a.hireDate))
                    ));
                    break;
                case "hire-date-reverse":
                    setEmployees(sortingEmployees.sort(
                        (a: Employee, b: Employee) => Number(new Date(a.hireDate)) - Number(new Date(b.hireDate))
                    ));
                    break;
                case "job-title":
                    setEmployees(sortingEmployees.filter((employee: Employee) => employee.jobTitle == selectedSort));
                    break;
                default:
                    setEmployees(sortingEmployees.sort((a: Employee, b: Employee) => a.id - b.id));
                    break;
            }
        };

        handleSorting();

    }, [deletedEmployees, filterType, selectedSort]);

    return (
        <>
            {/* Sort by - Start */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4">
                <div className="flex items-center gap-3 mb-2 md:mb-0">
                    <h2 className="text-2xl font-medium text-gray-700 dark:text-white">Add new hire</h2>
                    <EmployeeForm type="Add" employee={{ id: 0, name: "", jobTitle: "", hireDate: "", details: "", status: "" }} refreshEmployees={clearEmployeeCache} />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center">
                        <p className="mr-2 text-sm text-gray-600">Sort by:</p>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="text-sm text-gray-600">
                                    Name
                                    {filterType === "name" ? <FaCaretDown className="ml-2" /> : filterType === "name-reverse" ? <FaCaretUp className="ml-2" /> : ""}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => resetSortOrder("name")}>A-Z</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => resetSortOrder("name-reverse")}>Z-A</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="text-sm text-gray-600">
                                    Hire date
                                    {filterType === "hire-date" ? <FaCaretDown className="ml-2" /> : filterType === "hire-date-reverse" ? <FaCaretUp className="ml-2" /> : ""}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => resetSortOrder("hire-date")}>Newest First</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => resetSortOrder("hire-date-reverse")}>Oldest First</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <select
                            className="ml-3 text-sm border rounded p-1"
                            value={filterType === "job-title" ? selectedSort : ""}
                            onChange={changeSortByJob}
                        >
                            <option value="" disabled>
                                Job title
                            </option>
                            <option value="Customer Support">Customer Support</option>
                            <option value="IT Support Specialist">IT Support Specialist</option>
                            <option value="Software Engineer">Software Engineer</option>
                        </select>
                    </div>
                </div>
            </div>
            {/* Sort by - End */}

            {/* Display table - Start */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='text-lg'>Employee name</TableHead>
                        <TableHead className='text-lg'>Job Title</TableHead>
                        <TableHead className='text-lg'>Date Hired</TableHead>
                        <TableHead className="text-lg text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.length === 0 ? (
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell className="text-center">
                                No Employees
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    ) : (
                        employees.map((employee, idx) => (
                            <TableRow key={idx}>
                                <TableCell className="font-medium">{employee.name}</TableCell>
                                <TableCell>{employee.jobTitle}</TableCell>
                                <TableCell>{employee.hireDate}</TableCell>
                                <TableCell className="flex gap-3 justify-end">
                                    <Button onClick={() => handleViewEmployee(employee.id)}>
                                        View
                                    </Button>
                                    <EmployeeForm type="Edit" employee={employee} refreshEmployees={clearEmployeeCache} />
                                    <Button variant="destructive" onClick={() => refreshEmployeeData(employee.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            {/* Display table - End */}
        </>
    )
}

export default EmployeeList

'use client'

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import EmployeeModal from './EmployeeModal';
import { Employee } from '@/lib/employees/employee-interfaces';
import { deleteEmployeeAction, getEmployeesAction } from '@/lib/employees/employee-actions';

const EmployeeTable = () => {
    const { push } = useRouter();

    // useStates
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [sortedEmployees, setSortedEmployees] = useState<Employee[]>([]);

    const [sortBy, setSortBy] = useState("");
    const [sortByJob, setSortByJob] = useState("");

    // Function to get employees
    const handleGetEmployees = async () => {
        try {
            // const result: Employee[] | "Not Authorized" = [];
            const result = await getEmployeesAction();

            console.log('result: ', result);

            if(result.success)
                setEmployees(result.data!);

        } catch (error) {
            console.log("error", error);
        }
    };

    // Updating sort functions
    const changeSortBy = (value: string) => {
        if (value == "name" && sortBy == "name") {
            setSortBy(`${value}-reverse`);
        } else if (value == "hire-date" && sortBy == "hire-date") {
            setSortBy(`${value}-reverse`);
        } else {
            setSortBy(value);
        }

        if (sortByJob) {
            setSortByJob("");
        }
    };

    const changeSortByJob = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy("job-title");

        setSortByJob(e.target.value);
    };

    // Delete employee
    const handleDeleteEmployee = async (id: number) => {
        try {
            const result = await deleteEmployeeAction(id);
            if (result.success) {
                await handleGetEmployees();
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleViewEmployee = async (id: number) => {
        push(`/employees/${id}`);
    };

    // Fetching employees after token is set
    useEffect(() => {
        const handleGet = async () => {
            await handleGetEmployees();
        }

        handleGet();
    }, [])

    // Sorting the employees
    useEffect(() => {
        const sortingEmployees = [...employees];

        const handleSorting = () => {
            switch (sortBy) {
                case "name":
                    setSortedEmployees(sortingEmployees.sort((a: Employee, b: Employee) => a.name.localeCompare(b.name)));
                    break;
                case "name-reverse":
                    setSortedEmployees(sortingEmployees.sort((a: Employee, b: Employee) => b.name.localeCompare(a.name)));
                    break;
                case "hire-date":
                    setSortedEmployees(sortingEmployees.sort(
                        (a: Employee, b: Employee) => Number(new Date(b.hireDate)) - Number(new Date(a.hireDate))
                    ));
                    break;
                case "hire-date-reverse":
                    setSortedEmployees(sortingEmployees.sort(
                        (a: Employee, b: Employee) => Number(new Date(a.hireDate)) - Number(new Date(b.hireDate))
                    ));
                    break;
                case "job-title":
                    setSortedEmployees(sortingEmployees.filter((employee: Employee) => employee.jobTitle == sortByJob));
                    break;
                default:
                    setSortedEmployees(sortingEmployees.sort((a: Employee, b: Employee) => a.id - b.id));
                    break;
            }
        };

        handleSorting();

    }, [employees, sortBy, sortByJob]);

    return (
        <>
            {/* Sort by - Start */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4">
                <div className="flex items-center gap-3 mb-2 md:mb-0">
                    <h2 className="text-2xl font-medium text-gray-700 dark:text-white">Add new hire</h2>
                    <EmployeeModal type="Add" employee={null} refreshEmployees={handleGetEmployees} />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center">
                        <p className="mr-2 text-sm text-gray-600">Sort by:</p>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="text-sm text-gray-600">
                                    Name
                                    {sortBy === "name" ? <FaCaretDown className="ml-2" /> : sortBy === "name-reverse" ? <FaCaretUp className="ml-2" /> : ""}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => changeSortBy("name")}>A-Z</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => changeSortBy("name-reverse")}>Z-A</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="text-sm text-gray-600">
                                    Hire date
                                    {sortBy === "hire-date" ? <FaCaretDown className="ml-2" /> : sortBy === "hire-date-reverse" ? <FaCaretUp className="ml-2" /> : ""}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => changeSortBy("hire-date")}>Newest First</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => changeSortBy("hire-date-reverse")}>Oldest First</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <select
                            className="ml-3 text-sm border rounded p-1"
                            value={sortBy === "job-title" ? sortByJob : ""}
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
                    {sortedEmployees.length === 0 ? (
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell className="text-center">
                                No Employees
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    ) : (
                        sortedEmployees.map((employee, idx) => (
                            <TableRow key={idx}>
                                <TableCell className="font-medium">{employee.name}</TableCell>
                                <TableCell>{employee.jobTitle}</TableCell>
                                <TableCell>{employee.hireDate}</TableCell>
                                <TableCell className="flex gap-3 justify-end">
                                    <Button onClick={() => handleViewEmployee(employee.id)}>
                                        View
                                    </Button>
                                    <EmployeeModal type="Edit" employee={employee} refreshEmployees={handleGetEmployees} />
                                    <Button variant="destructive" onClick={() => handleDeleteEmployee(employee.id)}>
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

export default EmployeeTable
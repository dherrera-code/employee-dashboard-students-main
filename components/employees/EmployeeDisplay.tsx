'use client'

import { CalendarIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { Employee } from '@/components/employees/types'
import { useState } from 'react'
import { updateEmployeeDetails } from '@/lib/employees/employee-services'
import { useRouter } from 'next/navigation'

const EmployeeDisplay = ({ employee, setEdit }: { employee: Employee, setEdit: (value: boolean) => void }) => {
    const [jobTitle, setJobTitle] = useState(employee.jobTitle)
    const [details, setDetails] = useState(employee.details)
    const [status, setStatus] = useState(employee.status)
    const router = useRouter();

    const handleSaveEdits = async () => {
        const editedEmployee: Employee = {
            id: employee.id,
            name: employee.name,
            jobTitle: jobTitle,
            details: details,
            status: status,
            hireDate: employee.hireDate
        }
        if(jobTitle == "" || jobTitle == null)
            console.log("Job Title is Required!")

        console.log(editedEmployee);
        // call endpoint to update employee!!!
        const result = await updateEmployeeDetails(editedEmployee)
        console.log(result)
        setEdit(false);
        if(result){
            router.refresh();
        }
    }

    return (
        <>
            <div>
                <p className="text-sm font-semibold">Job Title</p>
                <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            </div>

            <div>
                <p className="text-sm font-semibold">Details</p>
                <Input value={details || ""} onChange={(e) => setDetails(e.target.value)} />
            </div>

            <div>
                <p className="text-sm font-semibold">Status</p>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem onClick={() => setStatus("Active")} value="Active">Active</SelectItem>
                            <SelectItem onClick={() => setStatus("Sick")} value="Sick">Sick</SelectItem>
                            <SelectItem onClick={() => setStatus("Out of Office")} value="Out of Office">Out of Office</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <p className="text-sm font-semibold">Hire Date</p>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn("w-full justify-start text-left font-normal text-muted-foreground")}
                        >
                            <CalendarIcon />
                            <span>Pick a date</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={new Date()}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>


            <div className="flex justify-between pt-4">
                <Button onClick={() => setEdit(false)}>Cancel</Button>
                {employee && <Button variant="outline" onClick={handleSaveEdits}>Save Edits</Button>}
            </div>
        </>
    )
}

export default EmployeeDisplay

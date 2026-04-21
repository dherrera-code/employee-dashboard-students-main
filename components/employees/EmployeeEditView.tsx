'use client'

import { CalendarIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { Employee } from '@/lib/employees/employee-interfaces'
import { ChangeEvent, useState } from 'react'


const EmployeeEditView = ({ employee, setEdit }: { employee: Employee, setEdit: (value: boolean) => void }) => {
    const [jobTitle, setJobTitle] = useState(employee.jobTitle);
    const [details, setDetails] = useState(employee.details)

    const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setJobTitle(e.target.value);
    }

    const handleDetails = (e: ChangeEvent<HTMLInputElement>) => {
        setDetails(e.target.value);
    }


    return (
        <>
            <div>
                <p className="text-sm font-semibold">Job Title</p>
                <Input value={jobTitle} onChange={(e) => handleTitle(e)} />
            </div>

            <div>
                <p className="text-sm font-semibold">Details</p>
                <Input value={details || ""} onChange={(e) => handleDetails(e)} />
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
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Sick">Sick</SelectItem>
                            <SelectItem value="Out of Office">Out of Office</SelectItem>
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
                {employee && <Button variant="outline">Save Edits</Button>}
            </div>
        </>
    )
}

export default EmployeeEditView
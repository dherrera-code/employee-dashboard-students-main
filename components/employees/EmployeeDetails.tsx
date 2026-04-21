'use client'

import EmployeeDisplay from '@/components/employees/EmployeeDisplay';
import EmployeeEditor from '@/lib/employees/EmployeeEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Employee } from '@/components/employees/types';
import { useState } from 'react';

const EmployeeDetails = ({ employee }: { employee: Employee | null }) => {

    const [isViewMode, setIsViewMode] = useState(false);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-black">
                    {employee ? employee.name : 'No employee found'}
                </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4 text-black">
                {
                    employee && (
                        isViewMode ?
                            <EmployeeDisplay employee={employee} setEdit={setIsViewMode} />
                            :
                            <EmployeeEditor employee={employee} setEdit={setIsViewMode} />
                    )
                }
            </CardContent>
        </Card>
    )
}

export default EmployeeDetails

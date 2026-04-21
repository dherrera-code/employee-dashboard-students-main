import EmployeeDetails from '@/components/employees/EmployeeDetails';
import { getEmployeeByIdAction } from '@/lib/employees/employee-actions';
import { Employee } from '@/components/employees/types';

const page = async ({ params }: { params: { id: number } }) => {
    const { id } = await params;

    let employee: Employee | null = null;
    
    const result = await getEmployeeByIdAction(id);

    if(result.success)
        employee = result.data!;

    return (
        <div className="min-h-screen flex flex-col justify-center max-w-3xl mx-auto">
            <EmployeeDetails employee={employee} />
        </div>
    )
}

export default page
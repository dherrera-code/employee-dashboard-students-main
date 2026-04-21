import EmployeeList from "@/components/employees/EmployeeList"

const EmployeesPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="mx-[10%] pt-20">

        <EmployeeList />

      </div>
    </div>
  )
}

export default EmployeesPage
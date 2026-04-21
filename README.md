# Employee Dashboard - Debugging Assignment

A Next.js employee management application with some bugs that need fixing.

## Your Mission

This employee dashboard application is **almost working**, but several features are broken. Your task is to find and fix all the bugs to make the application fully functional.

## Getting Started

### Installation

1. Install dependencies:
```
npm install
```

2. Create a `.env.local` file (if not present) with:
```
API_URL=your_api_url_here
```

3. Start the development server:
```
npm run dev
```

## Expected Features

The application should support:

- **View Employees** - Display a list of all employees
- **Add Employee** - Create new employee records
- **Edit Employee** - Update existing employee information
- **Delete Employee** - Remove employees from the system
- **Sort Employees** - Sort by name, hire date, or job title
- **View Details** - See individual employee details
- **Edit Details** - Modify employee details from the detail page

## Known Issues

The application currently has several bugs affecting functionality. Your job is to:

1. **Identify** all bugs
2. **Document** what's broken and why
3. **Fix** each bug
4. **Verify** the fix works correctly

## Testing Your Fixes

After fixing bugs, verify these features work:

### Employee List
- [ ] Employees load on page mount
- [ ] Sorting by name (A-Z and Z-A) works
- [ ] Sorting by hire date (newest/oldest) works
- [ ] Filtering by job title works
- [ ] List updates immediately after changes

### Add Employee
- [ ] Modal opens with empty form
- [ ] Can enter name, job title, and hire date
- [ ] New employee appears in list immediately
- [ ] Modal closes after successful add

### Edit Employee
- [ ] Modal opens with pre-filled data
- [ ] Can modify employee information
- [ ] Changes appear in list immediately
- [ ] Modal closes after successful edit

### Delete Employee
- [ ] Employee is removed from list immediately
- [ ] No page refresh required

### Employee Details
- [ ] Can view individual employee details
- [ ] Edit button switches to edit mode
- [ ] Edit mode shows input fields
- [ ] Can save changes from detail page
- [ ] Back button returns to employee list

## Submission

When complete, document:

1. **List of bugs found** - What was broken?
2. **Root causes** - Why did each bug occur?
3. **Fixes applied** - How did you fix each bug?
4. **Testing results** - How did you verify the fixes?

After opening project folder, I ran npm i into the terminal to install node-modules. 

### Bug #1: When User presses the Add new Hire button, An error occurs: Runtime TypeError: Cannot read properties of null (reading 'name') 
Location: components/employees/EmployeeForm.tsx (32:26):
Looking at when the component was evoked, when adding an employee, the add form passed in a null employee object which gave us this error because we can have null into the input field in the modal! To fix, instead of passing in null to add an employee, we pass in an empty employee object with object values set to empty strings!

null was changed to { id: 0, name: "", jobTitle: "", hireDate: "", details: "", status: "" }!

### Bug 2: Login Error not working/ displaying.
I found this error when I was playing with the login form. I've noticed when I try to login without credentials, I don't login and don't receive login errors!
Within the login form component, I set multiple console.logs within handleLogin function and the changeUser function!
The logic error lies within the handleLogin function where the endpoint worked but failed to login because the credentials were wrong! In the handleLogin function, we tested if result.success was true and we would push the user to the next page but didn't have precautions if result.success was false. 
To fix this, I just added on an else and set use state bool: setLoginError(true) to true to display log in error!
After testing this function, login function works as intended!

### Bug 3: After Logging In, Employee data is not populating! 
Checking code in employee's page.tsx and control clicking the employeeList component, the function to get employees doesn't call the endpoint for getEmployeesAction, in fact, it's commented out!

### Bug #4: When adding an employee, unable to submit form when fields are inputted! 
When all input fields are filled, button to submit new employee has been disabled!
WIthin the EmployeeForm, the isFormValid bool determines if inputs are valid to be submitted! At the moment isFormValid is true when at least one input field is an empty string!

        originalEmployee.name.trim() == "" ||
        originalEmployee.jobTitle.trim() == "" ||
        originalEmployee.hireDate == "";
To fix this we need to change these conditions to 
        originalEmployee.name.trim() !== "" &&
        originalEmployee.jobTitle.trim() !== "" &&
        originalEmployee.hireDate !== "";
Now all values are required and form can be submitted when all values are provided!

### Bug #5: When new employee is created, employee list does NOT reload to display new user!
adding console.logs to function validateEmployeeData and notices that when I console.log the result object, it returns [object Object]!
# Console.logs within Server components are displayed in the TERMINAL!!! (Just figured that out)
TypeError : body is unusable: at addEmployee function in line 14, returning body with .text() instead of .json()!
After changing .text() with .json in the fetch endpoint!

result.success is returning false despite a successful 200 endpoint!
(REViSIT THIS ERROR!!!!!!!)

### Bug #6: Error: You provided 'value' prop to form field without an onChange handle, result in readonly input fields!
Location: components/employees/employeeDisplay.tsx

Input components within EmployeeDisplay is missing an onChange() attribute to change and save the inputs! To fix this error I created useStates to hold jobTitle and details! Inside the input tags, I changed the value prop to the state of the title/ details and added the onChange() attribute that will allow state of the two variables, title and details to change!
Changed: 
<Input value={employee.jobTitle}  />
<Input value={employee.details}  />

To:
const [jobTitle, setJobTitle] = useState(employee.jobTitle)
    const [details, setDetails] = useState(employee.details)

<Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
<Input value={details || ""} onChange={(e) => setDetails(e.target.value)} />
This fix revealed another that save edits button doesn't have a function to save our edits! In result of this revelation, I created a function to handle saving our employee info and added an onClick event to our save edits button.

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

        // call endpoint to update employee!!!
        const result = await updateEmployeeDetails(editedEmployee)
        console.log(result)
        setEdit(false);
        if(result){
            router.refresh(); // this is used to reload our page to display our fresh data!
        }
    }

### Bug #7 Error unable to update employee when clicking on update!
In the employee Form, when user click to update and modal pops up, The data for employee is empty and we receive a 400 status code, Bad Request!!
To solve the bad request, we need to pass in the id of the employee we want to change. When we call our component to update, our employee object is passed in and we can set our id right before we invoke our endpoint! I added the line
                employeeWithChanges.id = employee!.id;
to set our id to employeeWithChanges.id to the updated one! I used the ! with employee!.id to tell our compiler that this will not be undefined or null.
To have our modal populate our data we need to edit, we can go back to the EmployeeForm that was invoked when user presses the edit button. Lets add a ternary to our initialized useState for originalEmployee! if type == add, then set the employee object to empty, otherwise set our employee object to the one passed in.
The result of these changes lets us update an employee without any trouble!


### Bug where sorting isn't working:
Within our EmployeeList! our sort method is saved in the setEmployee's useState but deletedEmployees are being mapped out! My simple fix to show our sorted list of employees is to change:
    deletedEmployees.map((employee, idx) => (
To:
    employees.map((employee, idx) => (
within components/employees/EmployeeList.tsx
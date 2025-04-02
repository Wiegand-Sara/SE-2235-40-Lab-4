import { useState, useEffect } from "react";
import { addEmployee, updateEmployee } from "../api";
import { Employee } from "../types";

interface Props {
  employee?: Employee;
  onSuccess: () => void;
}

const EmployeeForm: React.FC<Props> = ({ employee, onSuccess }) => {
  const [form, setForm] = useState<Employee>({
    id: 0, firstName: "", lastName: "", groupName: "", role: "", expectedSalary: 0, expectedDateOfDefense: ""
  });

  // Sync form when editing employee
  useEffect(() => {
    if (employee) setForm(employee);
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (employee) {
      await updateEmployee(employee.id, form);
    } else {
      await addEmployee(form);
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border">
      <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" required />
      <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" required />
      <input type="text" name="groupName" value={form.groupName} onChange={handleChange} placeholder="Group Name" required />
      <input type="text" name="role" value={form.role} onChange={handleChange} placeholder="Role" required />
      <input type="number" name="expectedSalary" value={form.expectedSalary} onChange={handleChange} placeholder="Salary" required />
      <input type="date" name="expectedDateOfDefense" value={form.expectedDateOfDefense} onChange={handleChange} required />
      <button type="submit">{employee ? "Update" : "Add"}</button>
    </form>
  );
};

export default EmployeeForm;

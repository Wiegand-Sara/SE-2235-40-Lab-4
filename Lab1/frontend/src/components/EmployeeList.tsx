import { useEffect, useState } from "react";
import { fetchEmployees, deleteEmployee } from "../api";
import EmployeeForm from "./EmployeeForm";
import { Employee } from "../types";

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    refreshEmployees();
  }, []);

  const refreshEmployees = async () => {
    const data = await fetchEmployees();
    setEmployees(data);
  };

  const handleDelete = async (id: number) => {
    await deleteEmployee(id);
    refreshEmployees();
  };

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingEmployee(undefined);
    setIsEditModalOpen(false);
  };

  return (
    <div>
      <h2>Employee List</h2>
      
      {/* Add Form Always Visible */}
      <EmployeeForm onSuccess={refreshEmployees} />
      
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-3">Edit Employee</h2>
            <EmployeeForm employee={editingEmployee} onSuccess={() => {
              refreshEmployees();
              closeEditModal();
            }} />
            <button className="bg-gray-400 px-4 py-2 rounded mt-2" onClick={closeEditModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Employee Table */}
      <table className="border mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Group</th>
            <th>Role</th>
            <th>Salary</th>
            <th>Defense Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.firstName} {emp.lastName}</td>
              <td>{emp.groupName}</td>
              <td>{emp.role}</td>
              <td>{emp.expectedSalary}</td>
              <td>{emp.expectedDateOfDefense}</td>
              <td>
                <button onClick={() => openEditModal(emp)}>Edit</button>
                <button onClick={() => handleDelete(emp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;

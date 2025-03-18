import { Request, Response } from "express";

let employees = [
  { id: 1, firstName: "Alice", lastName: "Johnson", groupName: "Engineering", role: "Engineer", expectedSalary: 60000, expectedDateOfDefense: "2025-06-15" },
  { id: 2, firstName: "Bob", lastName: "Smith", groupName: "Design", role: "Designer", expectedSalary: 45000, expectedDateOfDefense: "2025-07-10" },
  { id: 3, firstName: "Charlie", lastName: "Brown", groupName: "Management", role: "Manager", expectedSalary: 70000, expectedDateOfDefense: "2025-05-20" },
  { id: 4, firstName: "David", lastName: "Wilson", groupName: "Internship", role: "Intern", expectedSalary: 30000, expectedDateOfDefense: "2025-08-01" },
  { id: 5, firstName: "Eve", lastName: "Taylor", groupName: "Human Resources", role: "HR", expectedSalary: 55000, expectedDateOfDefense: "2025-09-05" },
];

export const getEmployees = (req: Request, res: Response): void => {
  res.json(employees);
};

export const addEmployee = (req: Request, res: Response): void => {
  const newEmployee = { id: employees.length + 1, ...req.body };
  employees.push(newEmployee);
  res.status(201).json(newEmployee);
};

export const updateEmployee = (req: Request, res: Response): void => {
  const { id } = req.params;
  const index = employees.findIndex(emp => emp.id === parseInt(id));
  if (index === -1) {
    res.status(404).json({ error: "Employee not found" });
    return;
  }
  employees[index] = { ...employees[index], ...req.body };
  res.json(employees[index]);
};

export const deleteEmployee = (req: Request, res: Response): void => {
  const { id } = req.params;
  employees = employees.filter(emp => emp.id !== parseInt(id));
  res.status(204).send();
};

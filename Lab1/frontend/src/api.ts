import axios from "axios";
import { Employee } from "./types";

const API_URL = "http://localhost:5000/employees";

export const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addEmployee = async (employee: Omit<Employee, "id">) => {
  const response = await axios.post(API_URL, employee);
  return response.data;
};

export const updateEmployee = async (id: number, employee: Partial<Employee>) => {
  const response = await axios.put(`${API_URL}/${id}`, employee);
  return response.data;
};

export const deleteEmployee = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};

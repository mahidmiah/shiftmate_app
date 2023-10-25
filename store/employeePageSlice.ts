import { StateCreator } from 'zustand';

export type EmployeePageSlice = {
  employees: Employee[] | null;
  editEmployeeModalVisible: boolean;
  addEmployeeModalVisible: boolean;
  deleteEmployeeModalVisible: boolean;
  deleteEmployeeModalData: {
    firstName: string;
    lastName: string;
    id: string;
  };
  editEmployeelModalData: {
    firstName: string;
    lastName: string;
    password: string;
    id: string;
    background: string;
    foreground: string;
  };
  setEmployees: (data: Employee[]) => void;

  //Edit Modal
  setEditEmployeeModalData: (data: any) => void;
  isEditEmployeeModalVisible: boolean;
  showEditEmployeeModal: () => void;
  hideEditEmployeeModal: () => void;

  //Delete Modal
  setDeleteEmployeeModalData: (data: any) => void;
  isDeleteEmployeeModalVisible: boolean;
  showDeleteEmployeeModal: () => void;
  hideDeleteEmployeeModal: () => void;

  //Add Modal
  isAddEmployeeModalVisible: boolean;
  showAddEmployeeModal: () => void;
  hideAddEmployeeModal: () => void;
};

export const createEmployeePageSlice: StateCreator<EmployeePageSlice> = (set) => ({
  employees: null,
  editEmployeeModalVisible: false,
  addEmployeeModalVisible: false,
  deleteEmployeeModalVisible: false,
  deleteEmployeeModalData: {
    firstName: '',
    lastName: '',
    id: '',
  },
  editEmployeelModalData: {
    firstName: '',
    lastName: '',
    password: '',
    id: '',
    background: '',
    foreground: '',
  },
  setEmployees: (data: Employee[]) => set({employees: data}),

  setEditEmployeeModalData: (data:any) => set({editEmployeelModalData: data}),
  isEditEmployeeModalVisible: false,
  showEditEmployeeModal: () => set({isEditEmployeeModalVisible: true}),
  hideEditEmployeeModal: () => set({isEditEmployeeModalVisible: false}),

  setDeleteEmployeeModalData: (data:any) => set({deleteEmployeeModalData: data}),
  isDeleteEmployeeModalVisible: false,
  showDeleteEmployeeModal: () => set({isDeleteEmployeeModalVisible: true}),
  hideDeleteEmployeeModal: () => set({isDeleteEmployeeModalVisible: false}),

  isAddEmployeeModalVisible: false,
  showAddEmployeeModal: () => set({isAddEmployeeModalVisible: true}),
  hideAddEmployeeModal: () => set({isAddEmployeeModalVisible: false}),
});

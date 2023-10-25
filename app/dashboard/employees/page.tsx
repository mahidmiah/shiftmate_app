'use client'

import AddEmployeeModal from '@/components/dashboard/employees/modals/AddEmployeeModal';
import EmployeeCard from '@/components/dashboard/employees/EmployeeCard'
import DeleteEmployeeModal from '@/components/dashboard/employees/modals/DeleteEmployeeModal';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import EditEmployeeModal from '@/components/dashboard/employees/modals/EditEmployeeModal';
import { MdAdd } from 'react-icons/md';
import { AiOutlineSortAscending } from 'react-icons/ai';
import useShiftStore from '@/store/shiftStore';

function page() {

  const [isVisible, setIsVisible] = useState(false);


  // Add Employee Modal Vars
  const isAddEmployeeModalVisible = useShiftStore(state => state.isAddEmployeeModalVisible);
  const showAddEmployeeModalData = useShiftStore(state => state.showAddEmployeeModal);


  // Delete Employee Modal Vars
  const isDeleteEmployeeModalVisible = useShiftStore(state => state.isDeleteEmployeeModalVisible);

  // Edit Employee Modal Vars
  const isEditEmployeeModalVisible = useShiftStore(state => state.isEditEmployeeModalVisible);

  const [employees, setEmployees] = useState<Employee[] | undefined>();

  const getAllEmployees = async () => {
    try {
      const response = await axios.get('/api/business/employees/getallemployees');
      if(response.data.status == 200){
        setEmployees(response.data.data.employees);
      }
      else if (response.data.status == 400){
        toast.error('User not found!');
      }
    } catch (error: any) {
        toast.error(error.message);
    }
  }

  useEffect(() => {
    getAllEmployees()
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  const sortEmployees = () => {
    if (employees) {
      const sortedEmployees = [...employees]; 
      sortedEmployees.sort((a, b):any => {
        if (a !== null && b !== null){
          const firstNameA = a.firstName.toUpperCase(); 
          const firstNameB = b.firstName.toUpperCase();
          
          if (firstNameA < firstNameB) {
            return -1;
          }
          if (firstNameA > firstNameB) {
            return 1;
          }
          return 0;
        }
      });
      setEmployees(sortedEmployees); 
    }
  }
  
  return (
    <div className=''>

      {/* Top bar (add employee and sorrt buttons) */}
      <div className={`transition-opacity duration-[0.5s] ${isVisible ? 'opacity-100' : 'opacity-0'} sticky top-0 w-full h-12 widget_bg widget_border border-b px-6 lg:px-14`}>
        <div className='max-w-7xl flex justify-between gap-x-4 items-center h-12'>
          
          {/* Add employee button */}
          <button
            className='outline_button'
            onClick={showAddEmployeeModalData}
          >
            Add Employee
            <MdAdd size={20} />
          </button>

          {/* Sort employees buttons */}
          <button
            className='outline_button'
            onClick={sortEmployees}
          >
            Sort
            <AiOutlineSortAscending size={20} />
          </button>

        </div>
      </div>

      {/* Main content area */}
      <div className={`transition-opacity duration-[0.5s] ${isVisible ? 'opacity-100' : 'opacity-0'} flex flex-col gap-2 md:gap-4 px-6 py-6 lg:px-14 lg:py-12`}>
      
        {/* Rest of the employee cards */}
        {
          employees &&
          employees.map((employee) =>(
            employee !== null ?
            <EmployeeCard key={employee.id} employee={employee} position='Employee' />
            :
            null
          ))
        }
      </div>
      
      {/* All modals */}
      {
        isAddEmployeeModalVisible &&
        <AddEmployeeModal 
          getAllEmployees={getAllEmployees}
        />
      }

      {
        isDeleteEmployeeModalVisible &&
        <DeleteEmployeeModal 
          getAllEmployees={getAllEmployees} 
        />
      }

      {
        isEditEmployeeModalVisible &&
        <EditEmployeeModal 
          getAllEmployees={getAllEmployees} 
        />
      }

    </div>
  )
}

export default page
import { create } from 'zustand';
import { createGlobalSlice, GlobalSlice } from './globalSlice';
import { createEmployeePageSlice, EmployeePageSlice } from './employeePageSlice';
import { createSchedulePageSlice, SchedulePageSlice } from './schedulePageSlice';

export const useShiftStore = create<EmployeePageSlice & SchedulePageSlice & GlobalSlice>()((...a) => ({
  ...createGlobalSlice(...a),
  ...createEmployeePageSlice(...a),
  ...createSchedulePageSlice(...a),
}))

export default useShiftStore;
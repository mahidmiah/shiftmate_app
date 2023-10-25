import { StateCreator } from 'zustand';

export type SchedulePageSlice = {

  currentWeek: number;
  selectedDays: Date[];
  currentYear: number;
  currentDay: string;
  isCalendarVisible: boolean;
  isDayPickerVisible: boolean;
  scheduleUpdate: boolean;
  isAddShiftModalVisible: boolean;
  isDeleteShiftModalVisible: boolean;
  isEditShiftModalVisible: boolean;

  deleteEmployeelModalData: {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
    day: string;
    startTime: string;
    endTime: string;
  };

  editEmployeelModalData: {
    weekNumber: number;
    currentYear: number;
    employeeID: string;
    position: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    existingShiftID: string;
  };

  setCurrentWeek: (week:number) => void;
  setSelectedDays: (dates: Date[]) => void;
  setCurrentYear: (year: number) => void;
  setCurrentDay: (day: string) => void;
  triggerScheduleUpdate: (trigger:boolean) => void;
  showCalendar: () => void;
  hideCalendar: () => void;
  showAddShiftModal: () => void;
  hideAddShiftModal: () => void;
  showDayPicker: () => void;
  hideDayPicker: () => void;
  showDeleteShiftModal: () => void;
  hideDeleteShiftModal: () => void;
  setDeleteShiftModalData: (data: any) => void;
  setEditShiftModalData: (data: any) => void;
  showEditShiftModal: () => void;
  hideEditShiftModal: () => void;
};

export const createSchedulePageSlice: StateCreator<SchedulePageSlice> = (set) => ({

  currentWeek: 0,
  selectedDays: [],
  currentYear: 0,
  currentDay: 'Monday',
  isCalendarVisible: false,
  isDayPickerVisible: false,
  scheduleUpdate: false,
  isAddShiftModalVisible: false,
  isDeleteShiftModalVisible: false,
  isEditShiftModalVisible: false,

  deleteEmployeelModalData: {
    id: '',
    firstName: '',
    lastName: '',
    position: '',
    day: '',
    startTime: '',
    endTime: '',
  },

  editEmployeelModalData: {
    weekNumber: 0,
    currentYear: 0,
    employeeID: '',
    position: '',
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    existingShiftID: '',
  },

  setCurrentWeek: (week:number) => set({currentWeek: week}),
  setSelectedDays: (dates: Date[]) => set({selectedDays: dates}),
  setCurrentYear: (year: number) => set({currentYear: year}),
  setCurrentDay: (day: string) => set({currentDay: day}),
  triggerScheduleUpdate: (trigger:boolean) => set({scheduleUpdate: trigger}),
  showCalendar: () => set({isCalendarVisible: true}),
  hideCalendar: () => set({isCalendarVisible: false}),
  showAddShiftModal: () => set({isAddShiftModalVisible: true}),
  hideAddShiftModal: () => set({isAddShiftModalVisible: false}),
  showDayPicker: () => set({isDayPickerVisible: true}),
  hideDayPicker: () => set({isDayPickerVisible: false}),
  showDeleteShiftModal: () => set({isDeleteShiftModalVisible: true}),
  hideDeleteShiftModal: () => set({isDeleteShiftModalVisible: false}),
  setDeleteShiftModalData: (data:any) => set({deleteEmployeelModalData: data}),
  setEditShiftModalData: (data:any) => set({editEmployeelModalData: data}),
  showEditShiftModal: () => set({isEditShiftModalVisible: true}),
  hideEditShiftModal: () => set({isEditShiftModalVisible: false}),
});

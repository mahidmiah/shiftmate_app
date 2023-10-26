type CommonEditEmployeeModalData = {
  firstName?: string;
  lastName?: string;
  password?: string;
  id?: string;
  background?: string;
  foreground?: string;
  weekNumber?: number;
  currentYear?: number;
  employeeID?: string;
  position?: string;
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  existingShiftID?: string;
};


type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  background: string;
  foreground: string;
};

type ProfileData = {
  id: string;
  darkMode: boolean;
  businessName: string;
  businessType: string;
  logo: string | null;
  businessAddress: {
    streetLine1: string;
    streetLine2: string | null; // optional
    city: string;
    postCode: string;
  },
  email: string;
  ownerFirstName: string;
  ownerLastName: string;
}

interface UserData {
  id: string;
  businessName: string;
  businessType: string;
  logo: string;
  businessAddress: {
    streetLine1: string;
    streetLine2: string;
    city: string;
    postCode: string;
  };
  email: string;
  ownerFirstName: string;
  ownerLastName: string;
}

type formData = {
  [key: string]: number | boolean | string | null | undefined;
}

type shiftData = {
  // Used in ScheduleContainer
  [key: string]: string[] | undefined;
}

declare module 'generate-password' {
  interface GenerateOptions {
    length: number;
    numbers?: boolean;
    symbols?: boolean;
    uppercase?: boolean;
  }

  export function generate(options: GenerateOptions): string;
}
export interface SubjectAttendance {
  subject: string;
  code: string;
  conducted: number;
  attended: number;
  percentage: number;
}

export interface CieMark {
  subject: string;
  code: string;
  cie1: number;
  cie2: number;
  avgCie: number;
  assignmentStatus: 'Submitted' | 'Pending';
}

export interface StudentRecord {
  rollNo: string;
  prn: string;
  name: string;
  yearBranch: string;
  semester: string;
  overallAttendance: number;
  attendanceStatus: 'Good' | 'Average' | 'Defaulter';
  subjectAttendance: SubjectAttendance[];
  cieMarks: CieMark[];
  fees: {
    totalTution: number;
    paid: number;
    pending: number;
    status: 'Paid' | 'Partially Paid' | 'Due';
    receiptNo: string;
  };
  proctorTeacher: {
    name: string;
    designation: string;
    email: string;
    phone: string;
    cabin: string;
    visitingHours: string;
  };
  hostelResident: boolean;
  roomNo?: string;
  remarks: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  studentData?: StudentRecord | null;
  modelUsed?: string;
}

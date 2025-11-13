// API service layer for Face Recognition Attendance System
// This connects to an external FastAPI backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface FaceDetectionResult {
  name: string;
  score: number;
  box: [number, number, number, number]; // [x1, y1, x2, y2]
}

export interface RecognizeResponse {
  results: FaceDetectionResult[];
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  session_id: string;
  status: 'present' | 'absent';
  created_at: string;
}

export interface StudentAttendanceSummary {
  id: string;
  name: string;
  roll_no: string;
  present: number;
  total: number;
  percentage: number;
}

// Mock data for development without backend
const MOCK_STUDENTS = [
  { name: "Lohit Kumar", roll_no: "CS001" },
  { name: "Vineet Sharma", roll_no: "CS002" },
  { name: "Priya Singh", roll_no: "CS003" },
  { name: "Rahul Verma", roll_no: "CS004" },
  { name: "Sneha Patel", roll_no: "CS005" },
];

const USE_MOCK_DATA = true; // Toggle this when backend is ready

/**
 * Recognizes faces in an uploaded image
 * POST /recognize
 */
export async function recognizeFaces(imageFile: File): Promise<RecognizeResponse> {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock recognition results
    const numFaces = Math.floor(Math.random() * 3) + 2; // 2-4 faces
    const results: FaceDetectionResult[] = [];
    
    for (let i = 0; i < numFaces && i < MOCK_STUDENTS.length; i++) {
      results.push({
        name: MOCK_STUDENTS[i].name,
        score: parseFloat((Math.random() * 0.5 + 0.8).toFixed(2)), // 0.8-1.3
        box: [
          Math.random() * 300,
          Math.random() * 300,
          Math.random() * 150 + 150,
          Math.random() * 150 + 150,
        ] as [number, number, number, number],
      });
    }
    
    return { results };
  }

  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await fetch(`${API_BASE_URL}/recognize`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to recognize faces');
  }

  return response.json();
}

/**
 * Marks attendance for recognized students
 * POST /mark_attendance
 */
export async function markAttendance(date: string, recognizedNames: string[]): Promise<void> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Mock: Marking attendance for', recognizedNames, 'on', date);
    return;
  }

  const response = await fetch(`${API_BASE_URL}/mark_attendance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      date,
      recognized_names: recognizedNames,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to mark attendance');
  }
}

/**
 * Gets attendance summary for all students
 * GET /attendance/all
 */
export async function getAllStudentsAttendance(): Promise<StudentAttendanceSummary[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return MOCK_STUDENTS.map((student, index) => ({
      id: `student-${index + 1}`,
      name: student.name,
      roll_no: student.roll_no,
      present: Math.floor(Math.random() * 20) + 10,
      total: 30,
      percentage: parseFloat(((Math.random() * 40 + 50)).toFixed(1)),
    }));
  }

  const response = await fetch(`${API_BASE_URL}/attendance/all`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch attendance data');
  }

  return response.json();
}

/**
 * Gets attendance summary for a specific student
 * GET /attendance/{student_id}
 */
export async function getStudentAttendance(studentId: string): Promise<StudentAttendanceSummary> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockStudent = MOCK_STUDENTS[0];
    return {
      id: studentId,
      name: mockStudent.name,
      roll_no: mockStudent.roll_no,
      present: 24,
      total: 30,
      percentage: 80.0,
    };
  }

  const response = await fetch(`${API_BASE_URL}/attendance/${studentId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch student attendance');
  }

  return response.json();
}

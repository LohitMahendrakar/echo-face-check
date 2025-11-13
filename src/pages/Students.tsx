import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import AttendanceTable from "@/components/AttendanceTable";
import { getAllStudentsAttendance, StudentAttendanceSummary } from "@/services/api";
import { Loader2 } from "lucide-react";

export default function Students() {
  const [students, setStudents] = useState<StudentAttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await getAllStudentsAttendance();
      setStudents(data);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = (studentId: string) => {
    navigate(`/student/${studentId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Students</h1>
        <p className="text-muted-foreground">
          View and manage student attendance records
        </p>
      </div>

      {/* Students Table */}
      <Card className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <AttendanceTable data={students} onStudentClick={handleStudentClick} />
        )}
      </Card>
    </div>
  );
}

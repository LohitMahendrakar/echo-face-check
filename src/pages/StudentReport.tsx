import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Calendar, TrendingUp } from "lucide-react";
import { getStudentAttendance, StudentAttendanceSummary } from "@/services/api";

export default function StudentReport() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentAttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadStudent(id);
    }
  }, [id]);

  const loadStudent = async (studentId: string) => {
    try {
      const data = await getStudentAttendance(studentId);
      setStudent(data);
    } catch (error) {
      console.error('Failed to load student:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-muted-foreground">Loading student data...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Student not found</p>
          <Button onClick={() => navigate('/students')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (percentage: number) => {
    if (percentage >= 75) {
      return <Badge className="bg-success text-success-foreground">Excellent</Badge>;
    } else if (percentage >= 50) {
      return <Badge className="bg-warning text-warning-foreground">Average</Badge>;
    } else {
      return <Badge variant="destructive">Poor</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/students')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{student.name}</h1>
          <p className="text-muted-foreground">Roll No: {student.roll_no}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Student</p>
              <p className="text-xl font-bold text-foreground">{student.name}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-secondary/10">
              <Calendar className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Classes Attended</p>
              <p className="text-xl font-bold text-foreground">
                {student.present} / {student.total}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-success/10">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
              <p className="text-xl font-bold text-foreground">{student.percentage.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Attendance Details */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Attendance Overview</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span className="text-sm font-medium text-foreground">Current Status</span>
            {getStatusBadge(student.percentage)}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Present</span>
              <span className="font-medium text-foreground">{student.present} classes</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-success transition-all"
                style={{ width: `${(student.present / student.total) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Absent</span>
              <span className="font-medium text-foreground">
                {student.total - student.present} classes
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-destructive transition-all"
                style={{ width: `${((student.total - student.present) / student.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

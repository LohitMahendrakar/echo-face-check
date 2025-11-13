import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Users, Calendar as CalendarIcon, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import UploadImage from "@/components/UploadImage";
import { FaceDetectionResult, markAttendance, getAllStudentsAttendance, StudentAttendanceSummary } from "@/services/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [recognizedFaces, setRecognizedFaces] = useState<FaceDetectionResult[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [stats, setStats] = useState<StudentAttendanceSummary[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getAllStudentsAttendance();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleRecognitionComplete = (results: FaceDetectionResult[]) => {
    setRecognizedFaces(results);
  };

  const handleMarkAttendance = async () => {
    if (recognizedFaces.length === 0) {
      toast.error('No faces recognized. Please upload and recognize an image first.');
      return;
    }

    setIsMarkingAttendance(true);
    try {
      const names = recognizedFaces.map((face) => face.name);
      await markAttendance(format(selectedDate, 'yyyy-MM-dd'), names);
      toast.success(`Attendance marked for ${names.length} student(s)`);
      setRecognizedFaces([]);
      loadStats();
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      toast.error('Failed to mark attendance. Please try again.');
    } finally {
      setIsMarkingAttendance(false);
    }
  };

  const totalStudents = stats.length;
  const avgAttendance = stats.length > 0
    ? stats.reduce((sum, s) => sum + s.percentage, 0) / stats.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Upload classroom images to mark attendance automatically
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-success/10">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Attendance</p>
              <p className="text-2xl font-bold text-foreground">{avgAttendance.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-secondary/10">
              <CalendarIcon className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today's Date</p>
              <p className="text-lg font-bold text-foreground">{format(new Date(), 'MMM dd, yyyy')}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <UploadImage onRecognitionComplete={handleRecognitionComplete} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Date Selection */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Select Date</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </Card>

          {/* Recognized Faces Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Recognized Faces ({recognizedFaces.length})
            </h3>
            {recognizedFaces.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No faces recognized yet. Upload an image to begin.
              </p>
            ) : (
              <div className="space-y-2">
                {recognizedFaces.map((face, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <span className="text-sm font-medium text-foreground">{face.name}</span>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </div>
                ))}
                
                <Button
                  onClick={handleMarkAttendance}
                  disabled={isMarkingAttendance}
                  className="w-full mt-4 bg-primary hover:bg-primary/90"
                >
                  {isMarkingAttendance ? 'Marking...' : 'Mark Attendance'}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

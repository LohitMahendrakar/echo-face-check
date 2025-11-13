import { useState, useMemo } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudentAttendanceSummary } from "@/services/api";
import { cn } from "@/lib/utils";

interface AttendanceTableProps {
  data: StudentAttendanceSummary[];
  onStudentClick?: (studentId: string) => void;
}

type SortKey = 'name' | 'roll_no' | 'percentage';
type SortOrder = 'asc' | 'desc';

export default function AttendanceTable({ data, onStudentClick }: AttendanceTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(
      (student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.roll_no.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (sortKey === 'percentage') {
        aVal = a.percentage;
        bVal = b.percentage;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data, searchQuery, sortKey, sortOrder]);

  const getAttendanceBadge = (percentage: number) => {
    if (percentage >= 75) {
      return <Badge className="bg-success text-success-foreground">Excellent</Badge>;
    } else if (percentage >= 50) {
      return <Badge className="bg-warning text-warning-foreground">Average</Badge>;
    } else {
      return <Badge variant="destructive">Poor</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('roll_no')}
                  className="flex items-center gap-1 hover:bg-muted"
                >
                  Roll No
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 hover:bg-muted"
                >
                  Name
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-center">Present</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('percentage')}
                  className="flex items-center gap-1 hover:bg-muted"
                >
                  Percentage
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedData.map((student) => (
                <TableRow
                  key={student.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onStudentClick?.(student.id)}
                >
                  <TableCell className="font-medium">{student.roll_no}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell className="text-center">{student.present}</TableCell>
                  <TableCell className="text-center">{student.total}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all",
                            student.percentage >= 75
                              ? "bg-success"
                              : student.percentage >= 50
                              ? "bg-warning"
                              : "bg-destructive"
                          )}
                          style={{ width: `${student.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium min-w-[3rem]">
                        {student.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getAttendanceBadge(student.percentage)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

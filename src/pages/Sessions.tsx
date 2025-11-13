import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Session {
  id: string;
  date: string;
  attendanceCount: number;
}

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('class_sessions')
        .select('*')
        .order('date', { ascending: false });

      if (sessionsError) throw sessionsError;

      if (sessionsData) {
        const sessionsWithCount = await Promise.all(
          sessionsData.map(async (session) => {
            const { count } = await supabase
              .from('attendance')
              .select('*', { count: 'exact', head: true })
              .eq('session_id', session.id)
              .eq('status', 'present');

            return {
              id: session.id,
              date: session.date,
              attendanceCount: count || 0,
            };
          })
        );

        setSessions(sessionsWithCount);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Class Sessions</h1>
        <p className="text-muted-foreground">
          View all attendance sessions and their records
        </p>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading sessions...</div>
      ) : sessions.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No sessions yet. Mark attendance to create sessions.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <Card key={session.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {format(new Date(session.date), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(session.date), 'EEEE')}
                    </p>
                  </div>
                </div>
                <Badge className="bg-success text-success-foreground">Completed</Badge>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="text-sm">
                  {session.attendanceCount} student{session.attendanceCount !== 1 ? 's' : ''} present
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

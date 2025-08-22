import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Home,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  RefreshCcw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Room, Mission } from "@shared/api";
import { scanAndFixCorruptedText } from "@/lib/arabic-utils";
import { toast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: "", description: "" });
  const [isFixingText, setIsFixingText] = useState(false);

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    setRooms([
      {
        id: "1",
        name: "المطبخ",
        description: "منطقة الطبخ وتناول الطعام الرئيسية",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "غرفة المعيشة",
        description: "مساحة تجمع العائلة",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        name: "الحمام",
        description: "الحمام الرئيسي",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    setMissions([
      {
        id: "1",
        title: "تنظيف كاونترات المطبخ",
        description: "مسح جميع الأسطح والأجهزة",
        sectionId: "1",
        assignedToUserId: user?.id || "",
        status: "pending",
        priority: "high",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        title: "تنظيف غرفة المعيشة بالمكنسة",
        description: "تنظيف السجاد وتحت الأثاث",
        sectionId: "2",
        assignedToUserId: user?.id || "",
        status: "in_progress",
        priority: "medium",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        title: "ترتيب المخزن",
        description: "ترتيب العناصر والتحقق من تواريخ الانتهاء",
        sectionId: "1",
        assignedToUserId: user?.id || "",
        status: "completed",
        priority: "low",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  }, [user]);

  const handleCreateRoom = async () => {
    // This will be replaced with API call
    const room: Room = {
      id: Date.now().toString(),
      name: newRoom.name,
      description: newRoom.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRooms([...rooms, room]);
    setNewRoom({ name: "", description: "" });
    setIsCreateRoomOpen(false);
  };

  const handleMissionToggle = (missionId: string, completed: boolean) => {
    setMissions(
      missions.map((m) =>
        m.id === missionId
          ? {
              ...m,
              status: completed ? "completed" : "pending",
              completedAt: completed ? new Date() : undefined,
              updatedAt: new Date(),
            }
          : m,
      ),
    );
  };

  const handleFixArabicText = () => {
    setIsFixingText(true);

    setTimeout(() => {
      const result = scanAndFixCorruptedText();

      if (result.found) {
        toast({
          title: "تم إصلاح النص العربي",
          description: `تم إصلاح ${result.fixed} نص محرف بنجاح`,
        });
      } else {
        toast({
          title: "لم يتم العثور على نصوص محرفة",
          description: "جميع النصوص العربية تبدو صحيحة",
        });
      }

      setIsFixingText(false);

      // Refresh the page to reflect server-side fixes
      window.location.reload();
    }, 1000);
  };

  const getStatusIcon = (status: Mission["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500 icon-ltr" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500 icon-ltr" />;
      default:
        return <AlertCircle className="h-4 w-4 text-orange-500 icon-ltr" />;
    }
  };

  const getPriorityColor = (priority: Mission["priority"]) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      default:
        return "secondary";
    }
  };

  const getPriorityText = (priority: Mission["priority"]) => {
    switch (priority) {
      case "high":
        return "عالية";
      case "medium":
        return "متوسطة";
      default:
        return "منخفضة";
    }
  };

  const getStatusText = (status: Mission["status"]) => {
    switch (status) {
      case "completed":
        return "مكتملة";
      case "in_progress":
        return "قيد التنفيذ";
      default:
        return "في الانتظار";
    }
  };

  const completedMissions = missions.filter(
    (m) => m.status === "completed",
  ).length;
  const totalMissions = missions.length;
  const pendingMissions = missions.filter((m) => m.status === "pending").length;
  const inProgressMissions = missions.filter(
    (m) => m.status === "in_progress",
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            أهلاً بك، {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            إليك ما يحدث مع مهام التنظيف اليوم.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي المهام
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground icon-ltr" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMissions}</div>
              <p className="text-xs text-muted-foreground">
                مهام التنظيف النشطة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مكتملة</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500 icon-ltr" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {completedMissions}
              </div>
              <p className="text-xs text-muted-foreground">
                معدل الإكمال{" "}
                {totalMissions > 0
                  ? Math.round((completedMissions / totalMissions) * 100)
                  : 0}
                %
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">قيد التنفيذ</CardTitle>
              <Clock className="h-4 w-4 text-blue-500 icon-ltr" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {inProgressMissions}
              </div>
              <p className="text-xs text-muted-foreground">نشطة حالياً</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">في الانتظار</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500 icon-ltr" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {pendingMissions}
              </div>
              <p className="text-xs text-muted-foreground">في انتظار البدء</p>
            </CardContent>
          </Card>
        </div>

        {/* Rooms Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">الغرف</h2>
            {user?.role === "admin" && (
              <Dialog
                open={isCreateRoomOpen}
                onOpenChange={setIsCreateRoomOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="ml-2 h-4 w-4 icon-ltr" />
                    إضافة غرفة
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إنشاء غرفة جديدة</DialogTitle>
                    <DialogDescription>
                      أضف غرفة جديدة لتنظيم مهام التنظيف.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="room-name">اسم الغرفة</Label>
                      <Input
                        id="room-name"
                        placeholder="مثل: المطبخ، غرفة المعيشة"
                        value={newRoom.name}
                        onChange={(e) =>
                          setNewRoom({ ...newRoom, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="room-description">الوصف (اختياري)</Label>
                      <Textarea
                        id="room-description"
                        placeholder="وصف مختصر للغرفة"
                        value={newRoom.description}
                        onChange={(e) =>
                          setNewRoom({
                            ...newRoom,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateRoomOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={handleCreateRoom}
                      disabled={!newRoom.name.trim()}
                    >
                      إنشاء الغ��فة
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Link key={room.id} to={`/room/${room.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Home className="h-5 w-5 text-primary icon-ltr" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{room.name}</CardTitle>
                          {room.description && (
                            <CardDescription>
                              {room.description}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      <ChevronLeft className="h-5 w-5 text-muted-foreground rtl-flip" />
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Missions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">مهامك الأخيرة</h2>
          <div className="space-y-4">
            {missions.slice(0, 5).map((mission) => (
              <Card key={mission.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={mission.status === "completed"}
                        onCheckedChange={(checked) =>
                          handleMissionToggle(mission.id, checked as boolean)
                        }
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />
                      <div>
                        <h4
                          className={`font-medium ${mission.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                        >
                          {mission.title}
                        </h4>
                        {mission.description && (
                          <p className="text-sm text-muted-foreground">
                            {mission.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(mission.priority)}>
                        {getPriorityText(mission.priority)}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {getStatusText(mission.status)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

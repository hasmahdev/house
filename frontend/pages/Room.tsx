import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  ArrowRight,
  Home,
  AlertCircle
} from "lucide-react";
import { Room as RoomType, Section, Mission, User } from "@/types/api";

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false);
  const [isCreateMissionOpen, setIsCreateMissionOpen] = useState(false);
  const [newSection, setNewSection] = useState({ name: "" });
  const [newMission, setNewMission] = useState({
    title: "",
    sectionId: "",
    assignedToUserId: "",
    priority: "medium" as "low" | "medium" | "high",
  });

  useEffect(() => {
    fetchRoomData();
    fetchUsers();
  }, [roomId]);

  const fetchRoomData = async () => {
    try {
      const roomResponse = await fetch(`https://house-api.hasmah.xyz/api/rooms/${roomId}`);
      const roomData = await roomResponse.json();
      setRoom(roomData);

      const sectionsResponse = await fetch(`https://house-api.hasmah.xyz/api/rooms/${roomId}/sections`);
      const sectionsData = await sectionsResponse.json();
      setSections(sectionsData);

      const missionsResponse = await fetch(`https://house-api.hasmah.xyz/api/missions`);
      const missionsData = await missionsResponse.json();
      setMissions(missionsData);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://house-api.hasmah.xyz/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };


  const handleCreateSection = async () => {
    try {
      const response = await fetch("https://house-api.hasmah.xyz/api/sections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newSection.name,
          roomId: roomId || "1",
        }),
      });

      if (!response.ok) {
        throw new Error("فشل في إنشاء القسم");
      }

      const createdSection = await response.json();
      setSections([...sections, createdSection]);
      setNewSection({ name: "" });
      setIsCreateSectionOpen(false);
    } catch (error) {
      console.error("Error creating section:", error);
    }
  };

  const handleCreateMission = async () => {
    try {
      const response = await fetch("https://house-api.hasmah.xyz/api/missions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newMission.title,
          sectionId: newMission.sectionId,
          assignedToUserId: newMission.assignedToUserId,
          priority: newMission.priority,
        }),
      });

      if (!response.ok) {
        throw new Error("فشل في إنشاء المهمة");
      }

      const createdMission = await response.json();
      setMissions([...missions, createdMission]);
      setNewMission({
        title: "",
        sectionId: "",
        assignedToUserId: "",
        priority: "medium",
      });
      setIsCreateMissionOpen(false);
    } catch (error) {
      console.error("Error creating mission:", error);
    }
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

  const getUserName = (userId: string) => {
    return users.find((u) => u.id === userId)?.name || "مستخدم غير معروف";
  };

  const getMissionsForSection = (sectionId: string) => {
    return missions.filter((m) => m.sectionId === sectionId);
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

  if (!room) {
    return (
      <DashboardLayout>
        <div className="text-center">الغرفة غير موجودة</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowRight className="h-4 w-4 ml-2 rtl-flip" />
              العودة للرئيسية
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Home className="h-6 w-6 text-primary icon-ltr" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {room.name}
              </h1>
              {room.description && (
                <p className="text-muted-foreground">{room.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          {user?.role === "admin" && (
            <>
              <Dialog
                open={isCreateSectionOpen}
                onOpenChange={setIsCreateSectionOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="ml-2 h-4 w-4 icon-ltr" />
                    إضافة قسم
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إنشاء قسم جديد</DialogTitle>
                    <DialogDescription>
                      أضف قسماً جديداً لتنظيم مهام التنظيف في {room.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="section-name">اسم القسم</Label>
                      <Input
                        id="section-name"
                        placeholder="مثل: الكاونترات، الأجهزة"
                        value={newSection.name}
                        onChange={(e) =>
                          setNewSection({ ...newSection, name: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateSectionOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={handleCreateSection}
                      disabled={!newSection.name.trim()}
                    >
                      إنشاء القسم
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={isCreateMissionOpen}
                onOpenChange={setIsCreateMissionOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="ml-2 h-4 w-4 icon-ltr" />
                    إضافة مهمة
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إنشاء مهمة جديدة</DialogTitle>
                    <DialogDescription>
                      أضف مهمة تنظيف جديدة لـ {room.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mission-title">العنوان</Label>
                      <Input
                        id="mission-title"
                        placeholder="عنوان المهمة"
                        value={newMission.title}
                        onChange={(e) =>
                          setNewMission({
                            ...newMission,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mission-section">القسم</Label>
                        <Select
                          value={newMission.sectionId}
                          onValueChange={(value) =>
                            setNewMission({ ...newMission, sectionId: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر قسم" />
                          </SelectTrigger>
                          <SelectContent>
                            {sections.map((section) => (
                              <SelectItem key={section.id} value={section.id}>
                                {section.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mission-user">تعيين إلى</Label>
                        <Select
                          value={newMission.assignedToUserId}
                          onValueChange={(value) =>
                            setNewMission({
                              ...newMission,
                              assignedToUserId: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر مستخدم" />
                          </SelectTrigger>
                          <SelectContent>
                            {user?.role === "admin" && (
                              <SelectItem value={user.id}>
                                {user.name} (أنت)
                              </SelectItem>
                            )}
                            {users.map((u) => (
                              <SelectItem key={u.id} value={u.id}>
                                {u.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mission-priority">الأولوية</Label>
                      <Select
                        value={newMission.priority}
                        onValueChange={(value: "low" | "medium" | "high") =>
                          setNewMission({ ...newMission, priority: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">منخفضة</SelectItem>
                          <SelectItem value="medium">متوسطة</SelectItem>
                          <SelectItem value="high">عالية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateMissionOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={handleCreateMission}
                      disabled={
                        !newMission.title ||
                        !newMission.sectionId ||
                        !newMission.assignedToUserId
                      }
                    >
                      إنشاء المهمة
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>

        <div className="space-y-6">
          {sections.map((section) => {
            const sectionMissions = getMissionsForSection(section.id);
            return (
              <Card key={section.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{section.name}</CardTitle>
                    </div>
                    <Badge variant="outline">
                      {sectionMissions.length} مهمة
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {sectionMissions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50 icon-ltr" />
                      <p>لا توجد مهام في هذا القسم بعد</p>
                      <p className="text-sm">أضف مهمة للبدء</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sectionMissions.map((mission) => (
                        <Card
                          key={mission.id}
                          className="border-r-4 border-r-primary/20"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={mission.status === "completed"}
                                  onCheckedChange={(checked) =>
                                    handleMissionToggle(
                                      mission.id,
                                      checked as boolean,
                                    )
                                  }
                                  disabled={
                                    mission.assignedToUserId !== user?.id &&
                                    user?.role !== "admin"
                                  }
                                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                />
                                <div>
                                  <h4
                                    className={`font-medium ${mission.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                                  >
                                    {mission.title}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      {getUserName(mission.assignedToUserId)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={getPriorityColor(mission.priority)}
                                >
                                  {getPriorityText(mission.priority)}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {sections.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50 icon-ltr" />
                <h3 className="text-lg font-medium mb-2">لا توجد أقسام بعد</h3>
                <p className="text-muted-foreground mb-4">
                  أنشئ أقساماً لتنظيم مهام التنظيف في {room.name}
                </p>
                {user?.role === "admin" && (
                  <Button onClick={() => setIsCreateSectionOpen(true)}>
                    <Plus className="ml-2 h-4 w-4 icon-ltr" />
                    إنشاء أول قسم
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

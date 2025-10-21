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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Users,
  Shield,
  Trash2,
  UserPlus,
  Home,
  ArrowRight,
  Settings2,
  Zap,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { User, Mission, Room, Section } from "@shared/api";
import { Navigate } from "react-router-dom";

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Dialog states
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false);
  const [isCreateMissionOpen, setIsCreateMissionOpen] = useState(false);

  // Form states
  const [newUser, setNewUser] = useState({
    name: "",
    password: "",
    role: "member" as "admin" | "member",
  });

  // Arabic text fix states
  const [isFixingArabicText, setIsFixingArabicText] = useState(false);
  const [fixResults, setFixResults] = useState<{
    totalScanned: number;
    totalFixed: number;
    details: string[];
  } | null>(null);
  const [newRoom, setNewRoom] = useState({ name: "" });
  const [newSection, setNewSection] = useState({ name: "" });
  const [newMission, setNewMission] = useState({
    title: "",
    sectionId: "",
    assignedToUserId: "",
    priority: "medium" as "low" | "medium" | "high",
  });

  // Redirect if not admin
  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Mock data - in production, these would be API calls
  useEffect(() => {
    setUsers([
      {
        id: "1",
        name: "ماما",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "عضو العائلة",
        role: "member",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        name: "أحمد محمد",
        role: "member",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    setRooms([
      {
        id: "1",
        name: "المطبخ",
        description: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "غرفة المعيشة",
        description: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    setSections([
      {
        id: "1",
        name: "الكاونترات",
        description: "",
        roomId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "الأجهزة",
        description: "",
        roomId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    setMissions([
      {
        id: "1",
        title: "تنظيف كاونترات المطبخ",
        description: "",
        sectionId: "1",
        assignedToUserId: "2",
        status: "pending",
        priority: "high",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        title: "تنظيف غرفة المعيشة بالمكنسة",
        description: "",
        sectionId: "2",
        assignedToUserId: "3",
        status: "in_progress",
        priority: "medium",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  }, []);

  // Helper functions
  const handleCreateUser = async () => {
    const newUserData: User = {
      id: Date.now().toString(),
      name: newUser.name,
      role: newUser.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setUsers([...users, newUserData]);
    setNewUser({ name: "", password: "", role: "member" });
    setIsCreateUserOpen(false);
  };

  const handleDeleteUser = async (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId));
  };

  const handleCreateRoom = async () => {
    const room: Room = {
      id: Date.now().toString(),
      name: newRoom.name,
      description: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRooms([...rooms, room]);
    setNewRoom({ name: "" });
    setIsCreateRoomOpen(false);
  };

  const handleDeleteRoom = async (roomId: string) => {
    setRooms(rooms.filter((r) => r.id !== roomId));
    setSections(sections.filter((s) => s.roomId !== roomId));
    if (selectedRoom?.id === roomId) {
      setSelectedRoom(null);
    }
  };

  const handleCreateSection = async () => {
    if (!selectedRoom) return;
    const section: Section = {
      id: Date.now().toString(),
      name: newSection.name,
      description: "",
      roomId: selectedRoom.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSections([...sections, section]);
    setNewSection({ name: "" });
    setIsCreateSectionOpen(false);
  };

  const handleDeleteSection = async (sectionId: string) => {
    setSections(sections.filter((s) => s.id !== sectionId));
    setMissions(missions.filter((m) => m.sectionId !== sectionId));
  };

  const handleCreateMission = async () => {
    const mission: Mission = {
      id: Date.now().toString(),
      title: newMission.title,
      description: "",
      sectionId: newMission.sectionId,
      assignedToUserId: newMission.assignedToUserId,
      status: "pending",
      priority: newMission.priority,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMissions([...missions, mission]);
    setNewMission({
      title: "",
      sectionId: "",
      assignedToUserId: "",
      priority: "medium",
    });
    setIsCreateMissionOpen(false);
  };

  const handleDeleteMission = async (missionId: string) => {
    setMissions(missions.filter((m) => m.id !== missionId));
  };

  const getUserName = (userId: string) => {
    return users.find((u) => u.id === userId)?.name || "مستخدم غير معروف";
  };

  const getSectionName = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return "قسم غير معروف";
    const room = rooms.find((r) => r.id === section.roomId);
    return `${room?.name || "غرفة غير معروفة"} - ${section.name}`;
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

  const getRoomSections = (roomId: string) => {
    return sections.filter((s) => s.roomId === roomId);
  };

  const getSectionMissions = (sectionId: string) => {
    return missions.filter((m) => m.sectionId === sectionId);
  };

  // Arabic text corruption fix function
  const fixArabicTextCorruption = async () => {
    setIsFixingArabicText(true);
    setFixResults(null);

    try {
      const results = {
        totalScanned: 0,
        totalFixed: 0,
        details: [] as string[],
      };

      // Common Arabic text corruptions and their fixes
      const arabicFixes = [
        { corrupted: /\?+/g, fixed: "" }, // Remove question marks
        { corrupted: /Ù\?/g, fixed: "ال" }, // Common "al" prefix
        { corrupted: /\?\?\?/g, fixed: "المنزل" }, // House
        { corrupted: /\?\?\?\?/g, fixed: "التنظيف" }, // Cleaning
        { corrupted: /مدير النظام/g, fixed: "ماما" }, // Change admin name
      ];

      // Fix text in all DOM elements
      const fixElementText = (element: Element) => {
        if (element.nodeType === Node.TEXT_NODE) {
          const originalText = element.textContent || "";
          let fixedText = originalText;

          arabicFixes.forEach(({ corrupted, fixed }) => {
            if (corrupted.test(fixedText)) {
              fixedText = fixedText.replace(corrupted, fixed);
              results.totalFixed++;
              results.details.push(`Fixed: "${originalText}" → "${fixedText}"`);
            }
          });

          if (fixedText !== originalText) {
            element.textContent = fixedText;
          }
          results.totalScanned++;
        }

        // Recursively check child nodes
        element.childNodes.forEach(child => {
          if (child.nodeType === Node.TEXT_NODE) {
            const originalText = child.textContent || "";
            let fixedText = originalText;

            arabicFixes.forEach(({ corrupted, fixed }) => {
              if (corrupted.test(fixedText)) {
                fixedText = fixedText.replace(corrupted, fixed);
                results.totalFixed++;
                results.details.push(`Fixed: "${originalText}" → "${fixedText}"`);
              }
            });

            if (fixedText !== originalText) {
              child.textContent = fixedText;
            }
            results.totalScanned++;
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            fixElementText(child as Element);
          }
        });
      };

      // Scan entire document
      fixElementText(document.body);

      // Fix localStorage data
      Object.keys(localStorage).forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          let fixedValue = value;
          arabicFixes.forEach(({ corrupted, fixed }) => {
            if (corrupted.test(fixedValue)) {
              fixedValue = fixedValue.replace(corrupted, fixed);
              results.totalFixed++;
              results.details.push(`Fixed localStorage "${key}"`);
            }
          });
          if (fixedValue !== value) {
            localStorage.setItem(key, fixedValue);
          }
          results.totalScanned++;
        }
      });

      // Update current page data
      setUsers(prevUsers =>
        prevUsers.map(user => ({
          ...user,
          name: user.name === "مدير النظام" ? "ماما" : user.name
        }))
      );

      // Force re-render to show changes
      window.location.reload();

      setFixResults(results);
    } catch (error) {
      console.error("Error fixing Arabic text:", error);
      setFixResults({
        totalScanned: 0,
        totalFixed: 0,
        details: ["Error occurred during fixing process"],
      });
    } finally {
      setIsFixingArabicText(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary icon-ltr" />
            لوحة الإدارة
          </h1>
          <p className="text-muted-foreground">
            إدارة المستخدمين والغرف والأقسام والمهام
          </p>
        </div>

        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rooms">الغرف والأقسام</TabsTrigger>
            <TabsTrigger value="users">المستخدمين</TabsTrigger>
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rooms List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">الغرف</h2>
                  <Dialog
                    open={isCreateRoomOpen}
                    onOpenChange={setIsCreateRoomOpen}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="ml-2 h-4 w-4 icon-ltr" />
                        إضافة غرفة
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>إنشاء غرفة جديدة</DialogTitle>
                        <DialogDescription>
                          أضف غرفة جديدة لتنظيم مهام التنظيف
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
                          إنشاء الغرفة
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-3">
                  {rooms.map((room) => (
                    <Card
                      key={room.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedRoom?.id === room.id
                          ? "ring-2 ring-primary bg-primary/5"
                          : ""
                      }`}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Home className="h-4 w-4 text-primary icon-ltr" />
                            </div>
                            <div>
                              <h4 className="font-medium">{room.name}</h4>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {getRoomSections(room.id).length} قسم
                            </Badge>
                            {room.id !== "1" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2 className="h-4 w-4 icon-ltr" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      حذف الغرفة
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      هل أنت متأكد من حذف "{room.name}"؟ سيتم
                                      حذف جميع الأقسام والمهام المرتبطة بها.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="gap-2">
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteRoom(room.id)}
                                    >
                                      حذف
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Room Details */}
              <div className="space-y-4">
                {selectedRoom ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        أقسام {selectedRoom.name}
                      </h2>
                      <Dialog
                        open={isCreateSectionOpen}
                        onOpenChange={setIsCreateSectionOpen}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus className="ml-2 h-4 w-4 icon-ltr" />
                            إضافة قسم
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              إنشاء قسم جديد في {selectedRoom.name}
                            </DialogTitle>
                            <DialogDescription>
                              أضف قسماً جديداً لتنظيم مهام التنظيف
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="section-name">اسم القسم</Label>
                              <Input
                                id="section-name"
                                placeholder="مثل: الكاونترات، ��لأجهزة"
                                value={newSection.name}
                                onChange={(e) =>
                                  setNewSection({
                                    ...newSection,
                                    name: e.target.value,
                                  })
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
                    </div>

                    <div className="space-y-3">
                      {getRoomSections(selectedRoom.id).map((section) => (
                        <Card key={section.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{section.name}</h4>
                                <Badge variant="outline" className="mt-1">
                                  {getSectionMissions(section.id).length} مهمة
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Dialog
                                  open={isCreateMissionOpen}
                                  onOpenChange={setIsCreateMissionOpen}
                                >
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <Plus className="ml-2 h-4 w-4 icon-ltr" />
                                      مهمة
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        إنشاء مهمة جديدة
                                      </DialogTitle>
                                      <DialogDescription>
                                        أضف مهمة تنظيف جديدة في قسم{" "}
                                        {section.name}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="mission-title">
                                          العنوان
                                        </Label>
                                        <Input
                                          id="mission-title"
                                          placeholder="عنوان المهمة"
                                          value={newMission.title}
                                          onChange={(e) =>
                                            setNewMission({
                                              ...newMission,
                                              title: e.target.value,
                                              sectionId: section.id,
                                            })
                                          }
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="mission-user">
                                            تعيين إلى
                                          </Label>
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
                                              {users.map((user) => (
                                                <SelectItem
                                                  key={user.id}
                                                  value={user.id}
                                                >
                                                  {user.name}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="mission-priority">
                                            الأولوية
                                          </Label>
                                          <Select
                                            value={newMission.priority}
                                            onValueChange={(
                                              value: "low" | "medium" | "high",
                                            ) =>
                                              setNewMission({
                                                ...newMission,
                                                priority: value,
                                              })
                                            }
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="low">
                                                منخفضة
                                              </SelectItem>
                                              <SelectItem value="medium">
                                                متوسطة
                                              </SelectItem>
                                              <SelectItem value="high">
                                                عالية
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    </div>
                                    <DialogFooter className="gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          setIsCreateMissionOpen(false)
                                        }
                                      >
                                        إلغاء
                                      </Button>
                                      <Button
                                        onClick={handleCreateMission}
                                        disabled={
                                          !newMission.title ||
                                          !newMission.assignedToUserId
                                        }
                                      >
                                        إنشاء المهمة
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="h-4 w-4 icon-ltr" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        حذف القسم
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        هل أنت متأكد من حذف "{section.name}"؟
                                        سيتم حذف جميع المهام المرتبطة به.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="gap-2">
                                      <AlertDialogCancel>
                                        إلغاء
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteSection(section.id)
                                        }
                                      >
                                        حذف
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>

                            {/* Show missions in this section */}
                            {getSectionMissions(section.id).length > 0 && (
                              <div className="mt-3 space-y-2">
                                <h5 className="text-sm font-medium text-muted-foreground">
                                  المهام:
                                </h5>
                                {getSectionMissions(section.id).map(
                                  (mission) => (
                                    <div
                                      key={mission.id}
                                      className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                                    >
                                      <div>
                                        <span className="text-sm font-medium">
                                          {mission.title}
                                        </span>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Badge
                                            variant={getPriorityColor(
                                              mission.priority,
                                            )}
                                            className="text-xs"
                                          >
                                            {getPriorityText(mission.priority)}
                                          </Badge>
                                          <span className="text-xs text-muted-foreground">
                                            {getUserName(
                                              mission.assignedToUserId,
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <Trash2 className="h-3 w-3 icon-ltr" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              حذف المهمة
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              هل أنت متأكد من حذف "
                                              {mission.title}"؟
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter className="gap-2">
                                            <AlertDialogCancel>
                                              إلغاء
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() =>
                                                handleDeleteMission(mission.id)
                                              }
                                            >
                                              حذف
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  ),
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}

                      {getRoomSections(selectedRoom.id).length === 0 && (
                        <Card>
                          <CardContent className="p-8 text-center">
                            <Settings2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50 icon-ltr" />
                            <h3 className="text-lg font-medium mb-2">
                              لا توجد أقسام
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              أنشئ أقساماً لتنظيم مهام التنظيف في{" "}
                              {selectedRoom.name}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <ArrowRight className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50 rtl-flip" />
                      <h3 className="text-lg font-medium mb-2">اختر غرفة</h3>
                      <p className="text-muted-foreground">
                        انقر على غرفة من القائمة لإدارة أقسامها ومهامها
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                إدارة المستخدمين
              </h2>
              <Dialog
                open={isCreateUserOpen}
                onOpenChange={setIsCreateUserOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="ml-2 h-4 w-4 icon-ltr" />
                    إضافة مستخدم
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إنشاء مستخدم جديد</DialogTitle>
                    <DialogDescription>
                      أضف عضواً جديداً في العائلة إلى نظام إد��رة التنظيف
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-name">الاسم</Label>
                      <Input
                        id="user-name"
                        placeholder="الاسم الكامل"
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-password">كلمة المرور</Label>
                      <Input
                        id="user-password"
                        type="password"
                        placeholder="كلمة المرور"
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-role">الدور</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value: "admin" | "member") =>
                          setNewUser({ ...newUser, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">عضو</SelectItem>
                          <SelectItem value="admin">مدير</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateUserOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={handleCreateUser}
                      disabled={!newUser.name || !newUser.password}
                    >
                      إنشاء المستخدم
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {users.map((userData) => (
                <Card key={userData.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary icon-ltr" />
                        </div>
                        <div>
                          <h4 className="font-medium">{userData.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {
                              missions.filter(
                                (m) => m.assignedToUserId === userData.id,
                              ).length
                            }{" "}
                            مهمة مُعيّنة
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            userData.role === "admin" ? "default" : "secondary"
                          }
                        >
                          {userData.role === "admin" ? "مدير" : "عضو"}
                        </Badge>
                        {userData.id !== "1" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 icon-ltr" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  حذف المستخدم
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  هل أنت متأكد من حذف {userData.name}؟ لا يمكن
                                  التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="gap-2">
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(userData.id)}
                                >
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              نظرة عامة على النظام
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    إجمالي المستخدمين
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground icon-ltr" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {users.filter((u) => u.role === "admin").length} مدير،{" "}
                    {users.filter((u) => u.role === "member").length} عضو
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    إجمالي المهام
                  </CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground icon-ltr" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{missions.length}</div>
                  <p className="text-xs text-muted-foreground">
                    عبر جميع الغرف والأقسام
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    الغرف ��لنشطة
                  </CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground icon-ltr" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{rooms.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {sections.length} قسم إجمالي
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    معدل الإكمال
                  </CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground icon-ltr" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {missions.length > 0
                      ? Math.round(
                          (missions.filter((m) => m.status === "completed")
                            .length /
                            missions.length) *
                            100,
                        )
                      : 0}
                    %
                  </div>
                  <p className="text-xs text-muted-foreground">
                    إكمال المهام الإجمالي
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">إعدادات النظام</h2>

            <div className="grid gap-6">
              {/* Arabic Text Fix Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary icon-ltr" />
                    إصلاح النصوص العربية المُتضررة
                  </CardTitle>
                  <CardDescription>
                    يقوم هذا الأداة بمسح الموقع بالكامل وإصلاح النصوص العربية المُتضررة (علامات الاستفهام "؟")
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={fixArabicTextCorruption}
                      disabled={isFixingArabicText}
                      className="flex items-center gap-2"
                    >
                      {isFixingArabicText ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          جارٍ الإصلاح...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 icon-ltr" />
                          إصلاح النصوص العربية
                        </>
                      )}
                    </Button>

                    {fixResults && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 icon-ltr" />
                        <span className="text-sm text-green-600">
                          تم الإصلاح بنجاح
                        </span>
                      </div>
                    )}
                  </div>

                  {fixResults && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2">
                      <h4 className="font-medium">نتائج الإصلاح:</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">العناصر المفحوصة:</span>
                          <span className="font-medium mr-2">{fixResults.totalScanned}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">العناصر المُصلحة:</span>
                          <span className="font-medium mr-2">{fixResults.totalFixed}</span>
                        </div>
                      </div>

                      {fixResults.details.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-sm font-medium mb-2">تفاصيل الإصلاح:</h5>
                          <div className="max-h-32 overflow-y-auto space-y-1">
                            {fixResults.details.slice(0, 10).map((detail, index) => (
                              <div key={index} className="text-xs text-muted-foreground bg-background p-2 rounded">
                                {detail}
                              </div>
                            ))}
                            {fixResults.details.length > 10 && (
                              <div className="text-xs text-muted-foreground">
                                ...و {fixResults.details.length - 10} إصلاحات أخرى
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 icon-ltr" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium mb-1">ملاحظة مهمة:</p>
                        <p>
                          سيتم إعادة تحميل الصفحة تلقائياً بعد الإصلاح لضمان ظهور التغييرات.
                          يُنصح بعمل نسخة احتياطية قبل تشغيل هذه الأداة.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Settings Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-primary icon-ltr" />
                    إعدادات أخرى
                  </CardTitle>
                  <CardDescription>
                    إعدادات إضافية للنظام
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    سيتم إضافة المزيد من الإعدادات هنا في المستقبل.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

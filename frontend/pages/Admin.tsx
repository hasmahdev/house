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
} from "lucide-react";
import { User, Mission, Room, Section } from "@/types/api";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Admin() {
  const { user } = useAuth();
  const { t } = useTranslation();
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

  const getRoomSections = (roomId: string) => {
    return sections.filter((s) => s.roomId === roomId);
  };

  const getSectionMissions = (sectionId: string) => {
    return missions.filter((m) => m.sectionId === sectionId);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary icon-ltr" />
            {t('adminPanel')}
          </h1>
          <p className="text-muted-foreground">
            {t('manageUsersRooms')}
          </p>
        </div>

        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rooms">{t('roomsAndSections')}</TabsTrigger>
            <TabsTrigger value="users">{t('users')}</TabsTrigger>
            <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
            <TabsTrigger value="settings">{t('settings')}</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rooms List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">{t('rooms')}</h2>
                  <Dialog
                    open={isCreateRoomOpen}
                    onOpenChange={setIsCreateRoomOpen}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="ml-2 h-4 w-4 icon-ltr" />
                        {t('addRoom')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('createNewRoom')}</DialogTitle>
                        <DialogDescription>
                          {t('addNewRoomDescription')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="room-name">{t('roomName')}</Label>
                          <Input
                            id="room-name"
                            placeholder={t('roomNamePlaceholder')}
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
                          {t('cancel')}
                        </Button>
                        <Button
                          onClick={handleCreateRoom}
                          disabled={!newRoom.name.trim()}
                        >
                          {t('createRoom')}
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
                              {getRoomSections(room.id).length} {t('section')}
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
                                      {t('deleteRoom')}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {t('deleteRoomConfirmation', { roomName: room.name })}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="gap-2">
                                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteRoom(room.id)}
                                    >
                                      {t('delete')}
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
                        {t('sectionsOfRoom', { roomName: selectedRoom.name })}
                      </h2>
                      <Dialog
                        open={isCreateSectionOpen}
                        onOpenChange={setIsCreateSectionOpen}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus className="ml-2 h-4 w-4 icon-ltr" />
                            {t('addSection')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {t('createNewSectionIn', { roomName: selectedRoom.name })}
                            </DialogTitle>
                            <DialogDescription>
                              {t('addNewSectionToOrganize')}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="section-name">{t('sectionName')}</Label>
                              <Input
                                id="section-name"
                                placeholder={t('sectionNamePlaceholder')}
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
                              {t('cancel')}
                            </Button>
                            <Button
                              onClick={handleCreateSection}
                              disabled={!newSection.name.trim()}
                            >
                              {t('createSection')}
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
                                  {getSectionMissions(section.id).length} {t('mission')}
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
                                      {t('mission')}
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        {t('createNewMission')}
                                      </DialogTitle>
                                      <DialogDescription>
                                        {t('addNewMissionInSection', { sectionName: section.name })}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="mission-title">
                                          {t('title')}
                                        </Label>
                                        <Input
                                          id="mission-title"
                                          placeholder={t('missionTitlePlaceholder')}
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
                                            {t('assignTo')}
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
                                              <SelectValue placeholder={t('selectUser')} />
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
                                            {t('priority')}
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
                                                {t('low')}
                                              </SelectItem>
                                              <SelectItem value="medium">
                                                {t('medium')}
                                              </SelectItem>
                                              <SelectItem value="high">
                                                {t('high')}
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
                                        {t('cancel')}
                                      </Button>
                                      <Button
                                        onClick={handleCreateMission}
                                        disabled={
                                          !newMission.title ||
                                          !newMission.assignedToUserId
                                        }
                                      >
                                        {t('createMission')}
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
                                        {t('deleteSection')}
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        {t('deleteSectionConfirmation', { sectionName: section.name })}
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="gap-2">
                                      <AlertDialogCancel>
                                        {t('cancel')}
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteSection(section.id)
                                        }
                                      >
                                        {t('delete')}
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
                                  {t('missions')}
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
                                              {t('deleteMission')}
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              {t('deleteMissionConfirmation', { missionTitle: mission.title })}
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter className="gap-2">
                                            <AlertDialogCancel>
                                              {t('cancel')}
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() =>
                                                handleDeleteMission(mission.id)
                                              }
                                            >
                                              {t('delete')}
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
                              {t('noSections')}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              {t('createSectionsToOrganize', { roomName: selectedRoom.name })}
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
                      <h3 className="text-lg font-medium mb-2">{t('selectRoom')}</h3>
                      <p className="text-muted-foreground">
                        {t('selectRoomToManage')}
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
                {t('manageUsers')}
              </h2>
              <Dialog
                open={isCreateUserOpen}
                onOpenChange={setIsCreateUserOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="ml-2 h-4 w-4 icon-ltr" />
                    {t('addUser')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('createNewUser')}</DialogTitle>
                    <DialogDescription>
                      {t('addNewFamilyMember')}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-name">{t('name')}</Label>
                      <Input
                        id="user-name"
                        placeholder={t('fullName')}
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-password">{t('password')}</Label>
                      <Input
                        id="user-password"
                        type="password"
                        placeholder={t('password')}
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-role">{t('role')}</Label>
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
                          <SelectItem value="member">{t('member')}</SelectItem>
                          <SelectItem value="admin">{t('admin')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateUserOpen(false)}
                    >
                      {t('cancel')}
                    </Button>
                    <Button
                      onClick={handleCreateUser}
                      disabled={!newUser.name || !newUser.password}
                    >
                      {t('createMember')}
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
                            {t('assignedMissions')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            userData.role === "admin" ? "default" : "secondary"
                          }
                        >
                          {userData.role === "admin" ? t('admin') : t('member')}
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
                                  {t('deleteUser')}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('deleteUserConfirmation', { userName: userData.name })}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="gap-2">
                                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(userData.id)}
                                >
                                  {t('delete')}
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
              {t('systemOverview')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('totalUsers')}
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground icon-ltr" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {t('adminsAndMembers', { adminCount: users.filter((u) => u.role === "admin").length, memberCount: users.filter((u) => u.role === "member").length })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('totalMissionsInSystem')}
                  </CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground icon-ltr" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{missions.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {t('acrossAllRooms')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('activeRooms')}
                  </CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground icon-ltr" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{rooms.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {t('totalSections', { sectionCount: sections.length })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('completionRate')}
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
                    {t('overallCompletionRate')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">{t('systemSettings')}</h2>

            <div className="grid gap-6">
              {/* Additional Settings Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-primary icon-ltr" />
                    {t('otherSettings')}
                  </CardTitle>
                  <CardDescription>
                    {t('additionalSystemSettings')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t('moreSettingsComing')}
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

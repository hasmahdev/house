import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Home,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Room, Mission } from "@/types/api";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: "" });
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsResponse, missionsResponse] = await Promise.all([
          fetch("https://house-api.hasmah.xyz/api/rooms"),
          fetch("https://house-api.hasmah.xyz/api/missions"),
        ]);

        const roomsData = await roomsResponse.json();
        const missionsData = await missionsResponse.json();

        if (Array.isArray(roomsData)) {
          setRooms(roomsData);
        } else {
          console.error("Fetched rooms data is not an array:", roomsData);
          setRooms([]);
        }

        if (Array.isArray(missionsData)) {
          const userMissions = missionsData.filter(m => m.assignedToUserId === user?.id);
          setMissions(userMissions);
        } else {
          console.error("Fetched missions data is not an array:", missionsData);
          setMissions([]);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setRooms([]);
        setMissions([]);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const handleCreateRoom = async () => {
    // This will be replaced with API call
    const room: Room = {
      id: Date.now().toString(),
      name: newRoom.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRooms([...rooms, room]);
    setNewRoom({ name: "" });
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
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t('welcomeUser', { name: user?.name })}
            </h1>
            <p className="text-muted-foreground">
              {t('whatsHappening')}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('totalMissions')}
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground icon-ltr" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMissions}</div>
              <p className="text-xs text-muted-foreground">
                {t('activeCleaningMissions')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('completed')}</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500 icon-ltr" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {completedMissions}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('completionRate')}{" "}
                {totalMissions > 0
                  ? Math.round((completedMissions / totalMissions) * 100)
                  : 0}
                %
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('inProgress')}</CardTitle>
              <Clock className="h-4 w-4 text-blue-500 icon-ltr" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {inProgressMissions}
              </div>
              <p className="text-xs text-muted-foreground">{t('currentlyActive')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('pending')}</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500 icon-ltr" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {pendingMissions}
              </div>
              <p className="text-xs text-muted-foreground">{t('waitingToStart')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Rooms Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">{t('rooms')}</h2>
            {user?.role === "admin" && (
              <Dialog
                open={isCreateRoomOpen}
                onOpenChange={setIsCreateRoomOpen}
              >
                <DialogTrigger asChild>
                  <Button>
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
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(rooms) && rooms.map((room) => (
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
          <h2 className="text-2xl font-bold text-foreground">{t('yourRecentMissions')}</h2>
          <div className="space-y-4">
            {Array.isArray(missions) && missions.slice(0, 5).map((mission) => (
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

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, Calendar, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
  });

  const handleSave = async () => {
    // This would be an API call in production
    console.log("Saving profile:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center">المستخدم غير موجود</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('profile')}</h1>
          <p className="text-muted-foreground">
            {t('manageAccountSettings')}
          </p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {user.name?.charAt(0).toUpperCase() || "م"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    <Shield className="h-3 w-3 ml-1 icon-ltr" />
                    {user.role === "admin" ? t('admin') : t('member')}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('accountInformation')}</CardTitle>
              <CardDescription>{t('updateYourProfile')}</CardDescription>
            </div>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Settings className="ml-2 h-4 w-4 icon-ltr" />
                {t('edit')}
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('fullName')}</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">{user.name}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('role')}</Label>
              <div className="p-2 bg-muted rounded-md">
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                >
                  <Shield className="h-3 w-3 ml-1 icon-ltr" />
                  {user.role === "admin" ? t('admin') : t('member')}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('memberSince')}</Label>
              <div className="p-2 bg-muted rounded-md flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground icon-ltr" />
                {new Date(user.createdAt).toLocaleDateString("ar-EG")}
              </div>
            </div>

            {isEditing && (
              <>
                <Separator />
                <div className="flex gap-2">
                  <Button onClick={handleSave}>{t('saveChanges')}</Button>
                  <Button variant="outline" onClick={handleCancel}>
                    {t('cancel')}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('yourActivity')}</CardTitle>
            <CardDescription>{t('yourCleaningStats')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-accent/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-sm text-muted-foreground">{t('completedMissions')}</div>
              </div>
              <div className="text-center p-4 bg-accent/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">3</div>
                <div className="text-sm text-muted-foreground">{t('inProgressMissions')}</div>
              </div>
              <div className="text-center p-4 bg-accent/50 rounded-lg">
                <div className="text-2xl font-bold text-orange-500">5</div>
                <div className="text-sm text-muted-foreground">{t('pendingMissions')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('security')}</CardTitle>
            <CardDescription>{t('manageAccountSecurity')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('password')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('lastUpdated')}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  {t('changePassword')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Home, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User } from "@/types/api";

export default function Login() {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", password: "", role: "member" as "admin" | "member" });
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users");
        const userData = await response.json();
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.password) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    setIsCreatingUser(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطأ في إنشاء المستخدم");
      }

      const createdUser = await response.json();
      setUsers([...users, createdUser]);
      setNewUser({ name: "", password: "", role: "member" });
      setShowCreateUser(false);
      setSelectedUserId(createdUser.id);
    } catch (error: any) {
      setError(error.message || "خطأ في إنشاء المستخدم");
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError("يرجى اختيار مستخدم");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const selectedUser = users.find((u) => u.id === selectedUserId);
      if (!selectedUser) {
        throw new Error("المستخدم غير موجود");
      }

      await login({ userId: selectedUser.id, password });
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message || "كلمة المرور غير صحيحة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/20 to-secondary/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Home className="h-6 w-6 text-primary-foreground icon-ltr" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">بيت نظيف</h1>
          </div>
          <p className="text-muted-foreground">
            إدارة مهام تنظيف المنزل بسهولة
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">تسجيل الدخول</CardTitle>
            <CardDescription className="text-center">
              اختر المستخدم وأدخل كلمة المرور للوصول إلى لوحة التحكم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-select">اختيار المستخدم</Label>
                <Select
                  value={selectedUserId}
                  onValueChange={setSelectedUserId}
                >
                  <SelectTrigger id="user-select">
                    <SelectValue placeholder="اختر مستخدم..." />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <span>{user.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({user.role === "admin" ? "مدير" : "عضو"})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="text-destructive text-sm text-center p-2 bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !selectedUserId}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin icon-ltr" />
                    جارٍ تسجيل الدخول...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t">
              <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
                    <UserPlus className="mr-2 h-4 w-4 icon-ltr" />
                    إنشاء عضو جديد
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إنشاء عضو جديد</DialogTitle>
                    <DialogDescription>
                      أضف عضواً جديداً للعائلة لتسجيل الدخول والمشاركة في مهام التنظيف.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-user-name">الاسم</Label>
                      <Input
                        id="new-user-name"
                        placeholder="اسم العضو الجديد"
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        }
                        required
                        disabled={isCreatingUser}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-user-password">كلمة المرور</Label>
                      <Input
                        id="new-user-password"
                        type="password"
                        placeholder="كلمة المرور"
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
                        required
                        disabled={isCreatingUser}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-user-role">الدور</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value: "admin" | "member") =>
                          setNewUser({ ...newUser, role: value })
                        }
                        disabled={isCreatingUser}
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
                    <DialogFooter className="gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreateUser(false)}
                        disabled={isCreatingUser}
                      >
                        إلغاء
                      </Button>
                      <Button
                        type="submit"
                        disabled={isCreatingUser || !newUser.name || !newUser.password}
                      >
                        {isCreatingUser ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin icon-ltr" />
                            جارٍ الإنشاء...
                          </>
                        ) : (
                          "إنشاء العضو"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}

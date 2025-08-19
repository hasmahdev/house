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
import { Loader2, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User } from "@shared/api";

export default function Login() {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Fetch available users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const userData = await response.json();
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
        // Fallback to default admin user
        setUsers([
          {
            id: "1",
            name: "مدير النظام",
            role: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      }
    };

    fetchUsers();
  }, []);

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
    } catch (error) {
      setError("كل��ة المرور غير صحيحة");
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
                    <Loader2 className="ml-2 h-4 w-4 animate-spin icon-ltr" />
                    جارٍ تسجيل الدخول...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="text-sm text-muted-foreground">
                حسابات تجريبية:
              </div>
              <div className="mt-2 space-y-1 text-xs">
                <div className="text-muted-foreground">
                  مدير النظام: admin123
                </div>
                <div className="text-muted-foreground">عضو: member123</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

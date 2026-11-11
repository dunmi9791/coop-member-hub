import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import api from "@/hooks/api";
import { UserContext } from "@/hooks/AuthContext";
import { toast } from "sonner";
import nlngLogo from "@/assets/nlng_logo.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setCredentials } = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const payload = {
      jsonrpc: "2.0",
      method: "call",
      params: {
        db: "ngml_corp",
        login: email,
        password: password,
        context: {},
      },
    };

    try {
      const resp = await api.post("/web/session/authenticate", payload, {
        withCredentials: true,
      });

      if (resp.data?.result && resp.data.result.uid) {
        sessionStorage.setItem("user", JSON.stringify(resp.data.result));
        const sessionInfo = {
          session_id: resp.data.result.session_id,
          uid: resp.data.result.uid,
          db: resp.data.result.db,
          user_context: resp.data.result.user_context,
          name: resp.data.result.name,
          username: resp.data.result.username,
        };
        sessionStorage.setItem("session_info", JSON.stringify(sessionInfo));
        setCredentials(resp.data.result);
        navigate("/dashboard");
      } else {
        const errorMessage =
          resp.data?.error?.data?.message ||
          resp.data?.error?.message ||
          "Invalid email or password. Please try again.";
        setError(errorMessage);
        toast(errorMessage);
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      let errorMessage = "An error occurred during login. Please try again.";
      if (error?.response?.status === 400) {
        errorMessage =
          error.response.data.message ||
          "Invalid credentials. Please check your email and password.";
      } else if (error?.message) {
        errorMessage = error.message.includes("Network Error")
          ? "Network error. Please check your connection and try again."
          : error.message;
      }
      setError(errorMessage);
      toast(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full border-2 border-white/30" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full border-2 border-white/20" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full border border-white/20" />
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-md">
          <div className="bg-white rounded-3xl p-6 w-36 h-36 mx-auto flex items-center justify-center shadow-lg">
            <img src={nlngLogo} alt="NLNG COOP Logo" className="w-28 h-28 object-contain" />
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-white leading-tight">
              NLNG Staff Cooperative
            </h1>
            <p className="text-lg text-white/80 font-medium">
              Investment & Credit Society Limited
            </p>
          </div>
          <div className="w-16 h-0.5 bg-accent mx-auto rounded-full" />
          <p className="text-white/70 text-sm leading-relaxed">
            Empowering members through cooperative savings, investments, and credit facilities for a brighter financial future.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-background p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center space-y-3">
            <div className="bg-white rounded-2xl p-4 w-24 h-24 flex items-center justify-center shadow-card">
              <img src={nlngLogo} alt="NLNG COOP Logo" className="w-20 h-20 object-contain" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">NLNG Staff Cooperative</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to your cooperative account</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                required
                className="h-12 rounded-xl bg-muted/50 border-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  required
                  className="h-12 rounded-xl bg-muted/50 border-border pr-12 focus:border-primary"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-10 w-10 p-0 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="flex items-center space-x-2 text-sm cursor-pointer">
                <input type="checkbox" className="rounded border-input accent-primary" />
                <span className="text-muted-foreground">Remember me</span>
              </Label>
              <Button variant="link" className="px-0 font-medium text-sm text-primary">
                Forgot password?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-primary text-lg font-semibold shadow-elevated hover:opacity-95 transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" className="px-0 font-medium text-primary">
              Contact your cooperative
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

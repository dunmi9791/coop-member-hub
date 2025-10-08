import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";
import api from "@/hooks/api";
import { UserContext } from "@/hooks/AuthContext";
import { toast } from "sonner";

// Using placeholder for logo - you can upload your NLNG COOP logo to src/assets/

// const DEMO_CREDENTIALS = [
//   { email: "member@nlng.coop", password: "demo123", role: "Member" },
//   { email: "admin@nlng.coop", password: "admin123", role: "Admin" },
//   { email: "officer@nlng.coop", password: "officer123", role: "Loan Officer" }
// ];

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const {setCredentials} =useContext(UserContext)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const payload ={
    jsonrpc: "2.0",
    method: "call",
    params: {
        db: "ngml_corp",
        login: email, 
        password: password,
        context: {}
    }
}
    try {
      const resp = await api.post('web/session/authenticate', payload)
      console.log(resp)
      sessionStorage.setItem('user', JSON.stringify(resp.data));
      navigate('/');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false)
        if (error?.response?.status === 400) {
        toast(error.response.data.message)
      }else if (error) {
        toast(error.message)
      }
    }
    // // Check demo credentials
    // const user = DEMO_CREDENTIALS.find(
    //   cred => cred.email === email && cred.password === password
    // );
    
        // Store user info in localStorage for demo purposes
       
  };

  // const fillDemoCredentials = (credentials: typeof DEMO_CREDENTIALS[0]) => {
  //   setEmail(credentials.email);
  //   setPassword(credentials.password);
  //   setError("");
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-background p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">NLNG</span>
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to your cooperative account
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* <div className="mb-6">
            <Alert>
              <AlertDescription>
                <strong>Demo Credentials:</strong>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {DEMO_CREDENTIALS.map((cred, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-xs h-8"
                      onClick={() => fillDemoCredentials(cred)}
                    >
                      {cred.role}: {cred.email}
                    </Button>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          </div>*/}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
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
                <input type="checkbox" className="rounded border-input" />
                <span>Remember me</span>
              </Label>
              <Button variant="link" className="px-0 font-normal text-sm">
                Forgot password?
              </Button>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-primary"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button variant="link" className="px-0 font-normal">
                Contact your cooperative
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
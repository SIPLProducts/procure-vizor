import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { z } from "zod";
import sharviLogo from "@/assets/sharvi-logo.png";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setIsLoading(false);

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error(error.message);
      }
      return;
    }

    toast.success("Welcome back!");
    navigate("/");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = signupSchema.safeParse({ 
      fullName: signupName, 
      email: signupEmail, 
      password: signupPassword 
    });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(signupEmail, signupPassword, signupName);
    setIsLoading(false);

    if (error) {
      if (error.message.includes("User already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
        setActiveTab("login");
      } else {
        toast.error(error.message);
      }
      return;
    }

    toast.success("Account created successfully! Welcome aboard.");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding with vibrant gradient */}
      <div 
        className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(160 60% 8%) 0%, hsl(180 50% 12%) 30%, hsl(45 60% 15%) 60%, hsl(350 50% 18%) 100%)'
        }}
      >
        {/* Vibrant animated background elements - DICABS colors */}
        <div className="absolute inset-0">
          {/* Green glow - top left */}
          <div 
            className="absolute top-10 left-10 w-80 h-80 rounded-full blur-[100px] animate-pulse"
            style={{ background: 'hsl(150 70% 45% / 0.4)' }}
          />
          {/* Yellow/Gold glow - center */}
          <div 
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[120px] animate-pulse"
            style={{ background: 'hsl(45 90% 50% / 0.35)', animationDelay: '0.5s' }}
          />
          {/* Red glow - bottom right */}
          <div 
            className="absolute bottom-20 right-10 w-72 h-72 rounded-full blur-[100px] animate-pulse"
            style={{ background: 'hsl(0 70% 50% / 0.35)', animationDelay: '1s' }}
          />
          {/* Teal accent - bottom left */}
          <div 
            className="absolute bottom-40 left-20 w-64 h-64 rounded-full blur-[80px] animate-pulse"
            style={{ background: 'hsl(180 60% 40% / 0.3)', animationDelay: '1.5s' }}
          />
        </div>

        {/* Geometric pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(30deg, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(150deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Diagonal accent lines */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 -left-20 w-[200%] h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent transform rotate-12" />
          <div className="absolute top-1/4 -left-20 w-[200%] h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent transform -rotate-6" />
          <div className="absolute top-2/3 -left-20 w-[200%] h-px bg-gradient-to-r from-transparent via-red-400 to-transparent transform rotate-3" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          <div className="mb-10">
            <div className="inline-block bg-white/95 backdrop-blur-sm rounded-xl px-6 py-4 shadow-2xl">
              <img src={sharviLogo} alt="Sharvi Infotech Logo" className="h-16 object-contain" />
            </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Streamline Your<br />
            <span 
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, hsl(150 70% 55%), hsl(45 90% 55%), hsl(0 70% 55%))' }}
            >
              Procurement Process
            </span>
          </h2>

          <p className="text-lg text-white/75 max-w-md mb-10 leading-relaxed">
            Manage vendors, track shipments, control inventory, and optimize your supply chain — all in one powerful platform.
          </p>

          {/* Feature highlights with colorful dots */}
          <div className="space-y-4">
            {[
              { text: "Real-time inventory tracking", color: "hsl(150 70% 50%)" },
              { text: "Automated RFQ management", color: "hsl(180 60% 45%)" },
              { text: "Vendor performance analytics", color: "hsl(45 90% 55%)" },
              { text: "Gate entry & weighbridge integration", color: "hsl(0 70% 55%)" }
            ].map((feature, index) => (
              <div 
                key={feature.text} 
                className="flex items-center gap-3 text-white/85 group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full shadow-lg transition-transform group-hover:scale-125"
                  style={{ background: feature.color, boxShadow: `0 0 12px ${feature.color}` }}
                />
                <span className="text-sm font-medium tracking-wide">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gradient line */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, hsl(150 70% 45%), hsl(45 90% 55%), hsl(0 70% 50%))' }}
        />
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-background via-background to-muted/30">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <img src={sharviLogo} alt="Sharvi Infotech Logo" className="h-14 object-contain" />
          </div>

          <Card className="border-border/50 shadow-2xl shadow-black/10 bg-card/95 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold">
                {activeTab === "login" ? "Welcome back" : "Create an account"}
              </CardTitle>
              <CardDescription>
                {activeTab === "login" 
                  ? "Enter your credentials to access your account" 
                  : "Get started with your procurement journey"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-muted/60">
                  <TabsTrigger value="login" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="name@company.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="John Doe"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="name@company.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

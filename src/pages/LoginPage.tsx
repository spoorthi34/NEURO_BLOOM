import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Store user for demo
    localStorage.setItem("drbloom_user", JSON.stringify({ name: "Student", email }));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-20">
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-background/80" />

      {/* Top Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 transition-all"
        >
          ← Back to Home
        </button>
      </div>

      <div className="glass-card p-8 sm:p-10 w-full max-w-md relative z-10 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Dr.Bloom" className="h-14 w-14 mb-3" />
          <h1 className="font-display text-2xl font-bold gradient-text">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to continue learning</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-muted/50 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            required
          />
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-muted/50 border border-white/10 rounded-xl px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              required
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-3.5 text-muted-foreground">
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button type="submit" className="gradient-btn w-full">Login</button>
        </form>

        <div className="mt-4">
          <button className="w-full glass-card py-3 text-sm font-medium text-foreground hover:border-white/20 transition-all">
            Continue with Google
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

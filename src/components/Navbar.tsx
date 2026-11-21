import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "About Us", href: "#about" },
    { label: "Contact Us", href: "#contact" },
  ];

  const handleNav = (link: { label: string; href: string }) => {
    setIsOpen(false);
    const el = document.querySelector(link.href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src={logo} alt="Dr.Bloom Logo" className="h-10 w-10 object-contain group-hover:scale-105 transition-transform" />
          <span className="font-display font-bold text-xl gradient-text">Dr.Bloom</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 transition-colors"
          >
            Dashboard
          </button>
          <button onClick={() => navigate("/login")} className="gradient-btn text-sm px-5 py-2">
            Login
          </button>
        </div>

        <button className="md:hidden text-foreground p-1" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background/95 border-t border-white/10 p-4 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link)}
              className="block w-full text-left text-sm text-muted-foreground hover:text-foreground py-2"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => { setIsOpen(false); navigate("/dashboard"); }}
              className="glass-card text-sm w-full py-2.5 font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={() => { setIsOpen(false); navigate("/login"); }}
              className="gradient-btn text-sm w-full py-2.5"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

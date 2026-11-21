import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="border-t border-white/5 py-8">
    <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Dr.Bloom" className="h-8 w-8" />
        <span className="font-display font-semibold gradient-text">Dr.Bloom</span>
      </div>
      <p className="text-sm text-muted-foreground">© 2026 Dr.Bloom. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;

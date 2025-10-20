import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import heroImage from "@/assets/cooperative-hero.jpg";

interface DashboardHeaderProps {
  memberName: string;
  membershipId: string;
}

const today = new Date()
export function DashboardHeader({ memberName, membershipId }: DashboardHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-primary text-primary-foreground mb-8">
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="relative p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-4 ring-white/20">
              <AvatarFallback className="bg-white/20 text-lg font-semibold">
                {memberName?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {memberName}</h1>
              <p className="text-primary-foreground/80">Member ID: {membershipId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/20 relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full"></span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/20"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-primary-foreground/70 text-sm">Member Since</p>
            <p className="text-lg font-semibold">January 2020</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-primary-foreground/70 text-sm">Last Contribution</p>
            <p className="text-lg font-semibold">₦50,000</p>
            <span>25/08/2025</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-primary-foreground/70 text-sm">Role</p>
            <p className="text-lg font-semibold">Accountant</p>
          </div>
        </div>
      </div>
    </div>
  );
}
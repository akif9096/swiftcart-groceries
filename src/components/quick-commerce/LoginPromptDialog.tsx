import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogIn, User } from "lucide-react";

interface LoginPromptDialogProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export const LoginPromptDialog = ({ open, onClose, onLogin }: LoginPromptDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-sm rounded-3xl bg-card border-border">
        <AlertDialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <AlertDialogTitle className="text-xl font-bold text-foreground">
            Login Required
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Please login or create an account to proceed with checkout. It only takes a minute!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <AlertDialogAction
            onClick={onLogin}
            className="w-full gradient-primary text-primary-foreground py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Login / Sign Up
          </AlertDialogAction>
          <AlertDialogCancel 
            onClick={onClose}
            className="w-full bg-muted text-muted-foreground py-3 rounded-xl font-medium border-0"
          >
            Continue Shopping
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

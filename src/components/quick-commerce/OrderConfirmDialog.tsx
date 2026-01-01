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
import { ShoppingBag, MapPin, CreditCard } from "lucide-react";
import { Address } from "./types";

interface OrderConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalAmount: number;
  itemCount: number;
  address: Address | null;
  paymentMethod: string;
}

export const OrderConfirmDialog = ({ 
  open, 
  onClose, 
  onConfirm,
  totalAmount,
  itemCount,
  address,
  paymentMethod
}: OrderConfirmDialogProps) => {
  const paymentLabels: Record<string, string> = {
    upi: 'UPI',
    card: 'Card',
    cod: 'Cash on Delivery'
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-sm rounded-3xl bg-card border-border">
        <AlertDialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8 text-success" />
          </div>
          <AlertDialogTitle className="text-xl font-bold text-foreground">
            Confirm Your Order
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-muted-foreground space-y-3 mt-4">
              <div className="bg-muted/50 rounded-xl p-3 text-left">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                  {itemCount} item{itemCount !== 1 ? 's' : ''} • ₹{totalAmount}
                </div>
                
                {address && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                    <span className="line-clamp-2">{address.label}: {address.address}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  {paymentLabels[paymentMethod] || paymentMethod}
                </div>
              </div>
              <p className="text-xs">By placing this order, you agree to our terms and conditions.</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col mt-4">
          <AlertDialogAction
            onClick={onConfirm}
            className="w-full gradient-primary text-primary-foreground py-3 rounded-xl font-bold"
          >
            Confirm & Pay ₹{totalAmount}
          </AlertDialogAction>
          <AlertDialogCancel 
            onClick={onClose}
            className="w-full bg-muted text-muted-foreground py-3 rounded-xl font-medium border-0"
          >
            Review Order
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

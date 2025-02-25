// components/subscription/SyncDialog.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCcw, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SyncProductsResponse } from "@/app/api/external/omnigateway/types/stripe-products";

interface SyncDialogProps {
  open: boolean;
  onClose: () => void;
  onSync: () => Promise<SyncProductsResponse | undefined>;
}

export function SyncDialog({ open, onClose, onSync }: SyncDialogProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [result, setResult] = useState<SyncProductsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      setError(null);
      const result = await onSync();
      if (result) {
        setResult(result);
      }
    } catch (error) {
      setError('Failed to sync products. Please try again.');
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sync Products from Stripe</DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {result ? (
            <div className="space-y-4">
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-700">Sync Successful</AlertTitle>
                <AlertDescription>
                  Your products and prices have been synchronized with Stripe.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-50 p-4 rounded-md border">
                  <div className="text-2xl font-bold">{result.productsCount}</div>
                  <div className="text-sm text-muted-foreground">Products Synced</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-md border">
                  <div className="text-2xl font-bold">{result.pricesCount}</div>
                  <div className="text-sm text-muted-foreground">Prices Synced</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <RefreshCcw className={`h-16 w-16 mx-auto text-primary ${isSyncing ? 'animate-spin' : ''}`} />
              
              <div>
                {isSyncing ? (
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Syncing in Progress</h3>
                    <p className="text-sm text-muted-foreground">
                      Please wait while we sync your products and prices from Stripe...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Sync Products from Stripe</h3>
                    <p className="text-sm text-muted-foreground">
                      This will import all products and pricing plans from your connected Stripe account.
                      Only products with your configured prefix will be imported.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSyncing}>
            {result ? 'Close' : 'Cancel'}
          </Button>
          
          {!result && (
            <Button onClick={handleSync} disabled={isSyncing}>
              {isSyncing ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Sync Products
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
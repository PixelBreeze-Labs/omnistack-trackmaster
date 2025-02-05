// FeedbackModal.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  User, 
  Store, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Mail, 
  MessageSquare, 
  CreditCard,
  Phone 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const getRatingStars = (rating: number) => {
  const normalizedRating = Math.round((rating / 10) * 5); // Convert 10-point to 5 stars
  return (
    <div className="flex items-center gap-1">
      {Array(5).fill(0).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < normalizedRating 
              ? "text-yellow-500 fill-yellow-500" 
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium">
        {rating}/10
      </span>
    </div>
  );
};
export function FeedbackModal({ isOpen, onClose, feedback }) {
  if (!feedback) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Feedback Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <User className="h-4 w-4 mr-2" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">{feedback?.customer.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{feedback?.customer.email}</span>
              </div>
              {feedback?.customer.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{feedback?.customer.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Visit Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Store className="h-4 w-4 mr-2" />
                Visit Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(feedback?.visit_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline">{feedback?.store?.name}</Badge>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Purchase:</span>
                  <Badge variant={feedback?.purchase?.amount ? "success" : "secondary"}>
                    {feedback?.purchase?.amount ? `${feedback?.purchase?.amount} ALL` : 'No Purchase'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Product Found:</span>
                  <Badge variant={feedback?.purchase?.found_product ? "outline" : "secondary"}>
                    {feedback?.purchase?.found_product ? "Found Product" : "Didn't Find Product"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Would Recommend:</span>
                  <Badge variant={feedback?.would_recommend ? "success" : "destructive"}>
                    {feedback?.would_recommend ? "Would Recommend" : "Wouldn't Recommend"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ratings */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Star className="h-4 w-4 mr-2" />
                Ratings
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-muted-foreground">Overall</span>
                  {getRatingStars(feedback?.ratings?.overall)}
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Product</span>
                  {getRatingStars(feedback?.ratings?.product)}
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Staff Knowledge</span>
                  {getRatingStars(feedback?.ratings?.staff_knowledge)}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-muted-foreground">Staff Friendliness</span>
                  {getRatingStars(feedback?.ratings?.staff_friendliness)}
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Cleanliness</span>
                  {getRatingStars(feedback?.ratings?.cleanliness)}
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Value</span>
                  {getRatingStars(feedback?.ratings?.value)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback */}
          {(feedback?.feedback?.product || feedback?.feedback?.service || feedback?.feedback?.improvements) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Feedback Comments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedback?.feedback?.product && (
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Product Feedback</span>
                    <p className="text-sm bg-muted p-3 rounded-md">{feedback?.feedback?.product}</p>
                  </div>
                )}
                {feedback?.feedback?.service && (
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Service Feedback</span>
                    <p className="text-sm bg-muted p-3 rounded-md">{feedback?.feedback?.service}</p>
                  </div>
                )}
                {feedback?.feedback?.improvements && (
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Suggestions</span>
                    <p className="text-sm bg-muted p-3 rounded-md">{feedback?.feedback?.improvements}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
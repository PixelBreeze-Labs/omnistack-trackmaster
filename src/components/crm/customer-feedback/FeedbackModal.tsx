"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: any; // Replace 'any' with a proper type if available
}

export function FeedbackModal({ isOpen, onClose, feedback }: FeedbackModalProps) {
  if (!isOpen) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Feedback Detail</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <strong>Customer ID:</strong> {feedback.customer_id || "N/A"}
          </div>
          <div>
            <strong>Store ID:</strong> {feedback.store_id || "Static Store"}
          </div>
          <div>
            <strong>Sales Associate ID:</strong> {feedback.sales_associate_id || "Static Associate"}
          </div>
          <div>
            <strong>Visit Date:</strong> {new Date(feedback.visit_date).toLocaleDateString()}
          </div>
          <div>
            <strong>Overall Satisfaction:</strong> {feedback.overall_satisfaction}
          </div>
          <div>
            <strong>Product Quality:</strong> {feedback.product_quality}
          </div>
          <div>
            <strong>Staff Knowledge:</strong> {feedback.staff_knowledge}
          </div>
          <div>
            <strong>Staff Friendliness:</strong> {feedback.staff_friendliness}
          </div>
          <div>
            <strong>Store Cleanliness:</strong> {feedback.store_cleanliness}
          </div>
          <div>
            <strong>Value for Money:</strong> {feedback.value_for_money}
          </div>
          <div>
            <strong>Found Desired Product:</strong> {feedback.found_desired_product ? "Yes" : "No"}
          </div>
          <div>
            <strong>Product Feedback:</strong> {feedback.product_feedback}
          </div>
          <div>
            <strong>Service Feedback:</strong> {feedback.service_feedback}
          </div>
          <div>
            <strong>Improvement Suggestions:</strong> {feedback.improvement_suggestions}
          </div>
          <div>
            <strong>Would Recommend:</strong> {feedback.would_recommend ? "Yes" : "No"}
          </div>
          <div>
            <strong>Purchase Made:</strong> {feedback.purchase_made ? "Yes" : "No"}
          </div>
          <div>
            <strong>Purchase Amount:</strong> {feedback.purchase_amount}
          </div>
          <div>
            <strong>Preferred Communication Channel:</strong> {feedback.preferred_communication_channel}
          </div>
          <div>
            <strong>Subscribe to Newsletter:</strong> {feedback.subscribe_to_newsletter ? "Yes" : "No"}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

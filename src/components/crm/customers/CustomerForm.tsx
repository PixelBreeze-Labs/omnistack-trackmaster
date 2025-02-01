// components/CustomerForm.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { CustomerFormData } from "@/app/api/external/omnigateway/types/customers";

interface CustomerFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CustomerFormData) => Promise<void>;
    initialData?: Partial<CustomerFormData>;
    title: string;
}

export const CustomerForm = ({ open, onClose, onSubmit, initialData, title }: CustomerFormProps) => {
    const [formData, setFormData] = useState<CustomerFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        type: 'REGULAR',
        status: 'ACTIVE',
        ...initialData
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                        <Input
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                    </div>
                    <Input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <Input
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                    <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as 'REGULAR' | 'VIP' }))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="REGULAR">Regular</SelectItem>
                            <SelectItem value="VIP">VIP</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'ACTIVE' | 'INACTIVE' }))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {initialData ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
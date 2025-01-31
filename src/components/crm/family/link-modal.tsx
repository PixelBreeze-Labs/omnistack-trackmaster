// components/family/link-modal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import InputSelect from "@/components/Common/InputSelect"; 
import { useState } from "react";

const RELATIONSHIP_OPTIONS = [
 { value: "spouse", label: "Spouse" },
 { value: "child", label: "Child" },
 { value: "parent", label: "Parent" }
];

// Dummy data for demo
const CUSTOMER_OPTIONS = [
 { value: "1", label: "John Doe - Bronze" },
 { value: "2", label: "Jane Smith - Gold" },
 { value: "3", label: "Bob Wilson - Silver" }
];

interface LinkFamilyModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSuccess: () => void;
}

export function LinkFamilyModal({ isOpen, onClose, onSuccess }: LinkFamilyModalProps) {
 const [selectedMainCustomer, setSelectedMainCustomer] = useState("");
 const [selectedMembers, setSelectedMembers] = useState([]);
 const [step, setStep] = useState<'select-main' | 'select-members'>('select-main');
 const [newMember, setNewMember] = useState({
   name: '',
   email: '',
   phone: '',
   relationship: ''
 });

 return (
   <Dialog open={isOpen} onOpenChange={onClose}>
     <DialogContent className="sm:max-w-[600px]">
       <DialogHeader>
         <DialogTitle>Link Family Account</DialogTitle>
       </DialogHeader>

       {step === 'select-main' ? (
         <div className="space-y-4">
           <InputSelect
             name="mainCustomer"
             label="Select Main Customer"
             value={selectedMainCustomer}
             options={CUSTOMER_OPTIONS}
             onChange={(e) => setSelectedMainCustomer(e.target.value)}
             required
           />

           {selectedMainCustomer && (
             <div className="space-y-2 border-t pt-4">
               <CustomerCard customer={CUSTOMER_OPTIONS.find(c => c.value === selectedMainCustomer)} />
             </div>
           )}
         </div>
       ) : (
         <div className="space-y-4">
           <div className="flex justify-between items-center">
             <div>
               <h3 className="font-medium">Select Family Members</h3>
               <p className="text-sm text-muted-foreground">
                 Selected customer: <span className="font-medium">
                   {CUSTOMER_OPTIONS.find(c => c.value === selectedMainCustomer)?.label}
                 </span>
               </p>
             </div>
           </div>

           <Tabs defaultValue="search">
             <TabsList>
               <TabsTrigger value="search">Search Member</TabsTrigger>
               <TabsTrigger value="new">Add New Member</TabsTrigger>
             </TabsList>

             <TabsContent value="search">
               <div className="space-y-4 p-2">
                 <div className="relative mt-2">
                   <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                   <Input placeholder="Search by email, phone or membership ID" className="pl-8" />
                 </div>
                 <div className="border rounded-lg divide-y max-h-[300px] overflow-auto">
                   <CustomerSelectItem />
                 </div>
               </div>
             </TabsContent>

             <TabsContent value="new">
               <div className="space-y-4 p-4">
                 <div>
                   <Label>Full Name</Label>
                   <Input 
                     value={newMember.name}
                     onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                   />
                 </div>
                 <div>
                   <Label>Email</Label>
                   <Input 
                     type="email"
                     value={newMember.email}
                     onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                   />
                 </div>
                 <div>
                   <Label>Phone</Label>
                   <Input 
                     value={newMember.phone}
                     onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                   />
                 </div>
                 <InputSelect
                   name="relationship"
                   label="Relationship"
                   value={newMember.relationship}
                   options={RELATIONSHIP_OPTIONS}
                   onChange={(e) => setNewMember({...newMember, relationship: e.target.value})}
                   required
                 />
               </div>
             </TabsContent>
           </Tabs>

           {selectedMembers.length > 0 && (
             <div className="border-t pt-4 space-y-2">
               <Label>Selected Members</Label>
               <div className="space-y-2">
                 {selectedMembers.map(member => (
                   <SelectedMemberCard 
                     key={member.id} 
                     member={member}
                     onRemove={() => setSelectedMembers(
                       selectedMembers.filter(m => m.id !== member.id)
                     )}
                   />
                 ))}
               </div>
             </div>
           )}
         </div>
       )}

       <DialogFooter>
         {step === 'select-main' ? (
           <>
             <Button variant="outline" onClick={onClose}>Cancel</Button>
             <Button onClick={() => setStep('select-members')} disabled={!selectedMainCustomer}>
               Next
             </Button>
           </>
         ) : (
           <>
             <Button variant="outline" onClick={() => setStep('select-main')}>Back</Button>
             <Button disabled={selectedMembers.length === 0}>Link Family</Button>
           </>
         )}
       </DialogFooter>
     </DialogContent>
   </Dialog>
 );
}

function CustomerCard({ customer }) {
 return (
   <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
     <Avatar className="h-10 w-10">
       <AvatarFallback>{customer?.label?.substring(0,2)}</AvatarFallback>
     </Avatar>
     <div>
       <div className="font-medium">{customer?.label}</div>
       <div className="text-xs text-muted-foreground">Member since Jan 2024</div>
     </div>
   </div>
 );
}

function CustomerSelectItem() {
 return (
   <div className="flex items-center justify-between p-3 hover:bg-accent cursor-pointer">
     <div className="flex items-center gap-3">
       <Avatar className="h-8 w-8">
         <AvatarFallback>JD</AvatarFallback>
       </Avatar>
       <div>
         <div className="font-medium">John Doe</div>
         <div className="text-xs text-muted-foreground">Bronze Member</div>
       </div>
     </div>
     <Button variant="ghost" size="sm">Select</Button>
   </div>
 );
}

function SelectedMemberCard({ member, onRemove }) {
 return (
   <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
     <div className="flex items-center gap-3">
       <Avatar className="h-8 w-8">
         <AvatarFallback>{member.name?.substring(0,2)}</AvatarFallback>
       </Avatar>
       <div>
         <div className="font-medium">{member.name}</div>
         <div className="text-xs text-muted-foreground">{member.relationship}</div>
       </div>
     </div>
     <Button variant="ghost" size="sm" onClick={onRemove}>
       <X className="h-4 w-4" />
     </Button>
   </div>
 );
}
  // components/family/link-modal.tsx
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import { ScrollArea } from "@/components/ui/scroll-area";
  import {
    SearchIcon,
    X,
    CheckCircle,
  } from "lucide-react";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import InputSelect from "@/components/Common/InputSelect";
  import { useState, useEffect } from "react";
  import { useFamilyAccounts } from "@/hooks/useFamilyAccounts";
  import { useDebounce } from "@/hooks/useDebounce";
  import toast from 'react-hot-toast';
  import { Customer } from "@/app/api/external/omnigateway/types/family-account";

  const RELATIONSHIP_OPTIONS = [
    { value: "SPOUSE", label: "Spouse" },
    { value: "CHILD", label: "Child" },
    { value: "PARENT", label: "Parent" },
    { value: "SIBLING", label: "Sibling" },
    { value: "OTHER", label: "Other" }
  ];

  interface SelectedMember {
    id: string;
    name: string;
    email: string;
    relationship: string;
    avatar?: string;
  }

  interface CustomerSelectCardProps {
    customer: Customer;
    isMainCustomer: boolean;
    isSelected: boolean;
    onSelect: (relationship: string) => void;
  }

  const CustomerSelectCard = ({
    customer,
    isMainCustomer,
    isSelected,
    onSelect
  }: CustomerSelectCardProps) => {
    const [showRelationship, setShowRelationship] = useState(false);
    const [relationship, setRelationship] = useState('');

    const handleSelect = () => {
      if (isMainCustomer || isSelected) return;
      
      if (relationship) {
        onSelect(relationship);
        setShowRelationship(false);
        setRelationship('');
      } else {
        setShowRelationship(true);
      }
    };

    return (
      <div className={`p-4 border-b last:border-0 ${isMainCustomer ? 'opacity-50' : 'hover:bg-accent'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={customer.avatar} />
              <AvatarFallback>
                {customer.firstName[0]}{customer.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {customer.firstName} {customer.lastName}
              </div>
              <div className="text-sm text-muted-foreground">
                {customer.email}
              </div>
            </div>
          </div>
          
          {isSelected ? (
            <Badge variant="success">Selected</Badge>
          ) : isMainCustomer ? (
            <Badge variant="secondary">Main Customer</Badge>
          ) : showRelationship ? (
            <div className="flex items-center gap-2">
              <InputSelect
                name="relationship"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                options={RELATIONSHIP_OPTIONS}
                className="w-32"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowRelationship(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleSelect}
                disabled={!relationship}
              >
                Add
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelect}
            >
              Select
            </Button>
          )}
        </div>
      </div>
    );
  };

  interface LinkFamilyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
  }

  export function LinkFamilyModal({ isOpen, onClose, onSuccess }: LinkFamilyModalProps) {
    const {
      handleSearch,
      linkFamily,
      searchResults,
      isSearching
    } = useFamilyAccounts();

    const [step, setStep] = useState<'main' | 'members'>('main');
    const [mainCustomer, setMainCustomer] = useState<Customer | null>(null);
    const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(handleSearch, 300);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
      if (searchTerm.length >= 2) {
        debouncedSearch(searchTerm);
      }
    }, [searchTerm, debouncedSearch]);

    const handleSelectMainCustomer = (customer: Customer) => {
      setMainCustomer(customer);
    };

    const handleAddMember = (customer: Customer, relationship: string) => {
      if (customer._id === mainCustomer?._id) {
        toast.error("Can't add main customer as a member");
        return;
      }

      if (selectedMembers.some(m => m._id === customer._id)) {
        toast.error('Member already added');
        return;
      }

      setSelectedMembers([
        ...selectedMembers,
        {
          id: customer._id,
          name: `${customer.firstName} ${customer.lastName}`,
          email: customer.email,
          relationship,
          avatar: customer.avatar
        }
      ]);
    };

    const handleRemoveMember = (memberId: string) => {
      setSelectedMembers(selectedMembers.filter(m => m.id !== memberId));
    };

    const handleSubmit = async () => {
      try {
        setIsSubmitting(true);
        await linkFamily({
          mainCustomerId: mainCustomer!._id,
          members: selectedMembers.map(m => ({
            customerId: m.id,
            relationship: m.relationship
          }))
        });
        toast.success('Family linked successfully');
        onSuccess();
        handleClose();
      } catch (error) {
        // Error handled by the hook
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleClose = () => {
      setStep('main');
      setMainCustomer(null);
      setSelectedMembers([]);
      setSearchTerm('');
      onClose();
    };

    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Link Family Account</DialogTitle>
          </DialogHeader>

          {step === 'main' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Search Main Customer</Label>
                <div className="relative">
                  <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email or phone..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {isSearching ? (
                  <div className="text-center py-4">Searching...</div>
                ) : (
                  <ScrollArea className="h-[300px] rounded-md border">
                    {searchResults?.map((customer) => (
                      <div
                        key={customer._id}
                        className={`p-4 cursor-pointer hover:bg-accent flex items-center justify-between ${
                          mainCustomer?._id === customer._id ? 'bg-accent' : ''
                        }`}
                        onClick={() => handleSelectMainCustomer(customer)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={customer.avatar} />
                            <AvatarFallback>
                              {customer.firstName[0]}{customer.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {customer.firstName} {customer.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {customer.email}
                            </div>
                          </div>
                        </div>
                        {mainCustomer?._id === customer._id && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    ))}
                  </ScrollArea>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Select Family Members</h3>
                  <p className="text-sm text-muted-foreground">
                    Main: {mainCustomer?.firstName} {mainCustomer?.lastName}
                  </p>
                </div>
                <Badge variant="secondary">
                  {selectedMembers.length} members selected
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <ScrollArea className="h-[300px] rounded-md border">
                  {searchResults?.map((customer) => (
                    <CustomerSelectCard
                      key={customer._id}
                      customer={customer}
                      isMainCustomer={customer._id === mainCustomer?._id}
                      isSelected={selectedMembers.some(m => m._id === customer._id)}
                      onSelect={(relationship) => handleAddMember(customer, relationship)}
                    />
                  ))}
                </ScrollArea>
              </div>

              {selectedMembers.length > 0 && (
                <div className="border-t pt-4">
                  <Label>Selected Members</Label>
                  <div className="space-y-2 mt-2">
                    {selectedMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-accent rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {member.relationship}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member._id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {step === 'main' ? (
              <Button
                onClick={() => setStep('members')}
                disabled={!mainCustomer}
              >
                Next
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setStep('main')}>
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={selectedMembers.length === 0 || isSubmitting}
                >
                  {isSubmitting ? 'Linking...' : 'Link Family'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
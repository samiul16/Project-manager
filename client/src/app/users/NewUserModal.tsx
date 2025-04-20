"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { OrgUserInput, RoleName } from "@/state/api";

const roles = [
  { value: RoleName.Admin, label: "Admin" },
  { value: RoleName.Employee, label: "Employee" },
  { value: RoleName.User, label: "User" },
];

interface NewUserModalProps {
  onUserCreate: (user: OrgUserInput) => void;
}

export function NewUserModal({ onUserCreate }: NewUserModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    roles: [] as RoleName[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value: string | undefined) => {
    setNewUser((prev) => ({ ...prev, phoneNumber: value || "" }));
  };

  const handleRoleChange = (value: RoleName) => {
    setNewUser((prev) => {
      if (prev.roles.includes(value)) {
        return {
          ...prev,
          roles: prev.roles.filter((role) => role !== value),
        };
      } else {
        return {
          ...prev,
          roles: [...prev.roles, value],
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUserCreate(newUser);
    setIsOpen(false);
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      roles: [],
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-left">Create New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <Label htmlFor="firstName" className="md:text-right">
              First Name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={newUser.firstName}
              onChange={handleInputChange}
              className="md:col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <Label htmlFor="lastName" className="md:text-right">
              Last Name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              value={newUser.lastName}
              onChange={handleInputChange}
              className="md:col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <Label htmlFor="email" className="md:text-right">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={newUser.email}
              onChange={handleInputChange}
              className="md:col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <Label htmlFor="phoneNumber" className="md:text-right">
              Phone Number
            </Label>
            <div className="md:col-span-3">
              <PhoneInput
                international
                defaultCountry="US"
                value={newUser.phoneNumber}
                onChange={handlePhoneChange}
                className="w-full"
                inputComponent={Input}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <Label className="md:text-right">Role(s)</Label>
            <div className="md:col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {newUser.roles.length > 0
                      ? newUser.roles
                          .map(
                            (r) => roles.find((role) => role.value === r)?.label
                          )
                          .join(", ")
                      : "Select roles..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search roles..." />
                    <CommandEmpty>No role found.</CommandEmpty>
                    <CommandGroup>
                      {roles.map((role) => (
                        <CommandItem
                          key={role.value}
                          onSelect={() => handleRoleChange(role.value)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              newUser.roles.includes(role.value)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {role.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create User</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

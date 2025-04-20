"use client";

import {
  RoleName,
  useCreateEmployeeMutation,
  useCreateOrgUserMutation,
} from "@/state/api";
import { formatISO } from "date-fns";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";

type EmployeeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const EmployeeModal = ({ isOpen, onClose }: EmployeeModalProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [createOrgUser, { isLoading }] = useCreateOrgUserMutation();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    setFile(null);
  };

  const uploadToS3 = async (file: File) => {
    try {
      // Get a pre-signed URL from your backend
      const response = await fetch("/api/aws/s3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: `uploads/employees/${file.name}`,
          filetype: file.type,
        }),
      });

      const { url, key } = await response.json();

      // Upload the file to S3 using the pre-signed URL
      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      return key;
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload profile picture. Please try again.");
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email) return;

    try {
      let profilePictureKey = null;
      if (file) {
        profilePictureKey = await uploadToS3(file);
      }

      const formattedHireDate = hireDate ? formatISO(new Date(hireDate)) : null;

      const employeeData = {
        firstName,
        lastName,
        email,
        profilePictureUrl: profilePictureKey,
        position: position || undefined,
        department: department || undefined,
        hireDate: formattedHireDate || undefined,
        phoneNumber: phone || "",
        roles: ["Employee"] as RoleName[],
      };

      await createOrgUser(employeeData).unwrap();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPosition("");
    setDepartment("");
    setHireDate("");
    setPhone("");
    setFile(null);
    setUploadError(null);
  };

  const isFormValid = () => {
    return firstName && lastName && email;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new employee.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              type="text"
              placeholder="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              type="date"
              placeholder="Hire Date"
              value={hireDate}
              onChange={(e) => setHireDate(e.target.value)}
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Profile Picture
            </label>
            {file ? (
              <div className="border rounded-md p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="truncate max-w-xs">{file.name}</span>
                  <span className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-2">
                  <UploadCloud className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isDragActive
                      ? "Drop the image here"
                      : "Drag & drop a profile picture here, or click to select"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Supports: JPEG, PNG, WEBP (Max 5MB)
                  </p>
                </div>
              </div>
            )}
            {uploadError && (
              <p className="text-sm text-red-500">{uploadError}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Adding..." : "Add Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeModal;

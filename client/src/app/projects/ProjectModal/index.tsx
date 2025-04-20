"use client";

import { useCreateProjectMutation, useLazyGetOrgUsersQuery } from "@/state/api";
import { formatISO } from "date-fns";
import { useState, useCallback, useRef, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useDropzone } from "react-dropzone";
import { Check, UploadCloud, X, User } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

type ProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ProjectModal = ({ isOpen, onClose }: ProjectModalProps) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [managerIds, setManagerIds] = useState<string[]>([]);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const commandRef = useRef<HTMLDivElement>(null);

  const [createProject, { isLoading: createLoading }] =
    useCreateProjectMutation();
  const [
    getOrgUsers,
    { data: orgUsers, isLoading: isOrgUsersLoading, error: orgUsersError },
  ] = useLazyGetOrgUsersQuery();

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commandRef.current &&
        !commandRef.current.contains(event.target as Node)
      ) {
        setIsCommandOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadError(null);
    }
  }, []);

  const handleManagerChange = (id: string) => {
    if (managerIds.includes(id)) {
      setManagerIds((prev) => prev.filter((managerId) => managerId !== id));
    } else {
      setManagerIds((prev) => [...prev, id]);
    }
  };

  const removeManager = (id: string) => {
    setManagerIds((prev) => prev.filter((managerId) => managerId !== id));
  };

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
      const response = await fetch("/api/aws/s3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: `uploads/projects/${file.name}`,
          filetype: file.type,
        }),
      });

      const { url, key } = await response.json();
      console.log("Pre upload response", url);
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
      setUploadError("Failed to upload image. Please try again.");
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!projectName || !startDate || !endDate) return;

    try {
      let imageKey = null;
      if (file) {
        imageKey = await uploadToS3(file);
      }

      const formattedStartDate = formatISO(new Date(startDate));
      const formattedEndDate = formatISO(new Date(endDate));

      const projectData = {
        name: projectName,
        description,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        managerIds,
        imageUrl: imageKey,
        imageName: file?.name,
      };

      await createProject(projectData).unwrap();
      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const isFormValid = () => {
    return projectName && startDate && endDate;
  };

  const handleCommandFocus = () => {
    setIsCommandOpen(true);
    if (!orgUsers) {
      getOrgUsers();
    }
  };

  // Get selected managers data
  const selectedManagers =
    orgUsers?.filter((user) => managerIds.includes(user.id)) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new project.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Image
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
                      : "Drag & drop an image here, or click to select"}
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
            <div ref={commandRef} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Project Manager
              </label>
              <Command>
                <CommandInput
                  placeholder="Search managers..."
                  onFocus={handleCommandFocus}
                  onClick={() => setIsCommandOpen(true)}
                />
                {isCommandOpen && (
                  <CommandGroup className="absolute z-10 w-full mt-1 border rounded-md shadow-lg bg-popover">
                    {isOrgUsersLoading ? (
                      <CommandEmpty>Loading managers...</CommandEmpty>
                    ) : orgUsersError ? (
                      <CommandEmpty>Error loading managers</CommandEmpty>
                    ) : orgUsers?.length === 0 ? (
                      <CommandEmpty>No managers available</CommandEmpty>
                    ) : (
                      <>
                        <CommandEmpty>No manager found</CommandEmpty>
                        {orgUsers?.map(({ user, id }) => (
                          <CommandItem
                            key={id}
                            value={`${user.firstName} ${user.lastName}`}
                            onSelect={() => handleManagerChange(id)}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                managerIds.includes(id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {user.firstName} {user.lastName}
                          </CommandItem>
                        ))}
                      </>
                    )}
                  </CommandGroup>
                )}
              </Command>

              {/* Selected managers chips */}
              {selectedManagers.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedManagers.map(({ user, id }) => (
                    <Badge
                      key={id}
                      variant="outline"
                      className="flex items-center gap-2 py-1 px-2 rounded-full"
                    >
                      {user.profilePictureUrl ? (
                        <Image
                          src={user.profilePictureUrl}
                          alt={`${user.firstName} ${user.lastName}`}
                          width={20}
                          height={20}
                          className="rounded-full w-5 h-5 object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-gray-500" />
                      )}
                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeManager(id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={!isFormValid() || createLoading}
              className="w-full sm:w-auto"
            >
              {createLoading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;

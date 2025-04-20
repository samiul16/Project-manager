"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useGetEmployeesQuery } from "@/state/api";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar as CalendarIcon,
  Plus,
} from "lucide-react";
import EmployeeModal from "./EmployeeModal";
import { useState } from "react";
import Header from "@/components/Header";
import { getSignedUrl } from "@/utils/AWS";
import Loading from "@/components/Loading";

const EmployeesPage = () => {
  const router = useRouter();
  const [isModalNewEmployeeOpen, setIsModalNewEmployeeOpen] = useState(false);
  const { data: orgUsers, isLoading } = useGetEmployeesQuery();

  const employees = orgUsers?.map((orgUser) => orgUser.user);

  // Handle navigation to employee details
  const handleViewDetails = (employeeId: string) => {
    router.push(`/employees/${employeeId}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-8">
      <EmployeeModal
        isOpen={isModalNewEmployeeOpen}
        onClose={() => setIsModalNewEmployeeOpen(false)}
      />

      {/* Header Section with border bottom */}
      <div className="flex justify-between items-center mb-6 pb-4">
        <Header
          name="Employees"
          buttonComponent={
            <Button
              onClick={() => setIsModalNewEmployeeOpen(true)}
              className="bg-black text-white hover:bg-gray-900"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Employee
            </Button>
          }
        />
      </div>

      {/* Employees Grid - Only show if employees exist */}
      {employees && employees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {employees.map((employee) => (
            <Card
              key={employee.userId}
              className="hover:shadow-lg transition-shadow"
            >
              {/* Rounded Avatar Image */}
              <div className="w-full flex justify-center pt-6">
                <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                  {employee.profilePictureUrl ? (
                    <Image
                      src={
                        getSignedUrl(employee.profilePictureUrl) ||
                        "/user-placeholder.jpg"
                      }
                      alt={`${employee.firstName} ${employee.lastName}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <CardHeader className="p-4 text-center">
                <CardTitle className="text-md font-semibold">
                  {employee.firstName} {employee.lastName}
                </CardTitle>
                {employee.position && (
                  <CardDescription className="text-xs">
                    {employee.position}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-4">
                {/* Employee details with icons */}
                <div className="space-y-2">
                  {employee.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-600" />
                      <span className="text-xs text-gray-600 truncate">
                        {employee.email}
                      </span>
                    </div>
                  )}
                  {employee.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span className="text-xs text-gray-600">
                        {employee.phone}
                      </span>
                    </div>
                  )}
                  {employee.department && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-600" />
                      <span className="text-xs text-gray-600">
                        {employee.department}
                      </span>
                    </div>
                  )}
                  {employee.hireDate && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-gray-600" />
                      <span className="text-xs text-gray-600">
                        Hired:{" "}
                        {new Date(employee.hireDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 flex justify-center">
                <Button
                  onClick={() => handleViewDetails(employee.userId)}
                  className="bg-black text-white hover:bg-gray-900"
                  size="sm"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        // Empty state when no employees exist
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4 max-w-md">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md mx-auto bg-gray-200 flex items-center justify-center">
              <User className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No employees</h3>
            <p className="text-sm text-gray-500">
              Get started by adding a new employee.
            </p>
            <Button
              onClick={() => setIsModalNewEmployeeOpen(true)}
              className="mt-4 bg-black text-white hover:bg-gray-900"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Employee
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;

"use client";

import {
  OrgUserInput,
  useCreateOrgUserMutation,
  useGetOrgUsersQuery,
} from "@/state/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Mail, User, Users as TeamIcon, Phone } from "lucide-react";
import Header from "@/components/Header";
import { NewUserModal } from "@/app/users/NewUserModal";
import Loading from "@/components/Loading";

const UserCard = ({ user }: { user: any }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage
            src={
              user.profilePictureUrl ? `/${user.profilePictureUrl}` : undefined
            }
            alt={`${user.firstName} ${user.lastName}`}
          />
          <AvatarFallback>
            <User className="w-6 h-6 text-gray-500" />
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {user.firstName} {user.lastName}
          </CardTitle>
          <p className="text-sm text-gray-500">{user.username || user.email}</p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-gray-500" />
          <span>{user.email}</span>
        </div>
        {user.teamId && (
          <div className="flex items-center gap-2 text-sm">
            <TeamIcon className="h-4 w-4 text-gray-500" />
            <span>Team ID: {user.teamId}</span>
          </div>
        )}
        {user.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{user.phone}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const UsersPage = () => {
  const { data: orgUsers, isLoading, error } = useGetOrgUsersQuery();
  const users = orgUsers?.map((orgUser) => orgUser.user);

  const [createOrgUser] = useCreateOrgUserMutation();

  const handleCreateUser = (newUser: OrgUserInput) => {
    createOrgUser({
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      roles: newUser.roles,
    });
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );
  if (error)
    return <div className="text-center mt-10">Error fetching users</div>;

  return (
    <div className="p-6 md:p-10">
      <div className="flex justify-between items-center mb-6">
        <Header name="Users" />
        <NewUserModal onUserCreate={handleCreateUser} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {users && users.length > 0 ? (
          users.map((user) => <UserCard key={user.email} user={user} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4 max-w-md">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md mx-auto bg-gray-200 flex items-center justify-center">
                <User className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No users</h3>
              <p className="text-sm text-gray-500">
                Get started by adding a user.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;

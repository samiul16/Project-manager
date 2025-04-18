import { RootState } from "@/app/reduxStoreProvider";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  totalNumberOfTasks?: number;
  totalNumberOfInProgressTasks?: number;
  totalNumberOfCompletedTasks?: number;
  imageUrl?: string;
  imageName?: string;
  attachments?: Attachment[];
  projectManagers?: ProjectManager[];
}

export interface ProjectManager {
  id: string;
  orgUserId: string;
  projectId: string;
  orgUser: OrgUser;
}

export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export enum Status {
  ToDo = "ToDo",
  WorkInProgress = "WorkInProgress",
  UnderReview = "UnderReview",
  Completed = "Completed",
}

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl?: string;
  cognitoId?: string;
  teamId?: number;
  phone?: string;
  position?: string;
  department?: string;
  hireDate?: string;
}

export interface Attachment {
  id: number;
  fileURL: string;
  fileName: string;
  taskId: string;
  uploadedById: number;
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  orgUserId: string;
  orgUser: OrgUser;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: string;
  authorUserId?: string;
  assignedUserId?: string | null;
  attachmentUrl?: string;
  assignedIds: string[];

  author?: OrgUser;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
  taskAssignments?: TaskAssignment[];
}

export interface Team {
  id: string;
  teamName: string;
  productOwnerUserId?: string;
  projectManagerUserId?: string;
  productOwnerUsername?: string;
  projectManagerUsername?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl?: string;
  position?: string;
  department?: string;
  hireDate?: string;
  phone?: string;
}

export interface AuthResponse {
  userId: number;
  username: string;
  email: string;
  token: string;
  user: User;
}

export interface OrgUser {
  id: string;
  userId: number;
  organizationId: number;
  user: User;
}

export enum RoleName {
  Admin = "Admin",
  Employee = "Employee",
  User = "User",
}

export interface OrgUserInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roles: RoleName[];
  position?: string;
  department?: string;
  hireDate?: string;
}

export interface TaskChecklist {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  createdBy: number;
  taskId: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: [
    "Employees",
    "Projects",
    "Tasks",
    "Users",
    "Teams",
    "OrgUsers",
    "TaskChecklist",
  ],
  endpoints: (build) => ({
    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
    }),
    getProjectById: build.query<Project, { id: string }>({
      query: ({ id }) => `projects/${id}`,
      providesTags: ["Projects"],
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"], // Invalidate the provided tags, and re fetch the query, so dont need to refetch again after post req
    }),
    deleteProject: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
    getTasks: build.query<Task[], { projectId: string }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const }],
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTaskStatus: build.mutation<Task, { taskId: string; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Tasks"],
    }),
    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
    getTasksByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks", id }))
          : [{ type: "Tasks", id: userId }],
    }),
    getEmployees: build.query<OrgUser[], void>({
      query: () => "employees",
      providesTags: ["Employees"],
    }),
    createEmployee: build.mutation<Employee, Partial<Employee>>({
      query: (employee) => ({
        url: "employees",
        method: "POST",
        body: employee,
      }),
      invalidatesTags: ["Employees"],
    }),
    login: build.mutation<
      AuthResponse,
      { email: string; password: string; subDomain?: string | null }
    >({
      query: ({ email, password, subDomain }) => ({
        url: "auth/login",
        method: "POST",
        body: { email, password, subDomain },
      }),
      transformResponse: (response: AuthResponse) => response,
      transformErrorResponse: (error: any) => error.data,
    }),
    register: build.mutation<
      AuthResponse,
      {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        subDomain: string;
        organizationName: string;
      }
    >({
      query: ({
        firstName,
        lastName,
        email,
        password,
        subDomain,
        organizationName,
      }) => ({
        url: "auth/register",
        method: "POST",
        body: {
          firstName,
          lastName,
          email,
          password,
          subDomain,
          organizationName,
        },
      }),
      transformResponse: (response: AuthResponse) => response,
      transformErrorResponse: (error: any) => error.data,
    }),
    getOrgUsers: build.query<OrgUser[], void>({
      query: () => "organization-users",
      providesTags: ["OrgUsers"],
    }),
    createOrgUser: build.mutation<OrgUser, OrgUserInput>({
      query: (orgUser) => ({
        url: "organization-users",
        method: "POST",
        body: orgUser,
      }),
      invalidatesTags: ["OrgUsers"],
    }),
    getTaskById: build.query<Task, { taskId: string }>({
      query: ({ taskId }) => `tasks/${taskId}`,
      providesTags: ["Tasks"],
    }),
    createTaskChecklist: build.mutation<TaskChecklist, Partial<TaskChecklist>>({
      query: (taskChecklist) => ({
        url: "task-checklist",
        method: "POST",
        body: taskChecklist,
      }),
      invalidatesTags: ["Tasks", "TaskChecklist"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useGetProjectByIdQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useGetTasksByUserQuery,
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useDeleteProjectMutation,
  useLoginMutation,
  useRegisterMutation,
  useGetOrgUsersQuery,
  useCreateOrgUserMutation,
  useLazyGetOrgUsersQuery,
  useGetTaskByIdQuery,
  useCreateTaskChecklistMutation,
} = api;

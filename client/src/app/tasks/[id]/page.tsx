"use client";
import { notFound } from "next/navigation";
import { TaskDetails } from "@/components/Task/TaskDetails";
import { TaskCommentsActivity } from "@/components/Task/TaskCommentActivity";
import { TaskChecklist } from "@/components/Task/TaskCheckList";
import { TaskAIFeatures } from "@/components/Task/TaskAIFeature";
import {
  TaskDetailsProps,
  Comment,
  ActivityLog,
  ChecklistItem,
} from "@/components/Task/types";
import { useGetTaskByIdQuery } from "@/state/api";
import Loading from "@/components/Loading";

// function getTaskDetails(id: string): TaskDetailsProps {
//   // Replace with your actual data fetching logic
//   const mockTask: TaskDetailsProps = {
//     id,
//     title: "Implement user authentication",
//     description:
//       "Create a secure authentication system with JWT tokens and refresh tokens.",
//     status: "WorkInProgress",
//     priority: "high",
//     tags: ["backend", "security"],
//     startDate: "2023-10-01",
//     dueDate: "2023-10-15",
//     points: 5,
//     attachments: [
//       {
//         id: "1",
//         name: "Auth Requirements.pdf",
//         url: "#",
//         size: 1024,
//         type: "application/pdf",
//         uploadedAt: "2023-09-28",
//       },
//     ],
//     taskAssignments: [
//       {
//         user: {
//           userId: "1",
//           firstName: "John",
//           lastName: "Doe",
//           email: "john@example.com",
//         },
//         assignedAt: "2023-09-28",
//         role: "assignee",
//       },
//     ],
//   };

//   return mockTask;
// }

function getTaskComments(id: string) {
  // Replace with your actual data fetching logic
  return [
    {
      id: "1",
      content: "I've started working on the authentication controller.",
      author: {
        userId: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      },
      createdAt: "2023-10-02",
      updatedAt: "2023-10-02",
    },
  ];
}

function getTaskActivity(id: string) {
  // Replace with your actual data fetching logic
  return [
    {
      id: "1",
      action: "changed status from todo to in_progress",
      user: {
        userId: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      },
      createdAt: "2023-10-02",
    },
  ];
}

function getTaskChecklist(id: string) {
  // Replace with your actual data fetching logic
  return [
    {
      id: "1",
      title: "Set up JWT token generation",
      completed: true,
      createdAt: "2023-10-01",
      updatedAt: "2023-10-02",
    },
    {
      id: "2",
      title: "Implement refresh token rotation",
      completed: false,
      createdAt: "2023-10-01",
      updatedAt: "2023-10-01",
    },
  ];
}

export default function TaskDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  console.log("Tasks page loaded...", params.id);
  const {
    data: task,
    isLoading,
    error,
  } = useGetTaskByIdQuery({ taskId: params.id });
  console.log("task--> ", task);

  if (isLoading) {
    return <Loading />;
  }
  if (!task || error) {
    notFound();
  }

  const comments = getTaskComments(params.id);
  const activityLogs = getTaskActivity(params.id);
  const checklistItems = getTaskChecklist(params.id);

  const handleAddComment = async (content: string) => {};

  const handleAddChecklistItem = async (title: string) => {};

  const handleToggleChecklistItem = async (
    id: string,
    completed: boolean
  ) => {};

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column (60% width) */}
        <div className="w-full lg:w-[60%] space-y-6 pr-0 lg:pr-6">
          <TaskDetails {...task} />
          <TaskCommentsActivity
            comments={comments}
            activityLogs={activityLogs}
            onAddComment={handleAddComment}
          />
        </div>

        {/* Right Column (40% width) */}
        <div className="w-full lg:w-[40%] space-y-6 pl-0 lg:pl-6">
          <TaskChecklist
            items={checklistItems}
            onToggleItem={handleToggleChecklistItem}
            taskId={params.id}
          />
          <TaskAIFeatures />
        </div>
      </div>
    </div>
  );
}

import { useGetTasksQuery, useUpdateTaskStatusMutation } from "@/state/api";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task as TaskType } from "@/state/api";
import { EllipsisVertical, MessageSquareMore, Plus, User } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { getSignedUrl } from "@/utils/AWS";
import Link from "next/link";

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (value: boolean) => void;
};

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

const Board = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId: id });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const moveTask = (taskId: string, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus.split(" ").join("") });
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  );
};

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: string, toStatus: string) => void;
  setIsModalNewTaskOpen: (value: boolean) => void;
};

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: string }) => {
      return moveTask(item.id, status);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const tasksCount = tasks?.filter(
    (task) => task.status === status.split(" ").join("")
  )?.length;

  const statusColor: any = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    Completed: "#000000",
  };

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
    >
      <div className="mb-3 flex w-full">
        <div
          className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {status}{" "}
            <span
              className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary"
              style={{ width: "1.5rem", height: "1.5rem" }}
            >
              {tasksCount}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
              <EllipsisVertical size={26} />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {tasks
        .filter((task) => task.status === status.split(" ").join(""))
        .map((task) => (
          <Task key={task.id} task={task} />
        ))}
    </div>
  );
};

type TaskProps = {
  task: TaskType;
};

type Priority = "Urgent" | "High" | "Medium" | "Low" | "Backlog" | undefined;

const getPriorityClass = (priority: Priority) => {
  switch (priority) {
    case "Urgent":
      return "bg-red-200 text-red-700";
    case "High":
      return "bg-yellow-200 text-yellow-700";
    case "Medium":
      return "bg-green-200 text-green-700";
    case "Low":
      return "bg-blue-200 text-blue-700";
    case "Backlog":
      return "bg-gray-100 dark:bg-neutral-950";
  }
};

const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => (
  <div
    className={`rounded-full px-2 py-1 text-xs font-semibold ${getPriorityClass(
      priority
    )}`}
  >
    {priority}
  </div>
);

const Task = ({ task }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];
  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "";
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : "";

  const numberOfComments = (task.comments && task.comments.length) || 0;

  return (
    <Link href={`/tasks/${task.id}`} passHref>
      <div
        ref={(instance) => {
          drag(instance);
        }}
        className={`mb-4 cursor-pointer rounded-md bg-white shadow transition-all hover:shadow-md dark:bg-dark-secondary ${
          isDragging ? "opacity-50" : "opacity-100"
        }`}
      >
        {task.attachments && task.attachments.length > 0 && (
          <Image
            src={getSignedUrl(task.attachments[0].fileURL) || "/i1.jpg"}
            alt={task.attachments[0].fileName}
            width={400}
            height={200}
            className="h-auto w-full rounded-t-md"
          />
        )}
        <div className="p-4 md:p-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              {task.priority && <PriorityTag priority={task.priority} />}
              <div className="flex gap-2">
                {taskTagsSplit.map((tag) => (
                  <div
                    key={tag}
                    className="rounded-full bg-blue-100 px-2 py-1 text-xs"
                  >
                    {" "}
                    {tag}
                  </div>
                ))}
              </div>
            </div>
            <button className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500">
              <EllipsisVertical size={26} />
            </button>
          </div>
          <div className="my-3 flex justify-between">
            <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
            {typeof task.points === "number" && (
              <div className="text-xs font-semibold dark:text-white">
                {task.points} pts
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-neutral-500">
            {formattedStartDate && <span>{formattedStartDate} - </span>}
            {formattedDueDate && <span>{formattedDueDate}</span>}
          </div>
          <p className="text-sm text-gray-600 dark:text-neutral-500">
            {task.description}
          </p>
          <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />
          <div className="mt-3 flex items-center justify-between">
            <div className="flex -space-x-[6px] overflow-hidden">
              {task.taskAssignments &&
                task.taskAssignments.length > 0 &&
                task.taskAssignments.map((taskAssignment) =>
                  taskAssignment.orgUser.user.profilePictureUrl ? (
                    <Image
                      key={taskAssignment.orgUser.userId}
                      src={`/${taskAssignment.orgUser.user.profilePictureUrl!}`}
                      alt={
                        taskAssignment.orgUser.user.firstName +
                        " " +
                        taskAssignment.orgUser.user.lastName
                      }
                      width={30}
                      height={30}
                      className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center dark:bg-dark-secondary">
                      <User className="w-4 h-4 text-gray-500 dark:text-neutral-500" />
                    </div>
                  )
                )}
              {task.author &&
                (task.author.user.profilePictureUrl ? (
                  <Image
                    key={task.author.id}
                    src={`/${task.author.user.profilePictureUrl!}`}
                    alt={
                      task.author.user.firstName +
                      " " +
                      task.author.user.lastName
                    }
                    width={30}
                    height={30}
                    className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center dark:bg-dark-secondary">
                    <User className="w-4 h-4 text-gray-500 dark:text-neutral-500" />
                  </div>
                ))}
            </div>
            <div className="flex items-center text-gray-500 dark:text-neutral-500">
              <MessageSquareMore size={20} />
              <span className="ml-1 text-sm dark:text-neutral-400">
                {numberOfComments}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Board;

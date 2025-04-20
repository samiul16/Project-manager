"use client";

import { useAppSelector } from "@/app/reduxStoreProvider";
import { useGetTasksQuery } from "@/state/api";
import { ViewMode, Gantt, DisplayOption } from "gantt-task-react";
import { useMemo, useState } from "react";
import "gantt-task-react/dist/index.css";
import Loading from "@/components/Loading";

type TimelineProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = ({ id, setIsModalNewTaskOpen }: TimelineProps) => {
  const { data: tasks, error, isLoading } = useGetTasksQuery({ projectId: id });

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  const ganttTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    return tasks.map((task) => ({
      start: new Date(task.startDate as string),
      end: new Date(task.dueDate as string),
      name: task.title,
      id: `Task-${task.id}`,
      type: "task" as TaskTypeItems,
      progress: task.points ? (task.points / 10) * 100 : 0,
      isDisabled: false,
    }));
  }, [tasks]);

  if (isLoading) return <Loading />;
  if (error) return <div>An error occurred while fetching tasks.</div>;
  return (
    <div className="px-4 xl:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2 py-5">
        <h1 className="me-2 text-lg font-bold dark:text-white">
          Project Tasks Timeline
        </h1>
        <div className="relative inline-block w-64">
          <select
            className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
            value={displayOptions.viewMode}
            onChange={(event) =>
              setDisplayOptions((prev) => ({
                ...prev,
                viewMode: event.target.value as ViewMode,
              }))
            }
          >
            <option value={ViewMode.Month}>Month</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Day}>Day</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
        {ganttTasks.length > 0 ? (
          <div className="timeline">
            <Gantt
              tasks={ganttTasks}
              {...displayOptions}
              columnWidth={
                displayOptions.viewMode === ViewMode.Month ? 150 : 100
              }
              listCellWidth="100px"
              barBackgroundColor={isDarkMode ? "#101214" : "#aeb8c2"}
              barBackgroundSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
            />
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No tasks found for this project.
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;

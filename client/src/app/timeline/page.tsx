"use client";

import { useAppSelector } from "@/app/reduxStoreProvider";
import Header from "@/components/Header";
import { useGetProjectsQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Loading from "@/components/Loading";

type TaskTypeItems = "task" | "milestone" | "project";
type ChartOrientation = "horizontal" | "vertical";

const Timeline = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: projects, isLoading, isError } = useGetProjectsQuery();

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  const [orientation, setOrientation] =
    useState<ChartOrientation>("horizontal");

  const ganttTasks = useMemo(() => {
    return (
      projects?.map((project) => ({
        start: new Date(project.startDate as string),
        end: new Date(project.endDate as string),
        name: project.name,
        id: `Project-${project.id}`,
        type: "project" as TaskTypeItems,
        progress: 50,
        isDisabled: false,
        styles: {
          backgroundColor: isDarkMode ? "#36598C" : "#7F00FF",
          backgroundSelectedColor: isDarkMode ? "#4a7abf" : "#7F00FF",
          progressColor: isDarkMode ? "#2d4a6e" : "#7F00FF",
          progressSelectedColor: isDarkMode ? "#3a5a8a" : "#FFFFFF",
        },
      })) || []
    );
  }, [projects, isDarkMode]);

  const handleViewModeChange = (value: ViewMode) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: value,
    }));
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !projects) {
    return (
      <div className="max-w-full p-8">
        <Card className="p-6 text-center">
          <h3 className="text-lg font-medium">Error Loading Projects</h3>
          <p className="text-muted-foreground mt-2">
            An error occurred while fetching project data.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-full p-8">
      <header className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <Header name="Projects Timeline" />

        <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
          <ToggleGroup
            type="single"
            value={orientation}
            onValueChange={(value) => setOrientation(value as ChartOrientation)}
            className="w-full sm:w-auto"
          >
            <ToggleGroupItem value="horizontal" aria-label="Horizontal view">
              Horizontal
            </ToggleGroupItem>
            <ToggleGroupItem value="vertical" aria-label="Vertical view">
              Vertical
            </ToggleGroupItem>
          </ToggleGroup>

          <Select
            value={displayOptions.viewMode}
            onValueChange={(value) => handleViewModeChange(value as ViewMode)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select view mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ViewMode.Day}>Day View</SelectItem>
              <SelectItem value={ViewMode.Week}>Week View</SelectItem>
              <SelectItem value={ViewMode.Month}>Month View</SelectItem>
              <SelectItem value={ViewMode.Year}>Year View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <Card className="overflow-hidden p-4">
        <div className="timeline">
          {orientation === "horizontal" ? (
            <Gantt
              tasks={ganttTasks}
              {...displayOptions}
              columnWidth={
                displayOptions.viewMode === ViewMode.Month
                  ? 100
                  : displayOptions.viewMode === ViewMode.Year
                    ? 250
                    : 80
              }
              listCellWidth="150px"
              rowHeight={48}
              fontSize="14px"
              barCornerRadius={6}
              arrowColor={isDarkMode ? "#94a3b8" : "#64748b"}
              arrowIndent={20}
              todayColor={
                isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
              }
            />
          ) : (
            <div className="vertical-gantt">
              {/* Custom implementation for vertical Gantt */}
              <div className="grid gap-4">
                {ganttTasks.map((task) => (
                  <div key={task.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{task.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {task.start.toLocaleDateString()} -{" "}
                        {task.end.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="relative h-6 w-full rounded-full bg-gray-200 dark:bg-gray-800">
                      <div
                        className="absolute h-full rounded-full"
                        style={{
                          left: `${calculatePosition(task.start)}%`,
                          width: `${calculateDuration(task.start, task.end)}%`,
                          backgroundColor: isDarkMode ? "#36598C" : "#7F00FF",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// Helper functions for vertical Gantt
function calculatePosition(date: Date): number {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
  const totalDuration = yearEnd.getTime() - yearStart.getTime();
  const position = date.getTime() - yearStart.getTime();

  return (position / totalDuration) * 100;
}

function calculateDuration(start: Date, end: Date): number {
  const duration = end.getTime() - start.getTime();
  const yearStart = new Date(start.getFullYear(), 0, 1);
  const yearEnd = new Date(start.getFullYear() + 1, 0, 1);
  const totalDuration = yearEnd.getTime() - yearStart.getTime();

  return (duration / totalDuration) * 100;
}

export default Timeline;

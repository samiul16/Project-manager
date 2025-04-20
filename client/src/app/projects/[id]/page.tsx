"use client";

import { useState, Suspense, lazy } from "react";
import ProjectHeader from "../ProjectHeader";
import { useGetProjectByIdQuery } from "@/state/api";
import ModalNewTask from "@/components/ModalNewTask";
import Loading from "@/components/Loading";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load the tab components
const Board = lazy(() => import("../Board"));
const List = lazy(() => import("../List"));
const Timeline = lazy(() => import("../Timeline"));
const Table = lazy(() => import("../Table"));

type Props = {
  params: {
    id: string;
  };
};

const Project = ({ params }: Props) => {
  const { id } = params;
  const [activeTab, setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  const { data: project, isLoading } = useGetProjectByIdQuery({
    id: id,
  });

  if (isLoading) {
    return <Loading />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Board":
        return (
          <Suspense fallback={<TabSkeleton />}>
            <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
          </Suspense>
        );
      case "List":
        return (
          <Suspense fallback={<TabSkeleton />}>
            <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
          </Suspense>
        );
      case "Timeline":
        return (
          <Suspense fallback={<TabSkeleton />}>
            <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
          </Suspense>
        );
      case "Table":
        return (
          <Suspense fallback={<TabSkeleton />}>
            <Table id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
          </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
        projectId={id}
      />
      <ProjectHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        name={project?.name}
      />
      {renderActiveTab()}
    </div>
  );
};

// Skeleton loader for tabs
const TabSkeleton = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-64 w-full" />
  </div>
);

export default Project;

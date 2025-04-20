import React from "react";
import PriorityPage from "../priorityPage";
import { Priority } from "@/state/api";

const Medium = () => {
  return <PriorityPage priority={Priority.Medium} />;
};

export default Medium;

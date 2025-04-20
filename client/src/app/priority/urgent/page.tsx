import React from "react";
import PriorityPage from "../priorityPage";
import { Priority } from "@/state/api";

const Urgent = () => {
  return <PriorityPage priority={Priority.Urgent} />;
};

export default Urgent;

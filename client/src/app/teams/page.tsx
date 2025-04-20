"use client";
import { useGetTeamsQuery } from "@/state/api";
import React from "react";
import {
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const columns: GridColDef[] = [
  { field: "id", headerName: "Team ID", width: 100 },
  { field: "teamName", headerName: "Team Name", width: 200 },
  { field: "productOwnerUsername", headerName: "Product Owner", width: 200 },
  {
    field: "projectManagerUsername",
    headerName: "Project Manager",
    width: 200,
  },
];

const Teams = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();
  if (isLoading) return <div>Loading...</div>;
  if (isError || !teams) return <div>Error fetching teams</div>;

  //   const exportToCSV = () => {
  //     const csvContent =
  //       "data:text/csv;charset=utf-8," +
  //       ["Team ID,Team Name,Product ID,Product Manager"]
  //         .concat(teams.map((t) => `${t.id},${t.name},${t.productId},${t.productManager}`))
  //         .join("\n");

  //     const encodedUri = encodeURI(csvContent);
  //     const link = document.createElement("a");
  //     link.setAttribute("href", encodedUri);
  //     link.setAttribute("download", "teams.csv");
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   };

  return (
    <div className="flex flex-col w-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Teams
        </h2>
        <button
          // onClick={exportToCSV}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-300 dark:border-gray-600">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <th className="px-2 py-3 text-left">Team ID</th>
              <th className="px-1 py-3 text-left">Team Name</th>
              <th className="px-1 py-3 text-left">Product Owner</th>
              <th className="px-1 py-3 text-left">Product Manager</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr
                key={team.id}
                className={`border-b ${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-white dark:bg-gray-800"
                }`}
              >
                <td className="px-2 py-3 text-left text-gray-700 dark:text-gray-100">
                  {team.id}
                </td>
                <td className="px-1 py-3 font-medium text-gray-800 dark:text-gray-100">
                  {team.teamName}
                </td>
                <td className="px-1 py-3 text-left font-medium text-gray-800 dark:text-gray-100">
                  {team.productOwnerUsername}
                </td>
                <td className="px-1 py-3 text-left font-medium text-gray-800 dark:text-gray-100">
                  {team.projectManagerUsername}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Teams;

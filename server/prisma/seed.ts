// import { PrismaClient } from "@prisma/client";
// import fs from "fs";
// import path from "path";
// const prisma = new PrismaClient();

// async function deleteAllData(orderedFileNames: string[]) {
//   const modelNames = orderedFileNames.map((fileName) => {
//     const modelName = path.basename(fileName, path.extname(fileName));
//     return modelName.charAt(0).toUpperCase() + modelName.slice(1);
//   });

//   for (const modelName of modelNames) {
//     const model: any = prisma[modelName as keyof typeof prisma];
//     try {
//       await model.deleteMany({});
//       console.log(`Cleared data from ${modelName}`);
//     } catch (error) {
//       console.error(`Error clearing data from ${modelName}:`, error);
//     }
//   }
// }

// async function main() {
//   const dataDirectory = path.join(__dirname, "seedData");

//   const orderedFileNames = [
//     "team.json",
//     "project.json",
//     "projectTeam.json",
//     "user.json",
//     "task.json",
//     "attachment.json",
//     "comment.json",
//     "taskAssignment.json",
//   ];

//   await deleteAllData(orderedFileNames);

//   for (const fileName of orderedFileNames) {
//     const filePath = path.join(dataDirectory, fileName);
//     const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
//     const modelName = path.basename(fileName, path.extname(fileName));
//     const model: any = prisma[modelName as keyof typeof prisma];

//     try {
//       for (const data of jsonData) {
//         await model.create({ data });
//       }
//       console.log(`Seeded ${modelName} with data from ${fileName}`);
//     } catch (error) {
//       console.error(`Error seeding data for ${modelName}:`, error);
//     }
//   }
// }

// main()
//   .catch((e) => console.error(e))
//   .finally(async () => await prisma.$disconnect());

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      cognitoId: "cognito-id-1",
      username: "user1",
      profilePictureUrl: "https://example.com/user1.jpg",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      cognitoId: "cognito-id-2",
      username: "user2",
      profilePictureUrl: "https://example.com/user2.jpg",
    },
  });

  // Create Teams
  const team1 = await prisma.team.create({
    data: {
      teamName: "Team Alpha",
      productOwnerUserId: user1.userId,
      projectManagerUserId: user2.userId,
    },
  });

  const team2 = await prisma.team.create({
    data: {
      teamName: "Team Beta",
    },
  });

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: "Project One",
      description: "First project",
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Project Two",
      description: "Second project",
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    },
  });

  // Create ProjectTeams
  const projectTeam1 = await prisma.projectTeam.create({
    data: {
      teamId: team1.id,
      projectId: project1.id,
    },
  });

  const projectTeam2 = await prisma.projectTeam.create({
    data: {
      teamId: team2.id,
      projectId: project2.id,
    },
  });

  // Create Tasks
  const task1 = await prisma.task.create({
    data: {
      title: "Task One",
      description: "First task",
      status: "ToDo", // Updated to use TaskStatus enum
      priority: "Urgent", // Updated to use TaskPriority enum
      tags: "urgent",
      startDate: new Date(),
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      points: 5,
      projectId: project1.id,
      authorUserId: user1.userId,
      assignedUserId: user2.userId,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: "Task Two",
      description: "Second task",
      status: "WorkInProgress", // Updated to use TaskStatus enum
      priority: "Medium", // Updated to use TaskPriority enum
      tags: "ongoing",
      startDate: new Date(),
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
      points: 3,
      projectId: project2.id,
      authorUserId: user2.userId,
    },
  });

  // Create TaskAssignments
  const taskAssignment1 = await prisma.taskAssignment.create({
    data: {
      userId: user1.userId,
      taskId: task1.id,
    },
  });

  const taskAssignment2 = await prisma.taskAssignment.create({
    data: {
      userId: user2.userId,
      taskId: task2.id,
    },
  });

  // Create Attachments
  const attachment1 = await prisma.attachment.create({
    data: {
      fileURL: "https://example.com/file1.pdf",
      fileName: "file1.pdf",
      taskId: task1.id,
      uploadedById: user1.userId,
    },
  });

  const attachment2 = await prisma.attachment.create({
    data: {
      fileURL: "https://example.com/file2.docx",
      fileName: "file2.docx",
      taskId: task2.id,
      uploadedById: user2.userId,
    },
  });

  // Create Comments
  const comment1 = await prisma.comment.create({
    data: {
      text: "This is a comment on task one",
      taskId: task1.id,
      userId: user1.userId,
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      text: "This is a comment on task two",
      taskId: task2.id,
      userId: user2.userId,
    },
  });

  console.log({
    user1,
    user2,
    team1,
    team2,
    project1,
    project2,
    projectTeam1,
    projectTeam2,
    task1,
    task2,
    taskAssignment1,
    taskAssignment2,
    attachment1,
    attachment2,
    comment1,
    comment2,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";
import KanbanBoard from "@/components/kanban-board";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/ui/spinner";

async function getBoard(userId: string) {
  "use cache";

  await connectDB();

  let boardDoc = await Board.findOne({
    userId: userId,
    name: "Job Hunt",
  }).populate({
    path: "columns",
    populate: {
      path: "jobApplications",
    },
  });

  if (!boardDoc) {
    const { initializeUserBoard } = await import("@/lib/init-user-board");
    await initializeUserBoard(userId);
    boardDoc = await Board.findOne({
      userId: userId,
      name: "Job Hunt",
    }).populate({
      path: "columns",
      populate: {
        path: "jobApplications",
      },
    });
  }

  if (!boardDoc) return null;

  const board = JSON.parse(JSON.stringify(boardDoc));
  return board;
}

async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const board = await getBoard(session.user.id);

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">Job Hunt</h1>
          <p className="text-gray-600">Track your job applications</p>
        </div>
        <KanbanBoard board={board} userId={session.user.id} />
      </div>
    </div>
  );
}

export default async function Dashboard() {
  return (
    <Suspense fallback={<LoadingScreen label="Loading your board..." />}>
      <DashboardPage />
    </Suspense>
  );
}

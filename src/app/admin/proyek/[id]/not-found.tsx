import Link from "next/link";
import { Button } from "@mantine/core";

export default async function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          404 - Project Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {"We apologize, the project you're seeking doesn't exist."}
        </p>
        <Link href={"/admin/proyek"}>
          <Button>Back to Projects Page</Button>
        </Link>
      </div>
    </div>
  );
}

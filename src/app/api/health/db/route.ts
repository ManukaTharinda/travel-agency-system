import { prisma } from "@/lib/prisma";



export async function GET() {
  try {
    const result = await prisma.$queryRaw<
    Array<{ result: number}>
    >`SELECT 1 as result`;
    return  Response.json({
        status: "success",
        message: "Database connection is successful",
        database: result[0].result,

    });
    } catch (error) {
        console.error("Database connection error:", error);
        return Response.json(
            {
                status: "error",
                message: "Database connection failed",
            },
            {status: 500}
        );
    }
}
import { NextResponse } from "next/server";
import { ddbDocClient, initializeDynamoDB } from "@/lib/dynamodb";
import { ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDynamoDB();
    const { id: productId } = await params;
    const appsTable = process.env.DYNAMODB_APPLICATIONS_TABLE || "RentWiseApplications";

    const scanRes = await ddbDocClient.send(new ScanCommand({
      TableName: appsTable,
      FilterExpression: "propertyId = :pid",
      ExpressionAttributeValues: {
        ":pid": productId
      }
    }));

    const matchingApps = scanRes.Items || [];

    for (const app of matchingApps) {
      await ddbDocClient.send(new UpdateCommand({
        TableName: appsTable,
        Key: { id: app.id },
        UpdateExpression: "set #status = :s",
        ExpressionAttributeNames: {
          "#status": "status"
        },
        ExpressionAttributeValues: {
          ":s": "Booked (Verified)"
        }
      }));
    }

    return NextResponse.json({ message: "Application approved successfully" });
  } catch (err: any) {
    console.error("PATCH /api/applications/[id]/approve error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

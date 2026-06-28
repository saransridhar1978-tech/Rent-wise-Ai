import { NextResponse } from "next/server";
import { ddbDocClient, initializeDynamoDB } from "@/lib/dynamodb";
import { ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

export async function GET() {
  try {
    await initializeDynamoDB();
    const appsTable = process.env.DYNAMODB_APPLICATIONS_TABLE || "RentWiseApplications";

    const result = await ddbDocClient.send(new ScanCommand({
      TableName: appsTable
    }));

    const applications = result.Items || [];

    // Sort by created_at DESC
    applications.sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });

    return NextResponse.json(applications);
  } catch (err: any) {
    console.error("GET /api/applications error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initializeDynamoDB();
    const appsTable = process.env.DYNAMODB_APPLICATIONS_TABLE || "RentWiseApplications";

    const appData = await req.json();
    if (!appData.id) {
      appData.id = `app-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    if (!appData.created_at) {
      appData.created_at = new Date().toISOString();
    }
    if (!appData.date) {
      appData.date = new Date().toISOString().split('T')[0];
    }
    if (!appData.status) {
      appData.status = "Under AI Review";
    }

    await ddbDocClient.send(new PutCommand({
      TableName: appsTable,
      Item: appData
    }));

    return NextResponse.json(appData, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/applications error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

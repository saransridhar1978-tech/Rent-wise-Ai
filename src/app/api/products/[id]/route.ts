import { NextResponse } from "next/server";
import { ddbDocClient, initializeDynamoDB } from "@/lib/dynamodb";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDynamoDB();
    const { id } = await params;
    const productsTable = process.env.DYNAMODB_PRODUCTS_TABLE || "RentWiseProducts";

    await ddbDocClient.send(new DeleteCommand({
      TableName: productsTable,
      Key: { id }
    }));

    return NextResponse.json({ message: `Product ${id} deleted successfully` });
  } catch (err: any) {
    console.error("DELETE /api/products/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

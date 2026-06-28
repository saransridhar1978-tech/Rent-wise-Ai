import { NextResponse } from "next/server";
import { ddbDocClient, initializeDynamoDB } from "@/lib/dynamodb";
import { UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDynamoDB();
    const { id } = await params;
    const { trustScore } = await req.json();
    const productsTable = process.env.DYNAMODB_PRODUCTS_TABLE || "RentWiseProducts";

    let scamRisk = "Low";
    if (trustScore < 50) scamRisk = "High";
    else if (trustScore < 80) scamRisk = "Medium";

    const getRes = await ddbDocClient.send(new GetCommand({
      TableName: productsTable,
      Key: { id }
    }));
    
    if (!getRes.Item) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const currentProduct = getRes.Item;
    let reasons = [...(currentProduct.scamReasons || [])];
    
    if (trustScore < 50) {
      if (!reasons.includes('Trust score manually demoted by platform administrator.')) {
        reasons.unshift('Trust score manually demoted by platform administrator.');
      }
    } else {
      reasons = reasons.filter((r: string) => !r.includes('demoted'));
    }

    await ddbDocClient.send(new UpdateCommand({
      TableName: productsTable,
      Key: { id },
      UpdateExpression: "set trustScore = :ts, scamRisk = :sr, scamReasons = :re",
      ExpressionAttributeValues: {
        ":ts": trustScore,
        ":sr": scamRisk,
        ":re": reasons
      }
    }));

    return NextResponse.json({
      message: "Trust score updated successfully",
      trustScore,
      scamRisk,
      scamReasons: reasons
    });
  } catch (err: any) {
    console.error("PATCH /api/products/[id]/trust error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

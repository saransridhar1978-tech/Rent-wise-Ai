import { NextResponse } from "next/server";
import { ddbDocClient, initializeDynamoDB } from "@/lib/dynamodb";
import { ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

export async function GET() {
  try {
    await initializeDynamoDB();
    const productsTable = process.env.DYNAMODB_PRODUCTS_TABLE || "RentWiseProducts";
    
    const result = await ddbDocClient.send(new ScanCommand({
      TableName: productsTable
    }));

    const products = result.Items || [];
    
    // Sort products by created_at DESC or default ID order
    products.sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });

    return NextResponse.json(products);
  } catch (err: any) {
    console.error("GET /api/products error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initializeDynamoDB();
    const productsTable = process.env.DYNAMODB_PRODUCTS_TABLE || "RentWiseProducts";
    
    const product = await req.json();
    if (!product.id) {
      product.id = `prod-${Date.now()}`;
    }
    if (!product.created_at) {
      product.created_at = new Date().toISOString();
    }

    await ddbDocClient.send(new PutCommand({
      TableName: productsTable,
      Item: product
    }));

    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/products error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

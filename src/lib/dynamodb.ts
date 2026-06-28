import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockProducts } from "../data/mockProducts";

const region = process.env.AWS_REGION || "ap-south-2";

const client = new DynamoDBClient({
  region,
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

export const ddbDocClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

let isInitialized = false;

async function ensureTableExists(tableName: string, keyName: string) {
  try {
    await client.send(new DescribeTableCommand({ TableName: tableName }));
    return false;
  } catch (err: any) {
    if (
      err.name === "ResourceNotFoundException" ||
      err.message?.includes("Cannot find table") ||
      err.name === "TableNotFoundException" ||
      err.message?.includes("ResourceNotFoundException")
    ) {
      console.log(`Table ${tableName} not found. Creating it...`);
      await client.send(new CreateTableCommand({
        TableName: tableName,
        KeySchema: [
          { AttributeName: keyName, KeyType: "HASH" }
        ],
        AttributeDefinitions: [
          { AttributeName: keyName, AttributeType: "S" }
        ],
        BillingMode: "PAY_PER_REQUEST",
      }));
      // Wait for table to be active
      let active = false;
      for (let i = 0; i < 15; i++) {
        try {
          const desc = await client.send(new DescribeTableCommand({ TableName: tableName }));
          if (desc.Table?.TableStatus === "ACTIVE") {
            active = true;
            break;
          }
        } catch {}
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      if (!active) {
        console.warn(`Timeout waiting for table ${tableName} to become ACTIVE`);
      }
      return true;
    } else {
      throw err;
    }
  }
}

export async function initializeDynamoDB() {
  if (isInitialized) return;
  
  const productsTable = process.env.DYNAMODB_PRODUCTS_TABLE || "RentWiseProducts";
  const appsTable = process.env.DYNAMODB_APPLICATIONS_TABLE || "RentWiseApplications";

  try {
    const productsCreated = await ensureTableExists(productsTable, "id");
    await ensureTableExists(appsTable, "id");

    if (productsCreated) {
      console.log("Seeding products into DynamoDB...");
      for (const product of mockProducts) {
        await ddbDocClient.send(new PutCommand({
          TableName: productsTable,
          Item: product,
        }));
      }
      console.log(`Seeded ${mockProducts.length} products successfully.`);
    }
    isInitialized = true;
  } catch (err) {
    console.error("Error initializing DynamoDB tables:", err);
  }
}

# RentWise AI (Next.js + AWS DynamoDB)

RentWise AI is a smart rental marketplace with AI-driven protection badges, Indian document verification (KYC), real-time pricing analysis, and integrated trust ratings.

This project was fully migrated from React + Vite to a modern, production-ready **Next.js (App Router)** setup utilizing **AWS DynamoDB** for global scale and serverless database storage.

## Key Features

- **Next.js App Router**: Optimized routing, dynamic imports, API routes, and robust client component segregation.
- **AWS DynamoDB Integration**: Fully migrated from SQL PostgreSQL to serverless DynamoDB tables.
- **Automatic DB Seeding**: Creates and seeds products in DynamoDB tables on first start/load.
- **Renter, Owner & Admin Dashboards**: Complete features for browsing, listing, and moderation queues.
- **AI Fraud Shield**: Active protection badges with trust metrics.

---

## Getting Started

### 1. Requirements

- Node.js (v18.x or later)
- AWS Account with DynamoDB access (or local DynamoDB Local instance)

### 2. Environment Variables

Create a `.env.local` file at the root of the project with the following configuration:

```env
# AWS IAM Credentials for local/staging environment
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=ap-south-2

# DynamoDB Table Names (will be created automatically if they do not exist)
DYNAMODB_PRODUCTS_TABLE=RentWiseProducts
DYNAMODB_APPLICATIONS_TABLE=RentWiseApplications
```

### 3. Installation

Install all required NPM packages:

```bash
npm install
```

### 4. Running Locally

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The application will check for the existence of the DynamoDB tables and automatically create and seed them with mockup products if they do not exist.

### 5. Production Build

Build the production application bundle:

```bash
npm run build
```

---

## Deployment on Vercel

To deploy this project to Vercel:

1. Push the code to your GitHub repository.
2. Link your repository in Vercel.
3. Configure the environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, etc.) in the Vercel project settings dashboard.
4. Click **Deploy**.

import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { transactions } = req.body;

  const prompt = `
  You are an AI expense manager and financial advisor. Analyze the following transactions and provide comprehensive insights.

  Requirements:
  1. Categorize transactions into: Food, Travel, Bills, Shopping, Misc.
  2. Detect bill anomalies:
     - Compare bill amounts with typical ranges
     - Flag bills that are 20%+ higher than expected
     - Identify unusual spending patterns
  3. Provide smart alerts:
     - Bill due date reminders (if dates provided)
     - Spending trend warnings
     - Budget optimization suggestions
  4. Suggest 2-3 actionable savings tips based on spending patterns
  5. Calculate potential monthly savings if recommendations are followed

  Return ONLY this JSON structure (no markdown, no code blocks):
  {
    "categorized": [
      {
        "desc": "string",
        "amount": number,
        "category": "string",
        "date": "string (if provided)",
        "anomaly": "string (if bill is unusual)"
      }
    ],
    "alerts": [
      "string (bill warnings, due dates, anomalies)"
    ],
    "insights": {
      "totalSpent": number,
      "categoryBreakdown": {"Food": number, "Travel": number, "Bills": number, "Shopping": number, "Misc": number},
      "billAnomalies": ["string"],
      "spendingTrends": ["string"]
    },
    "tips": [
      "string (actionable savings advice)"
    ],
    "potentialSavings": {
      "monthly": number,
      "description": "string"
    }
  }

  Transactions: ${JSON.stringify(transactions)}
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    // Clean the response text to remove markdown formatting
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Try to parse the cleaned JSON
    const parsedData = JSON.parse(text);
    
    res.status(200).json(parsedData);
  } catch (err: any) {
    console.error("Error processing transactions:", err);
    res.status(500).json({ 
      error: "Failed to categorize transactions", 
      details: err.message 
    });
  }
}

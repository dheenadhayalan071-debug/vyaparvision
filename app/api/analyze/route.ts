import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    const prompt = `
      You are an expert Indian retail and Bahi-Khata (ledger) assistant. 
      Analyze this image of a handwritten shop ledger, grocery list, or shelf. 
      It may contain regional languages like Tamil, Hindi, or Tanglish.
      
      Extract the data and return ONLY a strict JSON object with this exact structure:
      {
        "inventory": [
          { "item": "Translated English Name", "localName": "Original Vernacular Name", "estimatedPriceINR": 50 }
        ],
        "khata": [
          { "customerName": "Name", "udharAmountINR": 500, "notes": "Any context" }
        ]
      }
      Do not include markdown tags, just the raw JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        prompt,
        {
          inlineData: {
            data: imageBase64.split(',')[1],
            mimeType: 'image/jpeg'
          }
        }
      ]
    });

    // TYPE SAFETY FIX: Check if text exists before manipulating it
    const text = response.text;
    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return NextResponse.json(JSON.parse(cleanJson));

  } catch (error) {
    console.error('VyaparVision AI Error:', error);
    return NextResponse.json({ error: 'Failed to process ledger' }, { status: 500 });
  }
}

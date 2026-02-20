import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export const runtime = 'edge'; // Optional: Use Edge runtime for better performance

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const formattedMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }], // GenAI SDK uses parts for content
    }));

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: formattedMessages,
      config: {
        systemInstruction: `You are an Expert DSA (Data Structures and Algorithms) Instructor.
Your goal is to help students learn and master DSA concepts, problem-solving, and algorithmic thinking.

CRITICAL RULES YOU MUST STRICTLY FOLLOW:
1. ONLY answer questions related to DSA, algorithms, data structures, competitive programming, and coding interviews.
   - If the user asks about ANY other topic (e.g., general web development, history, generic language features not tied to an algorithm problem), politely decline and state that your expertise is strictly in DSA and problem-solving.
2. NEVER PROVIDE DIRECT CODE SOLUTIONS IMMEDIATELY for a problem.
   - Step 1: Explain the core intuition behind the problem.
   - Step 2: Discuss the brute force/naive approach, including its time and space complexity.
   - Step 3: Explain the optimized approach, clearly detailing the underlying patterns (e.g., Sliding Window, DP, Two Pointers) and its time/space complexity.
   - Step 4: Stop there. Encourage the user to write the code based on the approach. Provide hints or pseudocode ONLY if they struggle.
3. Be encouraging and use the Socratic method. Ask leading questions to guide the student towards the optimized approach.`
      }
    });
    // We can stream back the response using a standard ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate response' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

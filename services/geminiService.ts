import { StudyMaterials } from '../types';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Using a reliable free model on OpenRouter
// Alternatives: 'google/gemini-2.0-flash-001', 'meta-llama/llama-3.2-3b-instruct:free'
const MODEL = 'google/gemini-2.0-flash-exp:free';

if (!OPENROUTER_API_KEY) {
  console.error("VITE_OPENROUTER_API_KEY environment variable not set. Please add it to .env.local");
} else {
  console.log("OpenRouter API key loaded successfully");
}

export const generateStudyMaterials = async (text: string): Promise<StudyMaterials> => {
    const truncatedText = text.slice(0, 20000); // Truncate to a reasonable length for the API
    
    const prompt = `
Analyze the following educational text and generate a comprehensive set of study materials.
You MUST respond with ONLY a valid JSON object (no markdown, no code blocks, no extra text).

Text:
---
${truncatedText}
---

Generate the following based on the text:
1. "quiz": An array of 10 multiple-choice questions. Each question must have:
   - "question" (string)
   - "options" (array of exactly 4 strings)
   - "answerIndex" (number 0-3, the index of the correct option)
   - "explanation" (string explaining why this is correct)

2. "flashcards": An array of 15 flashcards. Each flashcard has:
   - "front" (a term or question)
   - "back" (the definition or answer)

3. "summary": A concise, multi-paragraph summary of the key concepts in the text.

4. "mindMap": A hierarchical object for a mind map with:
   - "root": An object with "topic" (string) and "children" (array of objects)
   - Each child has "topic" and optionally "children" for sub-topics
   - Keep it 2-3 levels deep

Respond with ONLY the JSON object, starting with { and ending with }.
`;

    try {
        const response = await fetch(OPENROUTER_BASE_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'StudyGenie',
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful educational assistant. Always respond with valid JSON only, no markdown formatting or code blocks.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.5,
                max_tokens: 8000,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('OpenRouter API error:', response.status, response.statusText, errorData);
            throw new Error(`API request failed: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('OpenRouter response received:', data.model, data.usage);
        
        let jsonString = data.choices?.[0]?.message?.content?.trim() || '';
        
        if (!jsonString) {
            console.error('Empty response from API:', data);
            throw new Error('AI returned empty response');
        }
        
        // Clean up the response - remove markdown code blocks if present
        jsonString = jsonString.replace(/^```json\n?/i, '').replace(/^```\n?/i, '').replace(/\n?```$/i, '').trim();
        
        // Try to extract JSON if wrapped in other text
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonString = jsonMatch[0];
        }
        
        let parsedData;
        try {
            parsedData = JSON.parse(jsonString);
        } catch (parseError) {
            console.error('JSON parse error. Raw response:', jsonString.substring(0, 500));
            throw new Error('Failed to parse AI response as JSON');
        }
        
        // Basic validation to ensure the response is usable
        if (!parsedData.quiz || !parsedData.flashcards || !parsedData.summary || !parsedData.mindMap) {
            console.error('Missing fields in response:', Object.keys(parsedData));
            throw new Error("Generated data is missing required fields.");
        }

        return parsedData as StudyMaterials;
    } catch (error) {
        console.error("Error generating study materials:", error);
        throw error;
    }
};
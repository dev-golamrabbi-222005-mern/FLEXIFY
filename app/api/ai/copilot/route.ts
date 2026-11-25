import { NextRequest, NextResponse } from "next/server";
import { AICopilotRequestSchema, validateBody } from "../../../../lib/validators/contracts";

interface CopilotResponse {
  advice: string;
  adaptedWorkout: Array<{
    name: string;
    sets: number;
    reps: string;
    notes: string;
  }>;
  recoveryTips: string[];
}

function getSportsScienceFallback(
  prompt: string,
  sorenessLevel?: string,
  energyLevel?: string,
  goal?: string
): CopilotResponse {
  const isHighSoreness = sorenessLevel === "moderate" || sorenessLevel === "severe";
  const isLowEnergy = energyLevel === "low";

  let advice = `Based on your goal (${goal || "Fitness Progression"}) and feedback, I've dynamically calibrated your session. `;
  if (isHighSoreness) {
    advice += "Because your recovery is taxed with notable soreness, we're shifting emphasis toward active myofascial release, mobility, and joint decompression to accelerate blood flow without nervous system fatigue.";
  } else if (isLowEnergy) {
    advice += "Given lower energy reserves today, we're prioritizing high-efficiency compound movements with slightly longer rest intervals to maximize training stimulus while preventing form breakdown.";
  } else {
    advice += "You're primed for peak performance! We have structured a high-output session with progressive overload targeting prime mover mechanics.";
  }

  const adaptedWorkout = isHighSoreness
    ? [
        { name: "Foam Rolling & Myofascial Release", sets: 3, reps: "60 sec/zone", notes: "Focus on calves, IT band, and thoracic spine" },
        { name: "World's Greatest Stretch", sets: 2, reps: "6 per side", notes: "Open hips and thoracic rotation" },
        { name: "Banded Glute Bridges & Hamstring Curls", sets: 3, reps: "15 reps", notes: "Submaximal activation, slow eccentric phase" },
        { name: "Dead Hangs & Decompression", sets: 3, reps: "30-45 sec", notes: "Spinal decompression and shoulder mobility" },
      ]
    : [
        { name: "Goblet Squats or Front Squats", sets: 4, reps: "8-10 reps", notes: "Maintain neutral spine; 90 sec rest" },
        { name: "Romanian Deadlifts (Dumbbell/Barbell)", sets: 3, reps: "10-12 reps", notes: "Hinge at hips; pause 1 sec at stretch" },
        { name: "Incline Dumbbell Chest Press", sets: 4, reps: "8-10 reps", notes: "Controlled 3-second descent" },
        { name: "Face Pulls with Resistance Band", sets: 3, reps: "15 reps", notes: "External rotation at peak contraction" },
      ];

  const recoveryTips = [
    "Hydration: Aim for 500ml water with electrolytes within 30 minutes post-training.",
    "Protein Synthesis: Consume 25-35g of high-leucine complete protein within 2 hours.",
    "Sleep Architecture: Prioritize 7.5-8.5 hours with room temperature around 19°C for deep slow-wave repair.",
  ];

  return { advice, adaptedWorkout, recoveryTips };
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const validation = validateBody(AICopilotRequestSchema, rawBody);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { prompt, sorenessLevel, energyLevel, goal } = validation.data;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const fallback = getSportsScienceFallback(prompt, sorenessLevel, energyLevel, goal);
      return NextResponse.json(fallback);
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are Flexify AI, a world-class sports science coach and biomechanics recovery expert.
The athlete is asking: "${prompt}"
Current Athlete Condition:
- Soreness Level: ${sorenessLevel || "none"}
- Energy Level: ${energyLevel || "medium"}
- Goal: ${goal || "General Strength & Hypertrophy"}

Respond ONLY with a valid JSON object matching this exact schema:
{
  "advice": "Empathetic, scientifically grounded 2-3 sentence coaching guidance explaining what to adjust today",
  "adaptedWorkout": [
    { "name": "Exercise Name", "sets": 3, "reps": "8-10 reps", "notes": "Cues on tempo, rest, or form" }
  ],
  "recoveryTips": [
    "Specific nutrition tip",
    "Specific mobility or active recovery tip",
    "Sleep or hydration tip"
  ]
}`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.7,
            },
          }),
        }
      );

      if (!response.ok) {
        console.warn(`Gemini API returned ${response.status}. Using sports science fallback.`);
        const fallback = getSportsScienceFallback(prompt, sorenessLevel, energyLevel, goal);
        return NextResponse.json(fallback);
      }

      const data = await response.json();
      const contentText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!contentText) {
        const fallback = getSportsScienceFallback(prompt, sorenessLevel, energyLevel, goal);
        return NextResponse.json(fallback);
      }

      const parsed: CopilotResponse = JSON.parse(contentText);
      return NextResponse.json(parsed);
    } catch (apiError) {
      console.warn("Gemini API call failed, using sports science fallback:", apiError);
      const fallback = getSportsScienceFallback(prompt, sorenessLevel, energyLevel, goal);
      return NextResponse.json(fallback);
    }
  } catch (error) {
    console.error("AI Copilot Error:", error);
    return NextResponse.json({ error: "Failed to process AI copilot request" }, { status: 500 });
  }
}

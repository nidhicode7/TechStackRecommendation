import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import axios from 'axios';

let jsonrepair;
try {
  jsonrepair = require('jsonrepair').jsonrepair;
} catch (e) {
  jsonrepair = (str) => str; // fallback: do nothing
}

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(bodyParser.json());


const validateInput = (req, res, next) => {
  const { productType, teamSkills, budget, timeline, additionalNotes } = req.body;
  
  if (!productType || !teamSkills || !budget || !timeline) {
    return res.status(400).json({
      error: 'Missing required fields',
      details: {
        productType: !productType ? 'Required' : 'Valid',
        teamSkills: !teamSkills ? 'Required' : 'Valid',
        budget: !budget ? 'Required' : 'Valid',
        timeline: !timeline ? 'Required' : 'Valid'
      }
    });
  }

  // Validate product type
  const validProductTypes = ['Web', 'Mobile', 'Desktop'];
  if (!validProductTypes.includes(productType)) {
    return res.status(400).json({
      error: 'Invalid product type',
      details: `Product type must be one of: ${validProductTypes.join(', ')}`
    });
  }

  // Validate budget
  const validBudgets = ['Low', 'Medium', 'High'];
  if (!validBudgets.includes(budget)) {
    return res.status(400).json({
      error: 'Invalid budget',
      details: `Budget must be one of: ${validBudgets.join(', ')}`
    });
  }

  // Validate timeline
  const validTimelines = ['Short', 'Medium', 'Long'];
  if (!validTimelines.includes(timeline)) {
    return res.status(400).json({
      error: 'Invalid timeline',
      details: `Timeline must be one of: ${validTimelines.join(', ')}`
    });
  }

  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.post('/recommend', validateInput, async (req, res) => {
  const { productType, teamSkills, budget, timeline, additionalNotes } = req.body;

  const prompt = `
You are an AI Tech Stack Advisor. Based on the following details:
Product Type: ${productType}
Team Skills: ${teamSkills.join(', ')}
Budget: ${budget}
Timeline: ${timeline}
Additional Notes: ${additionalNotes || 'None'}

Please provide a detailed tech stack recommendation in the following JSON format:
{
  "recommendedStack": {
    "frontend": {
      "framework": "recommended framework",
      "justification": "why this framework",
      "alternatives": ["alternative 1", "alternative 2"]
    },
    "backend": {
      "framework": "recommended framework",
      "justification": "why this framework",
      "alternatives": ["alternative 1", "alternative 2"]
    },
    "database": {
      "type": "recommended database",
      "justification": "why this database",
      "alternatives": ["alternative 1", "alternative 2"]
    },
    "hosting": {
      "platform": "recommended platform",
      "justification": "why this platform",
      "alternatives": ["alternative 1", "alternative 2"]
    }
  },
  "overallJustification": "Overall explanation of the recommendation",
  "estimatedCost": "Estimated cost range",
  "estimatedTimeline": "Estimated timeline"
}

Please ensure the response is valid JSON and follows this exact structure.
`;

  // Dynamic Fallback Logic
  const generateDynamicFallback = (input) => {
    const { productType, teamSkills, budget, timeline } = input;

    let frontend = { framework: "React", justification: "Popular and versatile.", alternatives: ["Vue.js", "Angular"] };
    let backend = { framework: "Node.js + Express", justification: "Good for JS teams.", alternatives: ["Python + Django", "Java + Spring Boot"] };
    let database = { type: "PostgreSQL", justification: "Reliable relational DB.", alternatives: ["MySQL", "MongoDB"] };
    let hosting = { platform: "Vercel", justification: "Easy for frontend/serverless.", alternatives: ["AWS", "Netlify"] };

    // Simple logic to make fallback dynamic
    if (productType === 'Mobile') {
      frontend = { framework: "React Native", justification: "Cross-platform mobile dev.", alternatives: ["Flutter", "Swift/Kotlin"] };
      backend = { framework: "Firebase", justification: "Backend-as-a-Service, fast setup.", alternatives: ["AWS Amplify", "Parse Server"] };
      database = { type: "Firestore", justification: "NoSQL for mobile.", alternatives: ["MongoDB Atlas", "Realm"] };
      hosting = { platform: "Firebase Hosting", justification: "Integrates with other Firebase services.", alternatives: ["AWS Mobile Hub", "Azure Mobile Apps"] };
    } else if (productType === 'Desktop') {
       frontend = { framework: "Electron", justification: "Build desktop apps with web tech.", alternatives: ["NW.js", "Tauri"] };
       backend = { framework: "Python + Flask", justification: "Simple and lightweight backend.", alternatives: ["Node.js + Express", "Go"] };
       database = { type: "SQLite", justification: "Embedded database, simple for desktop.", alternatives: ["Realm", "IndexedDB"] };
       hosting = { type: "Self-hosted", justification: "Typically distributed with the app.", alternatives: [] };
    }

    if (teamSkills.includes('Python')) {
      backend = { framework: "Python + Django", justification: "Powerful Python web framework.", alternatives: ["Python + Flask", "Node.js"] };
      if (!['Mobile', 'Desktop'].includes(productType)) {
         database = { type: "PostgreSQL", justification: "Standard for Django.", alternatives: ["MySQL", "MongoDB"] };
      }
    } else if (teamSkills.includes('Java')) {
      backend = { framework: "Java + Spring Boot", justification: "Robust framework for enterprise apps.", alternatives: ["Node.js", "Python"] };
       if (!['Mobile', 'Desktop'].includes(productType)) {
         database = { type: "MySQL", justification: "Common with Java.", alternatives: ["PostgreSQL", "Oracle"] };
       }
    }
     // Add more logic for budget, timeline, other skills if needed

    return {
      recommendedStack: {
        frontend, backend, database, hosting
      },
      overallJustification: `Based on your input for ${productType} application. (Fallback)`, // Indicate it's fallback
      estimatedCost: budget,
      estimatedTimeline: timeline,
      note: "This is a dynamic fallback recommendation as the AI API was unavailable."
    };
  };

  try {
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${process.env.OPENAI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    // Extract the text from the response
    const content = geminiResponse.data.candidates[0].content.parts[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        res.json(parsedResponse);
      } catch (parseError) {
        console.error('Gemini API Parse Error:', parseError);
        // Fallback on JSON parsing error - now dynamic
        res.status(200).json({...generateDynamicFallback(req.body), note: 'AI output could not be parsed, using dynamic fallback.'});
      }
    } else {
      console.error('Gemini API returned no JSON:', content);
      // Fallback if no JSON found - now dynamic
      res.status(200).json({...generateDynamicFallback(req.body), note: 'AI output had no JSON, using dynamic fallback.'});
    }
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    // Fallback on any API error (including 429) - now dynamic
    res.status(200).json({...generateDynamicFallback(req.body), note: `AI API error (${error.message}), using dynamic fallback.`});
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Health check available at /health');
});

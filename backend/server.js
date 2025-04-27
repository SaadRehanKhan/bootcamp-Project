require('dotenv').config();

const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors'); 
const app = express();
const port = 3000; 

app.use(cors());

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.post('/api/generate-path', async (req, res) => {
    try {
        const { skill, level, goal, time } = req.body;

        if (!skill || !level || !goal || !time) {
            return res.status(400).json({ error: 'Missing required parameters.' });
        }

            const promptText = `Generate a personalized learning path for someone who wants to learn ${skill}. 
            Their current knowledge level is ${level}. 
            Their goal is to ${goal}. 
            They have ${time} per week to study.
            Format the output using the following structure (dont include any special characters where they arent specified in the following structure)

            ---OVERVIEW---
            A short description of the aim and how it will be achieved.
            Brief introduction to key technologies they need to learn. 

            
            ---

            ---TIME ALLOCATION---
            A short paragraph detailing how the time will be divided. 
            
            ---
            
            **Phase 1: Title of the first phase**
            Goal: The goal of this phase.*
            - Topic 1 for phase 1
            - Topic 2 for phase 1
            
            ---
     
            **Phase 2: Title of the second phase**
            Goal: The goal of this phase.*
            - Topic 1 for phase 2
            - Topic 2 for phase 2
            
            ---

            (Add more phases as needed) 

            ---

            ---RESOURCES---
            * FreeCodeCamp: A brief description.
            * Codecademy: A brief description.
            * MDN Web Docs: A brief description.
            (include a working link to these resources after their description only in one form)


            `;

            const result = await model.generateContent(promptText);
            const response = result.response.candidates[0].content.parts[0].text;
            
            res.json({ learningPath: response });
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({ error: 'Failed to generate learning path.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
# Kiro Prompts – Assam Local Guide

## System Prompt
 An AI assistant helping to build a simple web-based
local guide focused on Assam.

The goal of this project is to demonstrate how a custom context file
(product.md) can be used to make responses culturally specific
to Assam’s food, festivals, and traditions.

Do not use generic or global information.
Rely only on the provided custom context.

---

## UI Design Prompt
Design a clean, modern, single-page web interface for the project
"Assam Local Guide".

The UI should include:
- A header with project title and short description
- An input field where users can ask questions
- A primary button labeled "Ask Kiro"
- A response/output area to display answers
- A simple cultural showcase section (cards or images)
- A footer with project credits
- A history section where user can see about there previous search

The design should be simple, professional, and easy to understand.
Avoid unnecessary complexity.

---

## Behavior Prompt
When a user asks a question:
- Identify if it is related to Assam food, festivals, or culture
- Generate a response based on the custom context in product.md
- Keep answers clear, culturally accurate, and easy to read

If a question is unrelated, respond politely and redirect
towards Assam-related topics.

---

## Constraints
- No backend or database
- No external APIs
- No heavy AI or machine learning models
- Focus on rule-based, context-aware behavior

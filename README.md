# AI-Powered RFP Management System

A complete full-stack system to generate RFPs from natural language, manage vendors, send RFP emails, receive vendor replies via webhook, automatically parse responses using AI, and compare proposals.

---

# 📌 1. Project Setup

## **1.a Prerequisites**

Ensure the following are installed:

| Requirement | Version |
|------------|----------|
| Node.js | v18+ |
| npm | v9+ |
| PostgreSQL | v14+ |
| SendGrid Account | Required |
| OpenAI API Key | Required |

Clone the repository:

```bash
git clone https://github.com/<your-username>/Aerchain_Assignment.git
cd Aerchain_Assignment
```

---

## **1.b Environment Variables**

Create the following files:

```
backend/.env
frontend/.env
backend/.env.example
frontend/.env.example
```

### **backend/.env.example**

```env
PORT=4000

# Database
DATABASE_URL=postgres://postgres:postgres@localhost:5432/ai_rfp_db

# AI
OPENAI_API_KEY=your-openai-api-key

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=no-reply@yourdomain.com

# Inbound email secret for webhook
EMAIL_INBOUND_SECRET=devsecret123
```

### **frontend/.env.example**

```env
VITE_API_BASE_URL=http://localhost:4000
```

---

## **1.c Install Steps**

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

---

## **1.d Setting Up the Database**

Ensure PostgreSQL is running.

### Create the database:

```sql
CREATE DATABASE ai_rfp_db;
```

### Apply schema:

```bash
cd sql
psql -U postgres -d ai_rfp_db -f schema.sql
```

---

## **1.e Configure Email Sending & Receiving**

### Outbound Emails (SendGrid)

1. Verify a sender domain  
2. Create a SendGrid API key  
3. Add the key to `backend/.env`

### Inbound Emails (Webhook)

SendGrid → Inbound Parse → URL:

```
POST https://your-server.com/api/emails/webhook
```

For local testing:

```
http://localhost:4000/api/emails/webhook
```

Add required header:

```
X-INBOUND-SECRET: devsecret123
```

---

## **1.f Running the Project Locally**

### Start Backend

```bash
cd backend
npm start
```

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will open at:

👉 http://localhost:5173

---

## **1.g Seed Data (Optional)**

Insert sample vendors:

```sql
INSERT INTO vendors (name, contact, email)
VALUES ('Acme Supplies', 'John Doe', 'sales@acme.com');
```

---

# 📌 2. Tech Stack

### **Frontend**
- React + Vite  
- Axios  
- Tailwind (optional)

### **Backend**
- Node.js + Express  
- PostgreSQL (`pg`)  
- SendGrid Email API  
- OpenAI GPT API  

### **Database**
- PostgreSQL  
- Tables:
  - `rfps`
  - `vendors`
  - `proposals`
  - `proposal_scores`

### **AI Provider**
- OpenAI (GPT-4.1-mini)
  - RFP extraction  
  - Vendor email parsing  
  - Proposal scoring  

### **Email**
- SendGrid  
  - Outbound RFP sending  
  - Inbound vendor reply webhook  

---

# 📌 3. API Documentation

## **POST /api/rfps/from-text**
Create an RFP from natural language.

### Request:

```json
{
  "text": "I need 20 laptops and 15 monitors, budget 50k, delivery 30 days."
}
```

### Response:

```json
{
  "id": "uuid",
  "title": "Procurement Request",
  "items": [
    { "name": "laptop", "quantity": 20, "specs": "16GB RAM" },
    { "name": "monitor", "quantity": 15, "specs": "27-inch" }
  ],
  "budget": 50000,
  "delivery_days": 30
}
```

---

## **POST /api/vendors**
Create a vendor.

### Request:

```json
{
  "name": "Acme Supplies",
  "contact": "John",
  "email": "sales@acme.com"
}
```

### Response:

```json
{
  "id": "uuid",
  "name": "Acme Supplies",
  "email": "sales@acme.com"
}
```

---

## **POST /api/rfps/:id/send**
Send an RFP email to all vendors.

---

## **POST /api/emails/webhook**
Handles inbound vendor email replies.

### Headers:

```
X-INBOUND-SECRET: devsecret123
```

### Request Body:

```json
{
  "from": "sales@acme.com",
  "subject": "Re: RFP-123 TOKEN:ABC123",
  "text": "We offer laptops at $950 each…"
}
```

### Response:

```json
{ "status": "parsed", "vendor": "sales@acme.com" }
```

---

## **GET /api/rfps/:id/proposals**
Fetch proposals + AI-generated scores.

---

# 📌 4. Decisions & Assumptions

## **4.a Key Design Decisions**
- GPT used to structure RFPs from natural text  
- Vendor replies parsed using AI for:
  - Pricing  
  - Delivery days  
  - Warranty  
  - Payment terms  
- Custom scoring model:
  - 50% price  
  - 30% delivery  
  - 20% warranty  
- SendGrid inbound webhook used for real-time ingestion  
- Unique tokens in subject:
  ```
  RFP-<ID> TOKEN:<SECRET>
  ```

---

## **4.b Assumptions**
- Vendors reply in natural language  
- USD assumed  
- Subject always contains RFP ID  
- Delivery interpreted in days  
- No authentication (assignment scope)  
- Temperature = 0 for deterministic parsing  

---

# 📌 5. AI Tools Usage

## **5.a Tools Used**
- ChatGPT (GPT-4.1)  
- GitHub Copilot  
- Cursor IDE (optional)

---

## **5.b How AI Helped**
- Generated boilerplate backend & frontend structure  
- Provided schema and architectural suggestions  
- Debugged Postgres and email parsing issues  
- Wrote prompts for accurate extraction  

---

## **5.c Notable Prompts**
- “Parse this vendor email into structured JSON…”  
- “Convert this natural language RFP into items…”  
- “Fix Postgres query…”  

---

## **5.d Learnings**
- JSON-only prompts improve accuracy  
- Deterministic temperature gives predictable output  
- AI drastically improves development speed  
- Prompt engineering is key for parsing  

---



# AI-Powered-RFP-Management-System
# AI-Powered-RFP-Management-System

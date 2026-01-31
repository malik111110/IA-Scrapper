# B2B Opportunity Radar (MVP) Tech Sector

Detect where companies are spending or about to spend money on tech so agencies can pitch at the right moment.
This tool scrapes public signals (job boards, blogs, press releases) to identify intent, scoring opportunities based on hiring velocity, funding, and tech stack changes.

## 🚀 Features
- **Intelligent Discovery**: Automatically discover company career pages and job posts from index pages.
- **Intent Extraction**: OpenAI-powered deep analysis of tech roadmaps, migrations, and hiring patterns.
- **Weighted Scoring**: Heuristic model that calculates "Outsourcing Probability" based on 5 key dimensions.
- **Premium Dashboard**: Real-time visualization of B2B opportunities with sorting and classification.

## 📈 Agency Use Case
As a B2B Agency (Software Development, Cloud Migration, or Security), you can use this tool to:
1.  **Monitor Target Sectors**: Feed the radar URLs from your preferred niche (e.g., Fintech startups).
2.  **Filter High-Probability Leads**: Focus your sales team only on "High probability outsourcing candidates".
3.  **Personalized Outreaches**: Use the "Summary" and "Tech Stack" data to craft hyper-personalized emails (e.g., *"Noticed you're scaling your Kubernetes team and migrating to Java 21..."*).

## 🛠️ Setup

1.  **Virtual Environment**:
    ```bash
    source .venv/bin/activate
    ```

2.  **Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Environment Variables**:
    Copy `.env.example` to `.env` and add your `OPENAI_API_KEY`:
    ```bash
    cp .env.example .env
    ```

4.  **Playwright**:
    If not already installed (this was done during setup), install the browsers:
    ```bash
    python -m playwright install
    ```

## ▶️ Running the App

Start the server:
```bash
python -m app.main
```
Or with uvicorn directly:
```bash
uvicorn app.main:app --reload
```
The API will be available at `http://0.0.0.0:8000`.

## 📚 Documentation
See [context.md](./context.md) for detailed architecture, objectives, and the scoring model.

## 📡 API Usage

**POST /scrape**
```json
{
  "url": "https://example.com/careers",
  "instruction": "Extract hiring intent and tech stack mentions."
}
```

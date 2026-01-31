# B2B Opportunity Radar (MVP) Tech Sector 

Detect where companies are spending or about to spend money on tech so agencies can pitch at the right moment.
This tool scrapes public signals (job boards, blogs, press releases) to identify intent, scoring opportunities based on hiring velocity, funding, and tech stack changes.

## 🚀 Features
- **Scraper Layer**: Async crawling with `Crawl4AI` and `Playwright`.
- **Intent Extraction**: OpenAI-powered analysis of job posts, technical blogs, and funding news.
- **Opportunity Scoring**: Weighted scoring model (Hiring + Funding + Stack Mismatch).
- **API**: FastAPI backend for managing scrapes and viewing results.

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

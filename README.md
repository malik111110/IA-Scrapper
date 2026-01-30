# AI Web Scraper

This project uses FastAPI, Crawl4AI, and OpenAI to scrape and extract information from websites.

## Setup

1.  **Virtual Environment**: A `.venv` has been created.
    To activate it:
    ```bash
    source .venv/bin/activate
    ```

2.  **Dependencies**: Installed via `pip install -r requirements.txt`.

3.  **Environment Variables**:
    Copy `.env.example` to `.env` and add your OpenAI API Key.
    ```bash
    cp .env.example .env
    ```
    Then edit `.env`.

4.  **Playwright**: Browsers should be installed. If you encounter errors, run:
    ```bash
    python -m playwright install
    ```

## Running the App

Run the server with:
```bash
python -m app.main
```
Or with uvicorn directly:
```bash
uvicorn app.main:app --reload
```

## API Usage

**POST /scrape**
```json
{
  "url": "https://example.com",
  "instruction": "Summarize this page"
}
```

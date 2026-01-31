import asyncio
from app.services.orchestrator_service import orchestrator

async def test_run():
    # Real test URLs logic
    urls = [
        "https://openai.com/careers",
        # Adding a duplicate to test deduplication logic
        "https://openai.com/jobs" 
    ]
    
    print(f"🚀 Starting Full Pipeline for {len(urls)} URLs...")
    opportunities = await orchestrator.run_pipeline(urls)
    
    print(f"\n✅ Pipeline Finished!")
    print(f"Total Unique Opportunities: {len(opportunities)}")
    
    for opp in opportunities:
        print(f"\n--- Opportunity for {opp.company_name} ---")
        print(f"URL: {opp.url}")
        print(f"Score: {opp.score} | Classification: {opp.classification}")
        print(f"Tech Stack: {', '.join(opp.tech_stack)}")
        print(f"Signals: {len(opp.signals)}")

if __name__ == "__main__":
    asyncio.run(test_run())

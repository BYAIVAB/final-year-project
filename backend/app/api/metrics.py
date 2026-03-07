"""
Metrics API - Provides dashboard data
Real-time analytics endpoints for the dashboard
"""
from fastapi import APIRouter, HTTPException
from typing import Optional
import logging

from ..services.metrics_service import metrics_service

logger = logging.getLogger(__name__)

router = APIRouter(tags=["metrics"])


@router.get("/metrics/dashboard")
async def get_dashboard_metrics():
    """
    Returns all metrics for dashboard display.
    
    Returns aggregated data including:
    - Hero metrics (total queries, response time, sessions, health)
    - Analytics (query distribution, timeline, document usage)
    - Activity feed
    - System latency data
    """
    try:
        # Ensure metrics service is connected
        if metrics_service.db is None:
            await metrics_service.connect()
        
        data = await metrics_service.get_dashboard_metrics()
        return data
        
    except Exception as e:
        logger.error(f"Failed to get dashboard metrics: {e}", exc_info=True)
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to load dashboard metrics: {str(e)}"
        )


@router.get("/metrics/realtime")
async def get_realtime_metrics():
    """
    Returns only recently changed metrics for efficient polling.
    Use this endpoint for frequent updates (every 5 seconds).
    """
    try:
        if metrics_service.db is None:
            await metrics_service.connect()
        
        # Get minimal real-time data
        data = await metrics_service.get_dashboard_metrics()
        
        # Return only the most dynamic parts
        return {
            "hero_metrics": data.get("hero_metrics", {}),
            "activity_feed": data.get("activity_feed", [])[:5],  # Only last 5
            "last_updated": data.get("last_updated")
        }
        
    except Exception as e:
        logger.error(f"Failed to get realtime metrics: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/metrics/accuracy/feedback")
async def submit_accuracy_feedback(
    message_id: str,
    rating: str  # "correct" | "partial" | "missed"
):
    """
    Allow users to rate response accuracy.
    This improves the RAG accuracy metric over time.
    """
    try:
        if rating not in ["correct", "partial", "missed"]:
            raise HTTPException(
                status_code=400, 
                detail="Rating must be 'correct', 'partial', or 'missed'"
            )
        
        if metrics_service.db is None:
            await metrics_service.connect()
        
        # Store feedback
        await metrics_service.db.metrics_feedback.insert_one({
            "message_id": message_id,
            "rating": rating,
            "timestamp": __import__('datetime').datetime.utcnow()
        })
        
        return {"status": "success", "message": "Feedback recorded"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to submit feedback: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/metrics/health")
async def get_metrics_health():
    """
    Health check for metrics service.
    """
    try:
        if metrics_service.db is None:
            await metrics_service.connect()
        
        # Quick DB ping
        await metrics_service.db.command("ping")
        
        return {
            "status": "healthy",
            "db_connected": True
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "db_connected": False,
            "error": str(e)
        }

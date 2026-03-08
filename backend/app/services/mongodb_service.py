"""
MongoDB Service
Async operations with Motor driver for speed

[v2.1 Update] Fixed timestamp timezone issue - now using timezone-aware UTC datetimes
"""
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Dict, Optional
from bson import ObjectId
from datetime import datetime, timezone
import logging

from ..config import settings

logger = logging.getLogger(__name__)


class MongoDBService:
    """
    Fast async MongoDB operations using Motor.
    """
    
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None
    
    async def connect(self):
        """Connect to MongoDB"""
        self.client = AsyncIOMotorClient(settings.MONGODB_URL)
        self.db = self.client[settings.MONGODB_DB]
        logger.info("MongoDB connected")
    
    async def disconnect(self):
        """Disconnect from MongoDB"""
        if self.client:
            self.client.close()
            logger.info("MongoDB disconnected")
    
    # Conversations
    async def create_conversation(self, title: str = "New Chat") -> str:
        """Create new conversation"""
        result = await self.db.conversations.insert_one({
            "title": title,
            "created_at": datetime.now(timezone.utc),
            "last_active": datetime.now(timezone.utc)
        })
        return str(result.inserted_id)
    
    async def get_conversations(self, limit: int = 50) -> List[Dict]:
        """Get all conversations"""
        cursor = self.db.conversations.find().sort("last_active", -1).limit(limit)
        conversations = await cursor.to_list(length=limit)
        
        # Convert ObjectId to string
        for conv in conversations:
            conv["_id"] = str(conv["_id"])
        
        return conversations
    
    async def get_conversation(self, conversation_id: str) -> Optional[Dict]:
        """Get single conversation"""
        conv = await self.db.conversations.find_one({"_id": ObjectId(conversation_id)})
        if conv:
            conv["_id"] = str(conv["_id"])
        return conv
    
    async def delete_conversation(self, conversation_id: str):
        """Delete conversation"""
        await self.db.conversations.delete_one({"_id": ObjectId(conversation_id)})
        await self.db.messages.delete_many({"conversation_id": ObjectId(conversation_id)})
        await self.db.documents.delete_many({"conversation_id": ObjectId(conversation_id)})
    
    async def update_conversation_activity(self, conversation_id: str):
        """Update last_active timestamp"""
        await self.db.conversations.update_one(
            {"_id": ObjectId(conversation_id)},
            {"$set": {"last_active": datetime.now(timezone.utc)}}
        )
    
    # Messages
    async def save_message(
        self,
        conversation_id: str,
        role: str,
        content: str,
        metadata: Dict = None
    ) -> str:
        """Save message (FAST)"""
        result = await self.db.messages.insert_one({
            "conversation_id": ObjectId(conversation_id),
            "role": role,
            "content": content,
            "created_at": datetime.now(timezone.utc),
            "metadata": metadata or {}
        })
        return str(result.inserted_id)
    
    async def get_messages(
        self,
        conversation_id: str,
        limit: int = 50
    ) -> List[Dict]:
        """Get conversation messages"""
        cursor = self.db.messages.find(
            {"conversation_id": ObjectId(conversation_id)}
        ).sort("created_at", 1).limit(limit)
        
        messages = await cursor.to_list(length=limit)
        
        for msg in messages:
            msg["_id"] = str(msg["_id"])
            msg["conversation_id"] = str(msg["conversation_id"])
        
        return messages
    
    async def get_recent_messages(
        self,
        conversation_id: str,
        limit: int = 10
    ) -> List[Dict]:
        """Get last N messages for buffer (FAST)"""
        cursor = self.db.messages.find(
            {"conversation_id": ObjectId(conversation_id)}
        ).sort("created_at", -1).limit(limit)
        
        messages = await cursor.to_list(length=limit)
        messages.reverse()  # Chronological order
        
        for msg in messages:
            msg["_id"] = str(msg["_id"])
            msg["conversation_id"] = str(msg["conversation_id"])
        
        return messages
    
    # Documents
    async def create_document(
        self,
        conversation_id: str,
        filename: str,
        status: str = "processing"
    ) -> str:
        """Create document record"""
        result = await self.db.documents.insert_one({
            "conversation_id": ObjectId(conversation_id),
            "filename": filename,
            "status": status,
            "created_at": datetime.now(timezone.utc),
            "page_count": None,
            "chunk_count": None
        })
        return str(result.inserted_id)
    
    async def update_document(
        self,
        document_id: str,
        status: str = None,
        page_count: int = None,
        chunk_count: int = None
    ):
        """Update document"""
        update_fields = {}
        if status:
            update_fields["status"] = status
        if page_count:
            update_fields["page_count"] = page_count
        if chunk_count:
            update_fields["chunk_count"] = chunk_count
        if status == "completed":
            update_fields["completed_at"] = datetime.now(timezone.utc)
        
        await self.db.documents.update_one(
            {"_id": ObjectId(document_id)},
            {"$set": update_fields}
        )
    
    async def get_documents(self, conversation_id: str) -> List[Dict]:
        """Get documents for conversation"""
        cursor = self.db.documents.find(
            {"conversation_id": ObjectId(conversation_id)}
        ).sort("created_at", -1)
        
        documents = await cursor.to_list(length=None)
        
        for doc in documents:
            doc["_id"] = str(doc["_id"])
            doc["conversation_id"] = str(doc["conversation_id"])
        
        return documents


# Global instance
mongodb_service = MongoDBService()

# backend/db.py
from supabase import create_client
import os
from datetime import datetime
import uuid

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)


def get_or_create_conversation(
    supabase,
    user_id: str,
    conversation_id: str | None = None
):
    # 1. Si viene conversation_id, intentamos cargarla
    if conversation_id:
        res = (
            supabase.table("conversations")
            .select("*")
            .eq("id", conversation_id)
            .single()
            .execute()
        )
        if res.data:
            return res.data

    # 2. Si no existe, creamos una nueva
    new_conversation = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "title": "Nueva conversación",
        "messages": [],
        "created_at": datetime.utcnow().isoformat(),
    }

    supabase.table("conversations").insert(new_conversation).execute()
    return new_conversation


# db.py
import os
from typing import List, Dict, Any, Optional
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def upsert_conversation(user_id, messages, conversation_id=None):
    if conversation_id is None:
        # primer mensaje del hilo = primer role user
        title = ""
        for m in messages:
            if m.get("role") == "user":
                title = m.get("content", "")[:80]  # recortado
                break

        result = (
            supabase.table("conversations")
            .insert(
                {
                    "user_id": user_id,
                    "title": title,
                    "messages": messages,
                }
            )
            .execute()
        )
        return result.data[0]["id"]
    else:
        # añadir mensajes al hilo existente
        # obtener mensajes actuales
        existing = (
            supabase.table("conversations")
            .select("messages")
            .eq("id", conversation_id)
            .eq("user_id", user_id)
            .single()
            .execute()
        )
        current = existing.data.get("messages") or []
        updated = current + messages

        (
            supabase.table("conversations")
            .update({"messages": updated})
            .eq("id", conversation_id)
            .eq("user_id", user_id)
            .execute()
        )
        return conversation_id

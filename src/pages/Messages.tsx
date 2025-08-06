import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { db } from "@/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";

/**
 * Messages page provides a simple chat interface using Firebase
 * Firestore. Each user has a dedicated conversation identified by
 * their user ID and the suffix `_general`. This can be extended to
 * support multiple conversations by storing conversation metadata in
 * a separate collection and allowing the user to select among them.
 */
// Define the shape of a chat message. Avoid using `any` so that our
// state and Firestore data are strongly typed. A message may include
// a Firestore timestamp for ordering.
export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp?: Timestamp | null;
}

const Messages = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Derive a conversation ID. In a full implementation this would be
  // the ID of the conversation selected by the user. Here we use a
  // deterministic ID based on the current user's ID for a one-on-one
  // chat with an imaginary assistant.
  const conversationId = `${user.id}_general`;

  // Listen to messages in the conversation ordered by timestamp
  useEffect(() => {
    const messagesRef = collection(db, "conversations", conversationId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Map Firestore documents to our strongly typed ChatMessage. Cast the
      // document data to the expected shape instead of `any` so TypeScript
      // can validate fields. Unknown or extra fields will simply be ignored.
      setMessages(
        snapshot.docs.map((doc) => {
          const data = doc.data() as {
            senderId: string;
            text: string;
            timestamp?: Timestamp | null;
          };
          return { id: doc.id, ...data } as ChatMessage;
        })
      );
    });
    return () => unsubscribe();
  }, [conversationId]);

  // Send a new message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const messagesRef = collection(db, "conversations", conversationId, "messages");
    await addDoc(messagesRef, {
      senderId: user.id,
      text: newMessage.trim(),
      timestamp: serverTimestamp(),
    });
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-[var(--sidebar-width)] xl:mr-80 pt-[var(--header-height)]">
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Messages</h2>
            <div className="border rounded-lg p-4 max-w-xl mx-auto flex flex-col h-[60vh]">
              <div className="flex-1 overflow-y-auto space-y-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === user.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-sm px-3 py-2 rounded-lg text-sm ${
                        msg.senderId === user.id
                          ? "bg-travel-green text-white rounded-br-none"
                          : "bg-muted text-foreground rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSend} className="mt-4 flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrire un message..."
                />
                <Button type="submit" className="shrink-0">
                  Envoyer
                </Button>
              </form>
            </div>
          </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
};

export default Messages;
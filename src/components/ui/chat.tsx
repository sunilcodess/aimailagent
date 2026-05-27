import { useEffect, useState } from "react";

interface Message {
  sender: string;
  message: string;
}

interface Props {
  chatId: number | null;
  userId: number;
}

export default function Chat({ chatId, userId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!chatId) return;

    fetch(`http://localhost/leavecraft/backend/get_messages.php?chat_id=${chatId}`)
      .then(res => res.json())
      .then(setMessages);
  }, [chatId]);

  const sendMessage = () => {
    if (!input) return;

    fetch("http://localhost/leavecraft/backend/send_message.php", {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        chat_id: chatId,
        message: input
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error === "limit") {
        alert("Daily limit reached! Upgrade to Pro 🚀");
        return;
      }

      setMessages([...messages, { sender: "user", message: input }]);
      setInput("");
    });
  };

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={m.sender}>
            {m.message}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
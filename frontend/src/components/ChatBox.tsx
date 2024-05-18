import React, { useState, useEffect, useRef } from "react";
import "./Chatbox.css"; // Import CSS for styling
import CloseIcon from "../../public/x-solid.svg";
import SearchIcon from "../../public/search-icon.svg";

interface QAItem {
  question: string;
  answer: string;
}

interface ChatBoxProps {
  title: string;
  content: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  // const [answer, setAnswer] = useState<string>("");
  const [qaList, setQAList] = useState<QAItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;

    // Make the request to your backend API
    try {
      const query =
        title + " " + content + ".In context of above information, " + question;
      const response = await fetch("http://127.0.0.1:3010/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query }),
      });

      const data = await response.json();

      const newQA: QAItem = {
        question,
        answer: data.response || "No answer found",
      };
      setQAList([...qaList, newQA]);
      setQuestion("");
    } catch (error) {
      console.error("Error fetching answer:", error);
    }
  };

  const handleDelete = (index: number) => {
    const newList = [...qaList];
    newList.splice(index, 1);
    setQAList(newList);
  };

  useEffect(() => {
    // Scroll to the bottom of the list when it updates
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [qaList]);

  return (
    <div className={`chatbox ${isOpen ? "open" : ""}`}>
      <button
        className={`toggle-button mt-2 ml-2 ${isOpen ? "open" : ""}`}
        onClick={toggleChatbox}
      >
        {isOpen ? <img src={CloseIcon} alt="Close" className="logo" /> : "Q/A"}
      </button>
      {isOpen && (
        <div className="chat-content">
          <div className="messages">
            {qaList.map((item, index) => (
              <div key={index} className="message">
                <div>
                  <strong>Question:</strong> {item.question}
                </div>
                <div>
                  <strong>Answer:</strong> {item.answer}
                </div>
                <button
                  className="bg-red-500 p-2 mt-2 text-white hover:bg-red-600 rounded-lg"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-container ">
            <div className="input-wrapper ">
              <input
                type="text"
                className="border-solid border-1 border-gray-300 rounded-lg"
                placeholder="Type your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />

              <button onClick={handleSubmit} className="search-button">
                <img src={SearchIcon} alt="Search" className="Search" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;

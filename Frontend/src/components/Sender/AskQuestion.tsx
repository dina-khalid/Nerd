import React, { useState, ChangeEvent, FormEvent } from "react";

interface AskQuestionResponse {
  answer: string;
  source_documents: string[];
}

const AskQuestion: React.FC = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data: AskQuestionResponse = await response.json();
        setAnswer(data.answer);
      } else {
        // Handle error response
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      // Handle network error
      console.error("Request failed:", (error as Error).message);
    }

    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={query} onChange={handleInputChange} />
        <button type="submit" disabled={loading}>
          Ask
        </button>
      </form>
      {loading ? <p>Loading...</p> : null}
      {answer ? <p>Answer: {answer}</p> : null}
    </div>
  );
};

export default AskQuestion;

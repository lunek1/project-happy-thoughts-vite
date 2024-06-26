import { useState, useEffect } from "react";
import { LikeButton } from "../Button/LikeButton.jsx";
import "./ThoughtList.css";

export const ThoughtList = () => {
  const [thoughts, setThoughts] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");

  const API_ENDPOINT =
    "https://project-happy-thoughts-api-qgyf.onrender.com/thoughts";
  const METHOD = "GET";

  const fetchThoughts = async () => {
    try {
      const response = await fetch(API_ENDPOINT, { method: METHOD });
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();
      setThoughts(data);
    } catch (error) {
      console.error("Error fetching thoughts:", error);
    }
  };

  useEffect(() => {
    fetchThoughts();
    const fetchInterval = setInterval(fetchThoughts, 60000);
    return () => {
      clearInterval(fetchInterval);
    };
  }, []);

  const calculateTimeDifference = (timestamp) => {
    const currentTime = new Date();
    const thoughtTime = new Date(timestamp);
    const timeDifferenceInSeconds = Math.floor(
      (currentTime - thoughtTime) / 1000
    );

    if (timeDifferenceInSeconds < 60) {
      return `${timeDifferenceInSeconds} seconds ago`;
    } else if (timeDifferenceInSeconds < 3600) {
      const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
      return `${timeDifferenceInMinutes} minutes ago`;
    } else if (timeDifferenceInSeconds < 86400) {
      const timeDifferenceInHours = Math.floor(timeDifferenceInSeconds / 3600);
      return `${timeDifferenceInHours}h ago`;
    } else if (timeDifferenceInSeconds < 604800) {
      const timeDifferenceInDays = Math.floor(timeDifferenceInSeconds / 86400);
      return timeDifferenceInDays === 1
        ? `${timeDifferenceInDays} day ago`
        : `${timeDifferenceInDays} days ago`;
    } else if (timeDifferenceInSeconds < 31536000) {
      const timeDifferenceInWeeks = Math.floor(
        timeDifferenceInSeconds / 604800
      );
      return timeDifferenceInWeeks === 1
        ? `${timeDifferenceInWeeks} week ago`
        : `${timeDifferenceInWeeks} weeks ago`;
    } else {
      const timeDifferenceInYears = Math.floor(
        timeDifferenceInSeconds / 31536000
      );
      return timeDifferenceInYears === 1
        ? `${timeDifferenceInYears} year ago`
        : `${timeDifferenceInYears} years ago`;
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "newest" ? "oldest" : "newest"));
  };

  const sortedThoughts = [...thoughts].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });

  return (
    <div className="thought-list">
      <button onClick={toggleSortOrder} className="sort-button">
        Sort by {sortOrder === "newest" ? "Oldest" : "Newest"}
      </button>
      {sortedThoughts.map((thought) => (
        <div key={thought._id} className="thought-container">
          <div className="thought-message">
            <p>{thought.text}</p>
          </div>
          <div className="action-container">
            <LikeButton
              thoughtId={thought._id}
              initialLikes={thought.hearts}
              onLike={fetchThoughts}
            />
            <p className="timestamp">
              {calculateTimeDifference(thought.createdAt)}
            </p>
          </div>
        </div>
      ))}
      <button className="scroll-to-top" onClick={handleScrollToTop}>
        <svg xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5.83L16.17 10l1.41-1.41L12 3l-5.58 5.58L7.83 10z" />
          <path fill="none" d="M0 0h24v24H0z" />
        </svg>
      </button>
    </div>
  );
};

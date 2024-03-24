import { useState } from "react";
import "./LikeButton.css";

export const LikeButton = ({ thoughtId, initialLikes, onLike }) => {
  const [likes, setLikes] = useState(initialLikes);

  const handleLikeClick = async () => {
    try {
      const response = await fetch(
        `https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts/${thoughtId}/like`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to like the thought");
      }

      setLikes((prevLikes) => prevLikes + 1);
      onLike();
    } catch (error) {
      console.error("Error liking thought:", error);
    }
  };

  return (
    <div className="like-button-container">
      <button
        onClick={handleLikeClick}
        className={`like-button${likes > 0 ? " liked" : ""}`}
      >
        ❤️
      </button>
      <span className="like-counter">x {likes}</span>
    </div>
  );
};
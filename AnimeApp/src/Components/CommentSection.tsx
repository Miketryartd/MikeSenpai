import React, { useState } from "react";
import { useComment } from "../Hooks/useComment";
import { useParams } from "react-router";

function CommentSection() {
  const { loading, error, addComment } = useComment();
  const [comment, setComment] = useState<string>("");
   
  const {id, finder} = useParams();
  if (!id || !finder) return <p>Invalid route</p>
  console.log(id, finder);
  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) return;

    const success = await addComment(comment, id, finder);
   
    if (success) {
      setComment(""); 
    }
  };

  return (
    <div className="w-full  max-w-xl mx-auto mt-4">
      
 
      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}

      <form
        onSubmit={handleComment}
        className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-purple-800 active:border-purple-800 rounded-xl px-3 py-2 shadow-md"
      >
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1 bg-transparent outline-none text-white placeholder-zinc-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="p-2 rounded-lg cursor-pointer hover:bg-zinc-800 transition disabled:opacity-50"
        >
          {loading ? (
            <span className="text-xs text-zinc-400">...</span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124" />
              <path d="M6.5 12h14.5" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}

export default CommentSection;
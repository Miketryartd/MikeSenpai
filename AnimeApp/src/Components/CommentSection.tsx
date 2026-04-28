import React, { useState, useEffect } from "react";
import { useComment } from "../Hooks/useComment";
import { useParams } from "react-router";

function CommentSection() {
  const { loading, error, addComment, loadComments, comments } = useComment();
  const [comment, setComment] = useState<string>("");
   
  const {id, finder} = useParams();
  if (!id || !finder) return <p>Invalid route</p>

  useEffect(() => {
  loadComments(id, finder);
}, [id, finder]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) return;

    const success = await addComment(comment, id, finder);
   
    if (success) {
      setComment(""); 
       await loadComments(id, finder);
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

    <div className="mt-6 space-y-3">
  {Array.isArray(comments) &&
    comments.map((c) => (
      <div
        key={c._id}
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-sm hover:border-purple-700 transition"
      >
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-zinc-400">{c.email.slice(0, 5)}</p>
          <p className="text-[10px] text-zinc-500">
            {new Date(c.createdAt).toLocaleString()}
          </p>
        </div>

        <p className="text-white text-sm leading-relaxed">
          {c.comment}
        </p>
      </div>
    ))}
</div>
    </div>
  );
}

export default CommentSection;
// components/social/Poll.tsx
"use client";

import { useState } from "react";
import { Vote } from "lucide-react";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollProps {
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVoted?: boolean;
  onVote: (optionId: string) => void;
}

export default function Poll({ question, options, totalVotes, userVoted = false, onVote }: PollProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [voted, setVoted] = useState(userVoted);

  const handleVote = (optionId: string) => {
    if (voted) return;
    setSelectedOption(optionId);
    setVoted(true);
    onVote(optionId);
  };

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
      <p className="text-sm font-semibold text-gray-800 mb-2">{question}</p>
      <div className="space-y-2">
        {options.map((option) => {
          const percentage = getPercentage(option.votes);
          const isSelected = selectedOption === option.id;
          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={voted}
              className={`w-full text-left relative overflow-hidden rounded-lg p-2 transition-all ${
                voted ? 'cursor-default' : 'hover:bg-orange-50 active:scale-98'
              } ${isSelected ? 'bg-orange-100 border border-orange-300' : 'bg-white border border-gray-200'}`}
            >
              <div
                className="absolute left-0 top-0 h-full bg-orange-100/50 rounded-lg transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
              <div className="relative flex justify-between items-center z-10">
                <span className="text-sm font-medium text-gray-700">{option.text}</span>
                {voted && <span className="text-xs font-semibold text-orange-600">{percentage}%</span>}
              </div>
            </button>
          );
        })}
      </div>
      {voted && (
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <Vote size={12} /> মোট ভোট: {totalVotes}
        </p>
      )}
    </div>
  );
}
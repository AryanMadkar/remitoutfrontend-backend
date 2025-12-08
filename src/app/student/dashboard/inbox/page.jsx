"use client";

import { useState } from "react";
import { Send, Paperclip, Smile, ArrowRight } from "lucide-react";

export default function InboxPage() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageText, setMessageText] = useState("");

  const messages = [
    {
      id: 1,
      bank: "Bank Name",
      preview:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
      fullText:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
      time: "2h ago",
      unread: true,
    },
    {
      id: 2,
      bank: "Bank Name",
      preview:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
      fullText:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
      time: "5h ago",
      unread: false,
    },
    {
      id: 3,
      bank: "Bank Name",
      preview:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
      fullText:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
      time: "1d ago",
      unread: false,
    },
  ];

  const activeMessage = selectedMessage || messages[0];

  const handleSend = () => {
    if (!messageText.trim()) return;
    // Hook your API here
    setMessageText("");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Inbox</h1>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Message list */}
        <div className="rounded-xl border border-orange-100 bg-white shadow-sm">
          <div className="border-b border-orange-50 px-4 py-3">
            <p className="text-sm font-semibold text-gray-900">Messages</p>
          </div>
          <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-100">
            {messages.map((message) => (
              <button
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors ${
                  activeMessage.id === message.id ? "bg-orange-50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {message.bank}
                      </p>
                      {message.unread && (
                        <span className="h-2 w-2 rounded-full bg-orange-500" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                      {message.preview}
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap">
                    {message.time}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active conversation */}
        <div className="rounded-xl border border-orange-100 bg-white shadow-sm flex flex-col">
          <div className="border-b border-orange-50 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {activeMessage.bank}
              </p>
              <p className="text-xs text-gray-500">Loan application query</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm text-gray-700">
            <p>{activeMessage.fullText}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <ArrowRight className="h-3 w-3" />
              Latest reply from bank
            </div>
          </div>

          <div className="border-t border-orange-50 bg-orange-50 px-4 py-3">
            <div className="flex items-end gap-2">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={2}
                placeholder="Type your message..."
                className="flex-1 resize-none rounded-lg border border-orange-100 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex flex-col gap-2">
                <button
                  className="p-2 rounded-lg bg-white border border-orange-100 hover:bg-orange-100"
                  aria-label="Attach file"
                >
                  <Paperclip className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  className="p-2 rounded-lg bg-white border border-orange-100 hover:bg-orange-100"
                  aria-label="Emoji"
                >
                  <Smile className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={!messageText.trim()}
                className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

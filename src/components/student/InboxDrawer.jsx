"use client";

import { X, Send, Paperclip, Smile, ArrowRight, Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function InboxDrawer({ isOpen, onClose }) {
  const [messageText, setMessageText] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const messages = [
    { id: 1, bank: "HDFC Bank", preview: "Your loan application has been approved. Please submit the required documents.", time: "2h ago", hasReply: true, unread: true },
    { id: 2, bank: "ICICI Bank", preview: "We need additional information regarding your application.", time: "5h ago", hasReply: false, unread: true },
    { id: 3, bank: "SBI", preview: "Thank you for your interest. Our team will contact you soon.", time: "1d ago", hasReply: false, unread: false },
    { id: 4, bank: "Axis Bank", preview: "Your document verification is in progress.", time: "2d ago", hasReply: false, unread: false },
  ];

  const handleSend = () => {
    if (messageText.trim()) {
      console.log("Sending message:", messageText);
      setMessageText("");
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const filteredMessages = messages.filter(msg =>
    msg.bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full sm:w-[480px] bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Inbox</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close inbox"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>No messages found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredMessages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      message.unread ? "bg-orange-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-sm font-semibold ${message.unread ? "text-orange-700" : "text-gray-900"}`}>
                            {message.bank}
                          </h3>
                          {message.unread && (
                            <span className="h-2 w-2 rounded-full bg-orange-600"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{message.preview}</p>
                        {message.hasReply && (
                          <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                            <ArrowRight className="h-3 w-3" />
                            Reply received
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{message.time}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your message..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
                <div className="flex items-center gap-2 mt-2">
                  <button
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    aria-label="Attach file"
                  >
                    <Paperclip className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    aria-label="Add emoji"
                  >
                    <Smile className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={!messageText.trim()}
                className="p-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

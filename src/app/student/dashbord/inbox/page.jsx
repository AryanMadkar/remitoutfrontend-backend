"use client";
import { useState } from "react";
import ProfileSidebar from "@/components/student/ProfileSidebar";
import { Send, Paperclip, Smile, X, ArrowRight } from "lucide-react";

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
    {
      id: 4,
      bank: "Bank Name",
      preview:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
      fullText:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
      time: "2d ago",
      unread: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="xl:col-span-2">
        <div className="bg-white rounded-xl border-2 border-blue-400 overflow-hidden">
          {/* Header */}
          <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-orange-500">Inbox</h2>
            <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
              06
            </span>
          </div>

          {/* Messages List */}
          <div className="divide-y divide-gray-100">
            {messages.map((message) => (
              <div
                key={message.id}
                className="p-4 sm:p-6 hover:bg-orange-50/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2">
                      {message.bank}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      {message.preview}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Lorem ipsum dolor sit.
                    </p>
                  </div>

                  <button className="text-gray-400 hover:text-gray-600 mt-1">
                    <X size={20} />
                  </button>
                </div>

                {/* Message Input - Shows for first message */}
                {message.id === 1 && (
                  <div className="mt-4 border border-purple-200 rounded-lg overflow-hidden">
                    <input
                      type="text"
                      placeholder="Send message"
                      className="w-full px-4 py-3 focus:outline-none text-sm"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100">
                      <div className="flex gap-3">
                        <button className="text-gray-400 hover:text-purple-600">
                          <Paperclip size={18} />
                        </button>
                        <button className="text-gray-400 hover:text-purple-600">
                          <Smile size={18} />
                        </button>
                      </div>
                      <button className="text-purple-600 hover:text-purple-700">
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Message Button - Shows for other messages */}
                {message.id !== 1 && (
                  <button className="px-6 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2">
                    <span>Message</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* View More */}
          <div className="p-4 border-t border-gray-100">
            <button className="w-full py-3 text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition-colors">
              View More ↓
            </button>
          </div>
        </div>
      </div>

      {/* Profile Sidebar */}
      <div className="xl:col-span-1">
        <ProfileSidebar className="sticky top-24" />
      </div>
    </div>
  );
}

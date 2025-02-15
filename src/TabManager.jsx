import React, { useState, useEffect } from "react";
import "./Tab.css"

// Predefined categories with keywords
const categories = {
  "Social Media": ["facebook", "twitter", "instagram", "linkedin"],
  Work: ["github", "slack", "notion", "jira"],
  News: ["bbc", "cnn", "nytimes", "theguardian"],
};

// Function to find the matching keyword for a URL
const findKeyword = (url) => {
  for (const [category, keywords] of Object.entries(categories)) {
    for (const keyword of keywords) {
      if (url.includes(keyword)) {
        return { category, keyword };
      }
    }
  }
  return { category: "Others", keyword: "General" };
};

const TabManager = () => {
  const [tabs, setTabs] = useState([]);

  // Load saved tabs from local storage only once when component mounts
  useEffect(() => {
    const savedTabs = localStorage.getItem("tabs");
    if (savedTabs) {
      setTabs(JSON.parse(savedTabs));
    }
  }, []);

  // Save tabs to local storage whenever they change
  useEffect(() => {
    if (tabs.length > 0) {
      localStorage.setItem("tabs", JSON.stringify(tabs));
    }
  }, [tabs]);

  const [newTabUrl, setNewTabUrl] = useState("");

  const addTab = () => {
    if (!newTabUrl.trim()) return;

    const { category, keyword } = findKeyword(newTabUrl);
    const updatedTabs = [...tabs, { id: Date.now(), keyword, category }];

    setTabs(updatedTabs);
    setNewTabUrl("");
  };

  const removeTab = (id) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(updatedTabs);

    if (updatedTabs.length === 0) {
      localStorage.removeItem("tabs");
    }
  };

  const clearAllTabs = () => {
    setTabs([]);
    localStorage.removeItem("tabs");
  };

  // Grouping tabs by category
  const groupedTabs = tabs.reduce((acc, tab) => {
    acc[tab.category] = acc[tab.category] || [];
    acc[tab.category].push(tab);
    return acc;
  }, {});

  return (
    <div className="p-5 max-w-5xl mx-auto" id="main">
      <h2 className="text-2xl font-bold mb-4 text-center" id="head">Tab Manager</h2>

      {/* Add Tab Section */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          className="border p-2 w-full rounded"
          placeholder="Enter tab URL "
          value={newTabUrl}
          onChange={(e) => setNewTabUrl(e.target.value)}
          id="input"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" id="addtab" onClick={addTab}>
          Add Tab
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded" id="clearall" onClick={clearAllTabs}>
          Clear All
        </button>
      </div>

      {/* Display Tabs in Columns for Each Category */}

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {["Social Media", "Work", "News", "Others"].map((category) => (
          <div key={category} className="border p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-center">{category}</h3>
            <div className="space-y-2">
              {groupedTabs[category]?.length > 0 ? (
                groupedTabs[category].map((tab) => (
                  <div
                    key={tab.id}
                    className="flex justify-between bg-gray-100 px-3 py-2 rounded-md shadow-md"
                  >
                    <span className="font-medium">{tab.keyword}</span>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded" id="remove"
                      onClick={() => removeTab(tab.id)}
                    >
                      ✖
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No tabs in this category</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabManager;

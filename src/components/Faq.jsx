"use client";

import { useState } from "react";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "What is Frigora and how does it work?",
          answer:
            "Frigora is a smart food inventory management app that helps you track your food items, monitor expiration dates, and reduce food waste. Simply add your food items with their expiration dates, and Frigora will remind you when items are about to expire.",
        },
        {
          question: "How do I add food items to my inventory?",
          answer:
            "You can add food items by clicking the 'Add Food Items' button on your dashboard. Enter the food name, category, quantity, location (fridge, pantry, etc.), and expiration date. You can also scan barcodes for faster entry.",
        },
        {
          question: "Is Frigora free to use?",
          answer:
            "Yes, Frigora is completely free to use. We believe everyone should have access to tools that help reduce food waste and save money.",
        },
      ],
    },
    {
      category: "Food Management",
      questions: [
        {
          question: "How do I track when food items expire?",
          answer:
            "When you add food items, make sure to include the expiration date. Frigora will automatically track these dates and send you notifications when items are approaching their expiration date.",
        },
        {
          question: "Can I organize food by different storage locations?",
          answer:
            "Yes! You can categorize your food by storage location such as refrigerator, freezer, pantry, or any custom location you create. This helps you quickly find items when cooking.",
        },
        {
          question: "What happens when I use or consume food items?",
          answer:
            "When you use food items, you can mark them as 'used' in the app. This helps track your consumption patterns and calculates your food waste reduction statistics.",
        },
        {
          question: "How do I handle leftovers?",
          answer:
            "You can add leftovers as new items with their own expiration dates. Typically, leftovers last 3-4 days in the refrigerator, but you can adjust this based on the type of food.",
        },
      ],
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about Frigora.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {faqData.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              {/* Category Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {category.category}
                </h2>
              </div>

              {/* Questions */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {category.questions.map((faq, questionIndex) => {
                  const globalIndex = categoryIndex * 100 + questionIndex;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div key={questionIndex}>
                      <button
                        onClick={() => toggleFaq(globalIndex)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-800 dark:text-white pr-4">
                            {faq.question}
                          </h3>
                          <span
                            className={`text-gray-400 transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          >
                            ▼
                          </span>
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;

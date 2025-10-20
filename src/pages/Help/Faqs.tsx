import React, { useState } from "react";

const faqsData = [
  {
    "id": 1,
    "sectionName": "General",
    "faqQuestions": [
      {
        "id": 101,
        "questionText": "What is UCP?",
        "answerText": "UCP is a cooperative platform that allows members to save, borrow, and access financial services easily."
      },
      {
        "id": 102,
        "questionText": "Who can join UCP?",
        "answerText": "Anyone who meets the membership requirements set by the cooperative can join."
      }
    ]
  },
  {
    "id": 2,
    "sectionName": "Account & Membership",
    "faqQuestions": [
      {
        "id": 201,
        "questionText": "How do I become a member?",
        "answerText": "You can become a member by completing the registration form online and paying the required membership fee."
      },
      {
        "id": 202,
        "questionText": "Can I update my personal details?",
        "answerText": "Yes, you can update your profile details anytime from your member dashboard under settings."
      }
    ]
  },
  {
    "id": 3,
    "sectionName": "Loans",
    "faqQuestions": [
      {
        "id": 301,
        "questionText": "How do I apply for a loan?",
        "answerText": "Log in to your dashboard, navigate to the Loans section, and fill in the loan application form."
      },
      {
        "id": 302,
        "questionText": "What is the maximum loan amount I can apply for?",
        "answerText": "The maximum loan amount depends on your contributions, guarantors, and the cooperative’s loan policy."
      }
    ]
  },
  {
    "id": 4,
    "sectionName": "Savings",
    "faqQuestions": [
      {
        "id": 401,
        "questionText": "How do I make savings deposits?",
        "answerText": "You can make deposits through bank transfer, debit card, or by visiting our office."
      },
      {
        "id": 402,
        "questionText": "Can I withdraw from my savings anytime?",
        "answerText": "Withdrawals depend on the cooperative’s savings policy. Some accounts allow instant withdrawal, while others require notice."
      }
    ]
  }
]


const Faqs = () => {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="mt-4 space-y-6 bg-white p-10 rounded-lg">
      {faqsData.map(section => (
        <div key={section.id} className="border rounded-t-[16px]">
          <h3 className="bg-[#043d73] text-white rounded-t-[16px] px-4 py-2 font-semibold">{section.sectionName}</h3>
          {section.faqQuestions.map(faq => (
            <div key={faq.id} className="border-t">
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex justify-between items-center px-4 py-2 text-left font-medium hover:bg-gray-50"
              >
                {faq.questionText}
                <span>{openId === faq.id ? "−" : "+"}</span>
              </button>
              {openId === faq.id && (
                <div className="px-4 py-2 text-gray-600">{faq.answerText}</div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Faqs;

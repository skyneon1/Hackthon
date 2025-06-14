import React, { useState, useEffect } from 'react'
import './FAQ.css'

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedIndex, setExpandedIndex] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const faqData = [
    {
      question: 'What services do you offer?',
      answer: 'We offer a range of healthcare services including virtual consultations, health monitoring, and access to medical records.'
    },
    {
      question: 'How do I schedule a consultation?',
      answer: 'You can schedule a consultation through our online portal or by calling our support team.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use industry-standard encryption and security measures to protect your data.'
    },
    {
      question: 'How can I access my medical records?',
      answer: 'You can access your medical records through your personal dashboard after logging in.'
    },
    {
      question: 'What health monitoring tools are available?',
      answer: 'We provide various health monitoring tools including vital signs tracking and medication reminders.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, insurance plans, and other payment methods.'
    },
    {
      question: 'How do I get technical support?',
      answer: 'Our technical support team is available 24/7 through chat, email, or phone.'
    },
    {
      question: 'Are your doctors licensed?',
      answer: 'Yes, all our healthcare providers are fully licensed and certified.'
    }
  ]

  const filteredFAQs = faqData.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="faq-container">
      <h1 className="faq-title">Frequently Asked Questions</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredFAQs.map((item, index) => (
        <div
          key={index}
          className="faq-item"
          style={{
            opacity: 0,
            transform: 'translateY(20px)',
            animation: `fadeIn 0.3s ease forwards ${index * 0.1}s`
          }}
        >
          <div 
            className="question"
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            {item.question}
            <span>{expandedIndex === index ? '−' : '+'}</span>
          </div>
          {expandedIndex === index && (
            <div className="answer">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  )
}

export default FAQ 
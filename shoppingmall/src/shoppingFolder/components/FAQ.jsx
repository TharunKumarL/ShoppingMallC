import React, { useState, useRef } from 'react';
import '../components/css/FAQ.css';

const FAQ = () => {
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);
  const answerRefs = useRef([]);

  const toggleAnswer = (index) => {
    setOpenQuestionIndex(openQuestionIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "How do I log in to the website?",
      answer: "To log in, click on the 'Login' button located at the top right corner of the homepage. Enter your registered email address and password, then click 'Submit.' If you haven’t registered yet, sign up first."
    },
    {
      question: "What do I do if I forget my password?",
      answer: "If you forget your password, click on the 'Forgot Password?' link on the login page. Enter your registered email, and we will send you instructions to reset your password."
    },
    {
      question: "Can I log in using my Google or Facebook account?",
      answer: "Yes! You can log in using your Google or Facebook account. On the login page, click the corresponding social login button, and you will be redirected to authenticate with your preferred account."
    },
    {
      question: "How do I create an account on your website?",
      answer: "To create an account, click the 'Sign Up' button on the homepage. Fill in the required fields such as your name, email, and password, then submit. You’ll receive a confirmation email to verify your account."
    },
    {
      question: "What payment options are available on your website?",
      answer: "We accept major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, and digital wallets like Google Pay and Apple Pay."
    },
    {
      question: "Is it safe to use my credit card on your website?",
      answer: "Yes, our website uses secure encryption (SSL) to protect your personal and payment information. We do not store your credit card details on our servers."
    },
    {
      question: "How do I know my payment was successful?",
      answer: "After completing the payment, you will receive a confirmation email with your order details. Additionally, you can view your order status under the 'My Orders' section in your account."
    },
    {
      question: "Can I save my payment information for future purchases?",
      answer: "Yes, you can securely save your payment information during checkout for faster future purchases. This data is encrypted for your protection."
    },
    {
      question: "What should I do if my payment fails?",
      answer: "If your payment fails, please double-check your card details, expiration date, and available funds. You can also try using a different payment method. If the issue persists, contact our support team."
    },
    {
      question: "How do I change my payment method for an ongoing subscription?",
      answer: "To change your payment method for a subscription, log in to your account, go to 'Subscription Settings,' and update your payment details. Your new payment method will be used for the next billing cycle."
    }
  ];

  return (
    <>
      <div className="faq-header">
        <h1 className='multicolor'>FREQUENTLY ASKED QUESTIONS</h1>
        <p>Do you need some help with something or do you have some questions on some features</p>
      </div>
      <div className="faq-container">
        {faqData.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleAnswer(index)}>
              <span>{faq.question}</span>
              <span className="faq-toggle">{openQuestionIndex === index ? '-' : '+'}</span>
            </div>
            <div
              className={`faq-answer ${openQuestionIndex === index ? 'open' : ''}`}
              style={{
                height: openQuestionIndex === index ? `${answerRefs.current[index]?.scrollHeight}px` : '0',
                transition: 'height 0.4s ease'
              }}
              ref={(el) => (answerRefs.current[index] = el)}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FAQ;

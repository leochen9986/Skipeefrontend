import React from 'react'
import { AppFooter } from '../../../components'
import UserHeader from '../../../components/UserHeader'

const privacyPolicyData = {
  sections: [
    {
      heading: 'Introduction',
      content:
        'This Privacy Policy outlines how we collect, use, and protect your personal information.',
    },
    {
      heading: 'Information We Collect',
      content:
        'We may collect personal information such as your name, email address, and usage data when you use our services.',
    },
    {
      heading: 'How We Use Your Information',
      content:
        'We use your information to provide and improve our services, communicate with you, and comply with legal obligations.',
    },
    {
      heading: 'Data Security',
      content:
        'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access or disclosure.',
    },
    {
      heading: 'Your Rights',
      content:
        'You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing activities.',
    },
    {
      heading: 'Changes to This Policy',
      content:
        'We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page.',
    },
  ],
}

const PrivacyPolicy = () => {
  return (
    <>
      <UserHeader />
      <div className="privacy-policy-page">
        <style>
          {`
          .privacy-policy-page {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
          }
          .privacy-policy-page h1 {
            color: #333;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            font-size: 28px;
            font-weight: bold;
          }
          .privacy-policy-page .policy-section {
            margin-bottom: 30px;
          }
          .privacy-policy-page .policy-section h2 {
            color: #444;
            margin-top: 20px;
          }
          .privacy-policy-page .policy-section p {
            color: #666;
            margin-top: 10px;
          }
        `}
        </style>
        <h1>Privacy Policy</h1>
        {privacyPolicyData.sections.map((section, index) => (
          <div key={index} className="policy-section">
            <h2>{section.heading}</h2>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
      <AppFooter />
    </>
  )
}

export default PrivacyPolicy

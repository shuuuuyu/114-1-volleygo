import React from 'react';
import AIRuleAssistant from '../components/AIChat/AIRuleAssistant';
import './RulesPage.css';

const RulesPage = () => {
  return (
    <div className="rules-page">
      <section className="ai-section">
        <h2>🤖 AI 排球顧問</h2>
        <AIRuleAssistant />
      </section>
    </div>
  );
};

export default RulesPage;
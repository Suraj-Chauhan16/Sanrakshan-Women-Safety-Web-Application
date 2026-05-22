import React from 'react';
import './Pages.css';

function KnowYourRights() {
  return (
    <div className="page rights-page">
      <div className="hero">
        <h1>Know Your Rights</h1>
        <p>Understanding your legal protections and rights as a woman</p>
      </div>

      <section className="content-section">
        <h2>Constitutional Rights</h2>
        <div className="rights-box">
          <p>
            Every woman has fundamental constitutional rights that protect her dignity and ensure
            equal treatment under the law. These rights are the foundation of a fair and just society.
          </p>
          <ul className="rights-list">
            <li><strong>Right to Equality:</strong> Equal protection under the law without discrimination.</li>
            <li><strong>Right to Life and Liberty:</strong> Protection of your physical and mental well-being.</li>
            <li><strong>Right to Freedom:</strong> Freedom of expression, movement, and association.</li>
            <li><strong>Right to Privacy:</strong> Protection of your personal and private matters.</li>
          </ul>
        </div>
      </section>

      <section className="content-section">
        <h2>Workplace Rights</h2>
        <div className="rights-box">
          <p>
            You have specific protections in the workplace to ensure a safe and fair working environment.
          </p>
          <ul className="rights-list">
            <li><strong>Equal Pay:</strong> Right to equal pay for equal work.</li>
            <li><strong>No Discrimination:</strong> Protection against discrimination based on gender.</li>
            <li><strong>Safe Work Environment:</strong> Right to a workplace free from harassment and abuse.</li>
            <li><strong>Maternity Leave:</strong> Protection and leave benefits during pregnancy.</li>
            <li><strong>Sexual Harassment:</strong> Right to report and protection against sexual harassment.</li>
          </ul>
        </div>
      </section>

      <section className="content-section">
        <h2>Personal Safety Rights</h2>
        <div className="rights-box">
          <p>
            The law provides protections against various forms of violence and abuse.
          </p>
          <ul className="rights-list">
            <li><strong>Protection from Domestic Violence:</strong> Legal orders against abusers.</li>
            <li><strong>Protection from Sexual Assault:</strong> Criminal laws and support services.</li>
            <li><strong>Protection Orders:</strong> Restraining orders and protective orders.</li>
            <li><strong>Right to Report:</strong> Right to report crimes to law enforcement.</li>
            <li><strong>Victim Support Services:</strong> Access to counseling and medical help.</li>
          </ul>
        </div>
      </section>

      <section className="content-section">
        <h2>Health Rights</h2>
        <div className="rights-box">
          <p>
            You have the right to make decisions about your health and medical care.
          </p>
          <ul className="rights-list">
            <li><strong>Reproductive Rights:</strong> Right to make informed decisions about reproduction.</li>
            <li><strong>Medical Confidentiality:</strong> Privacy in medical information and treatment.</li>
            <li><strong>Quality Healthcare:</strong> Access to quality healthcare without discrimination.</li>
            <li><strong>Informed Consent:</strong> Right to understand and consent to medical procedures.</li>
          </ul>
        </div>
      </section>

      <section className="content-section">
        <h2>Education Rights</h2>
        <div className="rights-box">
          <p>
            Education is a fundamental right that must be accessible to all women.
          </p>
          <ul className="rights-list">
            <li><strong>Right to Education:</strong> Access to quality education at all levels.</li>
            <li><strong>Safe Schools:</strong> Right to a safe learning environment.</li>
            <li><strong>No Discrimination:</strong> Equal access to all educational opportunities.</li>
          </ul>
        </div>
      </section>

      <section className="content-section">
        <h2>Emergency Resources</h2>
        <div className="emergency-info">
          <h3>If You Need Help:</h3>
          <p><strong>National Domestic Violence Hotline:</strong> 1-800-799-7233</p>
          <p><strong>National Sexual Assault Hotline:</strong> 1-800-656-4673</p>
          <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
          <p><strong>Emergency Services:</strong> 911</p>
        </div>
      </section>

      <section className="content-section">
        <h2>Know Your Options</h2>
        <p>
          If you are facing discrimination, harassment, or violence, you have several options:
        </p>
        <ul className="options-list">
          <li>Report to law enforcement (police)</li>
          <li>Contact local advocacy organizations</li>
          <li>Seek legal counsel from an attorney</li>
          <li>File complaints with government agencies</li>
          <li>Access support services and counseling</li>
          <li>Reach out to trusted friends and family</li>
        </ul>
      </section>

      <section className="content-section info-box">
        <h3>Remember:</h3>
        <p>
          Your rights are protected by law. You are never alone. Whether you need legal advice,
          support, or just someone to talk to, resources are available to help you. Don't hesitate
          to reach out and seek help when you need it.
        </p>
      </section>
    </div>
  );
}

export default KnowYourRights;

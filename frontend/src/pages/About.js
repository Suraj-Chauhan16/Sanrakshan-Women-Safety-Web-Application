import React from 'react';
import './Pages.css';

function About() {
  return (
    <div className="page about-page">
      <div className="hero">
        <h1>About Us</h1>
        <p>Dedicated to Women's Safety and Empowerment</p>
      </div>

      <section className="content-section">
        <h2>Who We Are</h2>
        <p>
          Women Safety is an initiative dedicated to creating a safer and more empowered society
          for women. We believe that every woman deserves to feel safe, secure, and empowered in
          all aspects of her life.
        </p>
      </section>

      <section className="content-section">
        <h2>Our Vision</h2>
        <p>
          To create a world where every woman has access to the knowledge, resources, and support
          needed to protect herself and thrive in a safe environment.
        </p>
      </section>

      <section className="content-section">
        <h2>Our Values</h2>
        <ul className="values-list">
          <li><strong>Empowerment:</strong> We empower women with knowledge and skills.</li>
          <li><strong>Safety:</strong> We prioritize the physical and emotional safety of all women.</li>
          <li><strong>Community:</strong> We foster a supportive community where women help women.</li>
          <li><strong>Equality:</strong> We promote gender equality and women's rights.</li>
          <li><strong>Accessibility:</strong> We ensure our resources are accessible to all.</li>
        </ul>
      </section>

      <section className="content-section">
        <h2>What We Do</h2>
        <p>
          Our platform provides:
        </p>
        <ul className="features-list">
          <li>Educational resources on women's rights and safety</li>
          <li>Legal guidance and information</li>
          <li>Emergency support and helpline information</li>
          <li>Community forums for women to share experiences</li>
          <li>Training programs and workshops</li>
          <li>Mental health and wellness resources</li>
        </ul>
      </section>

      <section className="content-section">
        <h2>Contact Us</h2>
        <p>Have questions or want to learn more? Reach out to us!</p>
        <div className="contact-info">
          <p>📧 <strong>Email:</strong> info@womensafety.com</p>
          <p>📱 <strong>Hotline:</strong> 1-800-SAFETY (24/7)</p>
          <p>🏢 <strong>Address:</strong>Sanrakshan Tech Park Tower Borivali Mumbai, Maharashtra 400068</p>
        </div>
      </section>
    </div>
  );
}

export default About;

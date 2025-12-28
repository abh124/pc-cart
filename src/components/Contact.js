import React, { useState } from "react";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMsg = { id: Date.now(), ...formData };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg)
      });

      if (response.ok) {
        alert("Message sent!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message", error);
      alert("Error sending message");
    }
  };

  return (
    <div className="contact-container">
      <form className="contact-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name"
          value={formData.name} onChange={handleChange} required />

        <input type="email" name="email" placeholder="Email"
          value={formData.email} onChange={handleChange} required />

        <textarea name="message" placeholder="Message"
          value={formData.message} onChange={handleChange} required />

        <button type="submit">Send</button>
        <button type="button" onClick={() => window.location.href = '/'}>Back</button>
      </form>
    </div>
  );
}

export default Contact;

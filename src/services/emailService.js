import emailjs from 'emailjs-com';

const sendEmail = async (to, subject, text) => {
  try {
    const templateParams = {
      to_email: to,
      subject: subject,
      message: text,
    };

    const serviceID = 'service_46c15q4'; // Replace with your EmailJS service ID
    const templateID = 'template_b17lu3q'; // Replace with your EmailJS template ID
    const userID = 'e26qETHrh48-5qvPe'; // Replace with your EmailJS user ID

    const response = await emailjs.send(serviceID, templateID, templateParams, userID);
    console.log('Email sent successfully:', response.status, response.text);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;
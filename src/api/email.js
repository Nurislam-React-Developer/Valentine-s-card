import ky from 'ky';

const EMAIL_API_URL = import.meta.env.VITE_URL || 'https://api.emailjs.com/api/v1.0/email/send';

export async function sendEmail(userName, toEmail) {
  if (!toEmail) return;

  const payload = {
    service_id: 'service_m7wqfpn',
    template_id: 'template_r2hxph9',
    user_id: 'UPmKT2fiuyOVizSyc',
    template_params: {
      to_email: toEmail,
      from_name: userName,
      message: `Новое имя: ${userName}`,
    },
  };

  try {
    await ky.post(EMAIL_API_URL, { json: payload });
  } catch (err) {
    throw err;
  }
}


	try {
			const response = await ky.post(
				'https://api.emailjs.com/api/v1.0/email/send',
				{
					service_id: 'service_m7wqfpn',
					template_id: 'template_r2hxph9',
					user_id: 'UPmKT2fiuyOVizSyc',
					template_params: {
						to_email: email,
						from_name: userName, // Используем имя пользователя
						message: `Новое имя: ${userName}`,
					},
				}
			);

			console.log('Успешно отправлено:', response.data);
		} catch (error) {
			console.error(
				'Ошибка при отправке:',
				error.response ? error.response.data : error.message
			);
		}
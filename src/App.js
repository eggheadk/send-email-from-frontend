import React from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import './App.css';

function App() {

	const [message, setMessage] = React.useState({
		user_name: "",
		user_email: "",
		message: ""
	});

	const [err, setErr] = React.useState(false);
	const [loading, setLoading] = React.useState(false);

	const onInputHandle = (e) => {
		e.preventDefault();
		setMessage({ [e.target.name]: e.target.value });
	}

	const sendEmail = async (e) => {
		e.preventDefault();

		setLoading(true);

		const serverId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
		const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
		const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

		const params = { ...message };

		try {
			const isValid = await checkEmail();

			if (isValid) {
				const res = await emailjs.sendForm(serverId, templateId, params, publicKey);
				const data = res.json();
				console.log(data);
				setErr(false);
				setLoading(false);
			}
		} catch (err) {
			console.log(err);
			setErr(true);
			setLoading(false);
		}
	};

	const checkEmail = async () => {

		setLoading(true);

		const url = process.env.REACT_APP_SERVER_URL
		const apiKey = process.env.REACT_APP_SERVER_API_KEY;
		const apiUrl = `${url}?api_key=${apiKey}`;

		try {
			const res = await fetch(apiUrl + '&email' + message.user_email);
			const data = res.json();
			const isValidSMTP = data.is_smtp_valid.value;

			return isValidSMTP;
		} catch (err) {
			console.log(err);
			return false;
		}
	}
	return (

		<form onSubmit={sendEmail}>
			<div className='form-content'>
				<h2>Send message</h2>
				{err && "Error!!!"}
				<label>
					<input
						type={"text"}
						name={"user_name"}
						value={message.user_name}
						onChange={onInputHandle}
						placeholder={"Please input username"}
					/>
				</label>
				<label>
					<input
						type={"email"}
						name={"user_email"}
						value={message.user_email}
						onChange={onInputHandle}
						placeholder={"Please input user email"}
					/>
				</label>
				<label>
					<textarea
						rows={5}
						name={"message"}
						value={message.message}
						onChange={onInputHandle}
						placeholder={"Please input message"}
					/>
				</label>
				<button>Send Message</button>
				{loading && <span>Loading...</span>}
			</div>
		</form>
	);
}

export default App;

import React from 'react';
import Icon from './Icon';

const ErrorComponent = ({ error, handleClose }) => {
	return error ? (
		<div className="error__container">
			<div onClick={handleClose} className="error__button">
				<Icon icon="close" />
			</div>
			<p className="error__message">{error}</p>
		</div>
	) : null;
};

export default ErrorComponent;

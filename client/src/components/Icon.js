import React from 'react';
const { PropTypes } = React;

const icons = {
	close:
		'M16 2h-12c-1.1 0-2 0.9-2 2v12c0 1.1 0.9 2 2 2h12c1.1 0 2-0.9 2-2v-12c0-1.1-0.9-2-2-2zM13.061 14.789l-3.061-3.060-3.061 3.060-1.729-1.728 3.061-3.061-3.060-3.061 1.729-1.729 3.060 3.061 3.059-3.061 1.729 1.729-3.059 3.061 3.060 3.061-1.728 1.728z',
	facebook:
		'M608 192h160v-192h-160c-123.514 0-224 100.486-224 224v96h-128v192h128v512h192v-512h160l32-192h-192v-96c0-17.346 14.654-32 32-32z'
};

const Icon = ({ icon }) => {
	return (
		<svg width="22" height="22" viewBox="0 0 20 20">
			<path d={icons[icon]} />
		</svg>
	);
};

// Icon.propTypes = {
// 	icon: PropTypes.string
// };

export default Icon;

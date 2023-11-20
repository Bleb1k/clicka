function setLightModeStyles() {
	document.documentElement.style.setProperty('--base-background-color', '#f0f0f0');
	document.documentElement.style.setProperty('--base-color', '#404040');
	document.documentElement.style.setProperty('--header-background-color', '#dfb9ea'); // Light purple
	document.documentElement.style.setProperty('--header-color', '#404040');
	document.documentElement.style.setProperty('--content-color', '#404040');
	document.documentElement.style.setProperty('--slider-color', '#70ac72');
	document.documentElement.style.setProperty('--slider-pin-color', '#600060');
}

function setDarkModeStyles() {
	document.documentElement.style.setProperty('--base-background-color', '#262626');
	document.documentElement.style.setProperty('--base-color', '#f3f3f3');
	document.documentElement.style.setProperty('--header-background-color', '#600060');
	document.documentElement.style.setProperty('--header-color', '#ffffff');
	document.documentElement.style.setProperty('--content-color', '#f3f3f3');
	document.documentElement.style.setProperty('--slider-color', '#70ac72');
	document.documentElement.style.setProperty('--slider-pin-color', '#dfb9ea');
}

(() => {
	let toggle = document.getElementsByClassName('light-mode-toggle')[0]
	toggle.addEventListener('change', function (event) {
		if (event.target.checked) {
			setLightModeStyles();
		} else {
			setDarkModeStyles();
		}
	})
	if (toggle.firstElementChild.checked) {
		setLightModeStyles();
	} else {
		setDarkModeStyles();
	}
})()
function koboToNaira(amountInKobo: number) {
	return Math.round(amountInKobo / 100);
}

export default koboToNaira;

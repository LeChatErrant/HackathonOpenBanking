class Timer {
	constructor(timeout, callback) {
		this.timeout = timeout;
		this.callback = callback;
		this.actual = 0;
		this.isStarted = false;
	}

	start() {
		this.isStarted = true;
		this.check = setInterval(() => {
			this.actual += 100;
			console.log(this.actual);
			if (this.actual >= this.timeout) {
				this.isFinished = true;
				clearInterval(this.check);
				console.log("TIMER ENDED");
				this.callback()
			}
		}, 100);
	}

	reset() {
		this.actual = 0;
	}

	finish() {
		this.isFinished = true;
		clearInterval(this.check);
		console.log("TIMER FORCE ENDED");
		this.callback();
	}
}

const stop = () => {
	console.log("func stop");
}

let timer = new Timer(2000, stop);
//timer.start();

setInterval(() => {
	if (!timer.isStarted) {
		timer.start();
	}
}, 10);
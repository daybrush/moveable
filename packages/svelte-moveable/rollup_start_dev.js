import * as child_process from 'child_process';

let running_dev_server = false;

export default {
	writeBundle() {
		if (!running_dev_server) {
			running_dev_server = true;
			child_process.spawn('npm', ['run', 'start:dev'], { stdio: ['ignore', 'inherit', 'inherit'], shell: true });
		}
	}
};

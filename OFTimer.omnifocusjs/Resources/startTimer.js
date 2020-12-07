(function () {
	function askShouldRestartTimer (task, onRestart) {
		const alert = new Alert('Timer already running.', 'There\'s already a timer running for this task. Would you like to restart it?')
		alert.addOption('Restart')
		alert.addOption('Cancel')
		const alertPromise = alert.show()

		alertPromise.then(buttonIndex => {
			switch (buttonIndex) {
				case 0:
					onRestart()
					break;
			}
		})
	}

	let action = new PlugIn.Action(async function(selection, sender){
		const task = selection.tasks[0]

		const startTimer = (() => this.libTaskDB.storeToTask(task, this.libTaskDB.key('start'), new Date()))

		const startValue = await this.libTaskDB.getFromTask(task, this.libTaskDB.key('start')); 

		if (!!startValue) {
			askShouldRestartTimer(task, startTimer)
		} else { startTimer() }
	});
	
	action.validate = function(selection, sender){
		return selection.tasks && selection.tasks.length > 0;
	};
	
	return action;
})()
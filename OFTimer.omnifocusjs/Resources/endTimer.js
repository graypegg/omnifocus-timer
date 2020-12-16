(function () {
	function askShouldAddTime (task, timeSpent) {
		const alert = new Alert('Time already logged.', 'There\'s already time logged for this task. Would you like to add to this value, or replace it?')
		alert.addOption('Add')
		alert.addOption('Replace')
		alert.addOption('Leave as-is')
		const alertPromise = alert.show()

		alertPromise.then(buttonIndex => {
			switch (buttonIndex) {
				case 0:
					logTimeToTask(task, timeSpent, false)
					break;
				case 1:
					logTimeToTask(task, timeSpent, true)
					break;
			}
		})
	}
	
	function logTimeToTask (task, amount, overwrite) {
		let loggedTotal = amount
		if (!overwrite) loggedTotal += task.estimatedMinutes
		task.estimatedMinutes = loggedTotal
	}

	function dateToMinutes (date) {
		return (date.getTime() / 1000) / 60
	}

	let action = new PlugIn.Action(async function(selection, sender){
		const task = selection.tasks[0]
		const startDate = new Date(await this.libTaskDB.getFromTask(task, this.libTaskDB.key('start')))
		const timeSpent = dateToMinutes(new Date()) - dateToMinutes(startDate)

		await this.libTaskDB.removeFromTask(task, this.libTaskDB.key('start'))

		if (task.estimatedMinutes !== null) askShouldAddTime(task, timeSpent)
		else task.estimatedMinutes = timeSpent
	});

	action.validate = function(selection, sender){
		if (selection.tasks[0]) {
			const startValue = this.libTaskDB.checkHasTaskKey(selection.tasks[0], this.libTaskDB.key('start'))
			return (
				selection.tasks &&
				selection.tasks.length > 0 &&
				selection.tasks.every((task) => !!this.libTaskDB.taskHasDB(task)) &&
				!!startValue
			);
		} else {
			return false;
		}
	};

	return action;
})()
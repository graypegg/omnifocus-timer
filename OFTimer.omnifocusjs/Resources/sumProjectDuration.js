(function () {
	function getRecursiveEstimatedDuration (task) {
		let sum = task.estimatedMinutes || 0
		if (task.children.length > 0) {
			task.children.forEach((childTask) => {
				sum += getRecursiveEstimatedDuration(childTask) || 0
			})
		}
		return sum
	}

	let action = new PlugIn.Action(function(selection, sender){
		const task = selection.tasks[0]
		
		task.estimatedMinutes = 0

		task.estimatedMinutes = getRecursiveEstimatedDuration(task)
	});
	
	action.validate = function(selection, sender){
		return selection.tasks && selection.tasks.length > 0;
	};
	
	return action;
})()
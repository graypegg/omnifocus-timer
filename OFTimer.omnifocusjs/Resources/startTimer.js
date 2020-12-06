(function () {
	let action = new PlugIn.Action(function(selection, sender){
		const task = selection.tasks[0]
		this.libTaskDB.storeToTask(task, this.libTaskDB.key('start'), new Date())
	});
	
	action.validate = function(selection, sender){
		return selection.tasks && selection.tasks.length > 0;
	};
	
	return action;
})()
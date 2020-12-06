(function () {
  let libTaskDB = new PlugIn.Library(new Version("0.1"));
  
  const DB_NAME = 'db.json'

  libTaskDB.taskHasDB = function(task){
    const db = task.attachments.find(wrapper => wrapper.filename === DB_NAME)
    return !!db
  }
  
  libTaskDB.getDB = function(task){
    if (!libTaskDB.taskHasDB(task)) {
      const wrapper = FileWrapper.withContents(DB_NAME, Data.fromString('{}'))
      task.addAttachment(wrapper)
    }
    const db = task.attachments.find(wrapper => wrapper.filename === DB_NAME)
    console.log(db.contents.toString())
    return JSON.parse(db.contents.toString());
  }
  
  libTaskDB.writeDB = function(task, newDB){
    if (libTaskDB.taskHasDB(task)) {
      task.attachments = task.attachments.filter(wrapper => wrapper.filename !== DB_NAME)
    }
    const wrapper = FileWrapper.withContents(DB_NAME, Data.fromString(JSON.stringify(newDB)))
    task.addAttachment(wrapper)
  }

  libTaskDB.storeToTask = function(task, key, value){
    const db = libTaskDB.getDB(task)
    db[key] = value
    libTaskDB.writeDB(task, db)
  }

  return libTaskDB
})()
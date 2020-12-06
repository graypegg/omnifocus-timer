(function () {
  let libTaskDB = new PlugIn.Library(new Version("0.1"));
  
  console.log(this)
  
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
    return JSON.parse(db ? db.contents.toString() : '{}');
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
    Timer.once(0, () => { libTaskDB.writeDB(task, db) });
  }
  
  libTaskDB.removeFromTask = function(task, key){
    const db = libTaskDB.getDB(task)
    delete db[key]
    Timer.once(0, () => { libTaskDB.writeDB(task, db) });
  }

  libTaskDB.getFromTask = function(task, key){
    const db = libTaskDB.getDB(task)
    return db[key]
  }
  
  libTaskDB.key = function(name){
    return 'oftimer' + '-' + name
  }

  return libTaskDB
})()
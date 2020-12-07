(function () {
  let libTaskDB = new PlugIn.Library(new Version("0.1"));
  
  console.log(this)
  
  const DB_NAME = 'db.json'

  libTaskDB.taskHasDB = function(task){
    const db = task.attachments.find(wrapper => wrapper.filename === DB_NAME)
    return !!db
  }
  
  libTaskDB.getDB = async function(task){
    if (!libTaskDB.taskHasDB(task)) {
      const wrapper = FileWrapper.withContents(DB_NAME, Data.fromString('{}'))
      task.addAttachment(wrapper)
    }
    return new Promise(res => {
      Timer.once(0, () => {
        const db = task.attachments.find(wrapper => wrapper.filename === DB_NAME)
        res(JSON.parse(db ? db.contents.toString() : '{}'))
      })
    })
  }
  
  libTaskDB.writeDB = function(task, newDB){
    if (libTaskDB.taskHasDB(task)) {
      task.attachments = task.attachments.filter(wrapper => wrapper.filename !== DB_NAME)
    }
    const wrapper = FileWrapper.withContents(DB_NAME, Data.fromString(JSON.stringify(newDB)))
    task.addAttachment(wrapper)
  }

  libTaskDB.storeToTask = async function(task, key, value){
    const db = await libTaskDB.getDB(task)
    db[key] = value
    Timer.once(0, () => { libTaskDB.writeDB(task, db) });
  }
  
  libTaskDB.removeFromTask = async function(task, key){
    const db = await libTaskDB.getDB(task)
    delete db[key]
    Timer.once(0, () => { libTaskDB.writeDB(task, db) });
  }

  libTaskDB.getFromTask = async function(task, key){
    const db = await libTaskDB.getDB(task)
    return db[key]
  }

  libTaskDB.checkHasTaskKey = function(task, key){
    const db = task.attachments.find(wrapper => wrapper.filename === DB_NAME)
    if (db) {
      return JSON.parse(db.contents.toString())[key] !== undefined
    }
    return false
  }
  
  libTaskDB.key = function(name){
    // @TODO: Replace with indentifier from parent plugin.
    return 'oftimer' + '-' + name
  }

  return libTaskDB
})()
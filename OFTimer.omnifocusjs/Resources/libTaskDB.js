(function () {
  let libTaskDB = new PlugIn.Library(new Version("0.1"));
  
  console.log(this)
  
  const DB_NAME = 'db.json'

  libTaskDB.taskHasDB = function(task){
    const db = task.attachments.find(wrapper => wrapper.filename === DB_NAME)
    return !!db
  }
  
  /**
   * getDB - Get an object representing the DB file.
   * @param task - The task to read from.
   * @returns Promise
   */
  libTaskDB.getDB = function(task){
    if (!libTaskDB.taskHasDB(task)) {
      const wrapper = FileWrapper.withContents(DB_NAME, Data.fromString('{}'))
      task.addAttachment(wrapper)
    }
    return new Promise(res => {
      Timer.once(0, () => {
        const db = task.attachments.find(wrapper => wrapper.filename === DB_NAME)
        res(JSON.parse(db.contents.toString()));
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
    libTaskDB.writeDB(task, db)
  }

  libTaskDB.getFromTask = async function(task, key){
    const db = await libTaskDB.getDB(task)
    return db[key]
  }
  
  libTaskDB.key = function(name){
    return 'oftimer' + '-' + name
  }

  return libTaskDB
})()
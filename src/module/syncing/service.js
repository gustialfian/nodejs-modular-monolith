const itemRepo = require('./itemRepository')

function reducer(payloads) {
  return payloads.map(val =>{
    // console.log(`val:`, val)
    switch (val.type) {
      case 'CREATE':
        return `
        INSERT INTO item (name, created_at)
        VALUES ('${val.payload.name}', now());`
      
      case 'UPDATE':
        return `
        UPDATE item 
        SET name='${val.payload.name}'
        WHERE id='${val.payload.id}';`

      case 'DELETE': 
        return `
        DELETE FROM item
        WHERE id='${val.payload.id}';`
    
      default:
        throw new Error("unknown type")
    }
  })
}

async function diffing(lastSyncAt) {
  if (!lastSyncAt) {
    const all = await itemRepo.findAll()
    return all.map(v => ({
      type: 'CREATE',
      payload: v
    }))
  }

  const date = new Date(lastSyncAt)

  // check created item
  const created = await itemRepo.checkCreate(date)
  const payloadCreated = created.map(v => ({
    type: 'CREATE',
    payload: v
  }))
  // check updated item
  const updated = await itemRepo.checkUpdate(date)
  const payloadUpdated = updated.map(v => ({
    type: 'UPDATE',
    payload: v
  }))
  // check deleted item
  const deleted = await itemRepo.checkDelete(date)
  const payloadDeleted = deleted.map(v => ({
    type: 'DELETE',
    payload: v
  }))

  return [
    ...payloadCreated,
    ...payloadUpdated,
    ...payloadDeleted,
  ]
}

module.exports = {
  reducer,
  diffing,
}
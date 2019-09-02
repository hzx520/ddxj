/**
 * 浏览器的localStorage
 */
function dbGet(name) {
    let value = localStorage.getItem(name)
    if (/^\{.*\}$/.test(value)) {
      value = JSON.parse(value)
    }
    return value
  }
  
  function dbSet(name, value) {
    if (typeof value === typeof {}) {
      value = JSON.stringify(value)
    }
    return localStorage.setItem(name, value)
  }
  
  function dbRemove(name) {
    return localStorage.removeItem(name)
  }
  
  export default {
    dbGet,
    dbSet,
    dbRemove
  }
  
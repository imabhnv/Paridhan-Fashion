import('./api/deleteUser.js').then(m => {
  console.log("Successfully imported api/deleteUser.js");
}).catch(err => {
  console.error("Failed to import api/deleteUser.js", err);
});

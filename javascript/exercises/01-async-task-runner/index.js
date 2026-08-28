// Promise.all resolves by input index, not completion time
export async function runTasks(tasks) {
  return await Promise.all(tasks.map((request) => {
    return request()
      .then(r => ({ status: "fulfilled", value: r }))
      // Without the .catch() the Promise.all() would end immediately as soon as it hits a rejection
      .catch(e => ({ status: "rejected", value: e }))
  }));
};
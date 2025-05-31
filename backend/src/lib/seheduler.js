
const cron = require('node-cron');

// Function to delete users older than 1 week
async function deleteOldUsers() {
    try {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

        const result = await users.deleteMany({
        createdAt: { $lte: oneWeekAgo }
        });

        console.log(`[${new Date().toISOString()}] Deleted ${result.deletedCount} user(s).`);
    } catch (error) {
        console.error('Error deleting old users:', error);
    } finally {
        await client.close();
    }
}

// Schedule the task to run every day at 12:00 PM
cron.schedule('0 12 * * *', () => {
    console.log('Running daily deletion task...');
    deleteOldUsers();
});

import { MongoClient } from 'mongodb';
import fs from 'fs';

const localUri = 'mongodb://localhost:27017';
// Try standard connection format first
const atlasUri = 'mongodb+srv://rajvt172_db_user:RRmeiMIS1CbuqAI6@cluster0.c3e30rm.mongodb.net/?retryWrites=true&w=majority&authSource=admin';

async function exportImportSongs() {
  let localClient, atlasClient;
  
  try {
    console.log('Connecting to local MongoDB...');
    localClient = new MongoClient(localUri);
    await localClient.connect();
    
    const localDb = localClient.db('moodyplayer');
    const localCollection = localDb.collection('songs');
    
    console.log('Exporting songs from local MongoDB...');
    const songs = await localCollection.find({}).toArray();
    console.log(`✓ Found ${songs.length} songs`);
    
    // Save to file for reference
    fs.writeFileSync('songs-export.json', JSON.stringify(songs, null, 2));
    console.log('✓ Saved to songs-export.json');
    
    await localClient.close();
    console.log('✓ Disconnected from local MongoDB');
    
    // Connect to Atlas
    console.log('\nConnecting to MongoDB Atlas...');
    atlasClient = new MongoClient(atlasUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });
    await atlasClient.connect();
    console.log('✓ Connected to MongoDB Atlas');
    
    const atlasDb = atlasClient.db('moodyplayer');
    const atlasCollection = atlasDb.collection('songs');
    
    // Check if collection exists and clear it
    console.log('Clearing existing songs in Atlas...');
    const deleteResult = await atlasCollection.deleteMany({});
    console.log(`✓ Deleted ${deleteResult.deletedCount} existing documents`);
    
    // Insert all songs
    console.log('Importing songs to Atlas...');
    const insertResult = await atlasCollection.insertMany(songs);
    console.log(`✓ Imported ${Object.keys(insertResult.insertedIds).length} songs to Atlas`);
    
    // Verify
    const count = await atlasCollection.countDocuments();
    console.log(`✓ Verified: ${count} songs now in Atlas`);
    
    await atlasClient.close();
    console.log('\n✅ Done! Songs successfully synced to MongoDB Atlas');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('querySrv')) {
      console.error('\nTroubleshooting:');
      console.error('- Check your internet connection');
      console.error('- Verify password has no special chars that need encoding');
      console.error('- Check IP whitelist at: cloud.mongodb.com > Security > Network Access');
      console.error('- Try adding 0.0.0.0/0 to allow all IPs (temporarily)');
    }
    process.exit(1);
  }
}

exportImportSongs();

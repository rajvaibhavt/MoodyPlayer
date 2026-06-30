import mongoose from 'mongoose';
import fs from 'fs';

const localUri = 'mongodb://localhost:27017/moodyplayer';
const atlasUri = 'mongodb+srv://rajvt172_db_user:RRmeiMIS1CbuqAI6@cluster0.c3e30rm.mongodb.net/moodyplayer?appName=Cluster0';

async function exportImportSongs() {
  try {
    console.log('Connecting to local MongoDB...');
    await mongoose.connect(localUri);
    
    const db = mongoose.connection.db;
    const songsCollection = db.collection('songs');
    
    // Export from local
    console.log('Exporting songs from local MongoDB...');
    const songs = await songsCollection.find({}).toArray();
    console.log(`Found ${songs.length} songs`);
    
    fs.writeFileSync('songs-export.json', JSON.stringify(songs, null, 2));
    console.log('✓ Exported to songs-export.json');
    
    // Disconnect from local
    await mongoose.disconnect();
    
    // Connect to Atlas
    console.log('\nConnecting to MongoDB Atlas...');
    await mongoose.connect(atlasUri);
    
    const atlasDb = mongoose.connection.db;
    const atlasSongsCollection = atlasDb.collection('songs');
    
    // Clear existing songs (optional)
    console.log('Clearing existing songs in Atlas...');
    await atlasSongsCollection.deleteMany({});
    
    // Import to Atlas
    console.log('Importing songs to Atlas...');
    const result = await atlasSongsCollection.insertMany(songs);
    console.log(`✓ Imported ${result.insertedIds.length} songs to Atlas`);
    
    await mongoose.disconnect();
    console.log('\nDone! Songs are now in MongoDB Atlas.');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

exportImportSongs();

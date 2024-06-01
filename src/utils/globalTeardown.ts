import path from 'path';
import fs from 'fs';

async function globalTeardown() {

    try {
        const authDir = path.resolve(__dirname, '../web/base/auth_temp');
        const files = await fs.promises.readdir(authDir);
    
        for (const file of files) {
            const filePath = path.join(authDir, file);
            await fs.promises.unlink(filePath);
        }
    } catch {
      console.log(`Error in globalTeardown`);
    } 
  }
  
  export default globalTeardown;
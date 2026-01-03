import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class BotService {
  downloadReel(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileName = `video_${Date.now()}.mp4`;
      const filePath = path.join(process.cwd(), fileName);

      // MUHIM: Windows yo'li o'rniga shunchaki 'yt-dlp' deb yozamiz
      // Chunki Docker orqali u Linux tizimiga o'rnatilgan
      const ytDlpPath = 'yt-dlp';

      const command = `${ytDlpPath} -f "b[ext=mp4]" --no-check-certificate --geo-bypass -o "${filePath}" "${url}"`;

      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.error('Yuklash xatosi:', stderr || err.message);
          return reject(err);
        }
        console.log(`Video yuklandi: ${filePath}`);
        resolve(filePath);
      });
    });
  }

  removeFile(filePath: string) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Fayl o'chirildi: ${filePath}`);
      }
    } catch (err) {
      console.error("Faylni o'chirishda xato:", err);
    }
  }
}

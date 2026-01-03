import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class BotService {
  downloadReel(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Fayl nomini o'zgartirdik (umumiyroq bo'lishi uchun)
      const fileName = `video_${Date.now()}.mp4`;
      const filePath = path.join(process.cwd(), fileName);
      const ytDlpPath = `C:\\Users\\Digital\\OneDrive\\Desktop\\yt-dlp\\yt-dlp.exe`;

      // Buyruqni kuchaytirdik:
      // 1. -f "b[ext=mp4]" -> Eng yaxshi sifatli MP4 formatini tanlaydi
      // 2. --no-check-certificate -> Sertifikat xatolarini chetlab o'tadi
      // 3. --geo-bypass -> Geografik cheklovlarni aylanib o'tishga harakat qiladi
      const command = `"${ytDlpPath}" -f "b[ext=mp4]" --no-check-certificate --geo-bypass -o "${filePath}" "${url}"`;

      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.error('Yuklash xatosi:', stderr || err.message);
          return reject(err);
        }
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

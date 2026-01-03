import { Update, Start, On, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotService } from './bot.service';

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply(
      'Assalomu alaykum! 🤖\n\n' +
        'Menga Instagram Reels, TikTok yoki YouTube Shorts havolasini yuboring, men sizga videoni yuklab beraman. 📥',
    );
  }

  @On('text')
  async onMessage(@Ctx() ctx: Context) {
    if (ctx.message && 'text' in ctx.message) {
      const text = ctx.message.text;

      const isInstagram = text.includes('instagram.com');
      const isTikTok =
        text.includes('tiktok.com') || text.includes('vt.tiktok.com');
      const isYouTube =
        text.includes('youtube.com/shorts') || text.includes('youtu.be');

      if (!isInstagram && !isTikTok && !isYouTube) {
        await ctx.reply(
          "❌ Noto'g'ri havola!\n\nIltimos, Instagram, TikTok yoki YouTube Shorts havolasini yuboring.",
        );
        return;
      }

      const statusMessage = await ctx.reply(
        '⏳ Video qayta ishlanmoqda, iltimos kuting...',
      );

      try {
        const filePath = await this.botService.downloadReel(text);
        await ctx.replyWithVideo({ source: filePath });

        // Status xabarini o'chirish
        if (ctx.chat) {
          await ctx.telegram.deleteMessage(
            ctx.chat.id,
            statusMessage.message_id,
          );
        }

        this.botService.removeFile(filePath);
      } catch (error: unknown) {
        console.error('Xatolik tafsiloti:', error);

        let errorMessage = '❌ Videoni yuklashda xatolik yuz berdi.';

        // Error tipini xavfsiz tekshirish (Unsafe call xatosini tuzatish)
        if (error instanceof Error && error.message.includes('timed out')) {
          errorMessage =
            "⚠️ TikTok serveriga ulanishda xatolik (Timeout). Iltimos, VPN ishlatib ko'ring.";
        }

        await ctx.reply(errorMessage);

        // Bo'sh catch va ishlatilmagan 'e' ni tuzatish
        try {
          if (ctx.chat) {
            await ctx.telegram.deleteMessage(
              ctx.chat.id,
              statusMessage.message_id,
            );
          }
        } catch {
          // Xabarni o'chirib bo'lmasa, e'tibor bermaymiz
        }
      }
    }
  }
}

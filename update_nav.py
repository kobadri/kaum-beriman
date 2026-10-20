import os, glob, re

path = "/home/hari/Dokumen/mini-web-pp/"
files = glob.glob(path + "t_*.html")

for filepath in files:
    filename = os.path.basename(filepath)
    base_name = filename.replace(".html", "")
    
    # 1. Cek file audio (s_03_selasa_01.mp3)
    audio_filename = base_name.replace("t_", "s_") + ".mp3"
    has_audio = os.path.exists(os.path.join(path, audio_filename))

    # 2. Cek file video (.mp4, .webm, .mkv)
    video_filename = ""
    has_video = False
    for ext in [".mp4", ".webm", ".mkv"]:
        v_name = base_name.replace("t_", "v_") + ext
        if os.path.exists(os.path.join(path, v_name)):
            video_filename = v_name
            has_video = True
            break

    # 3. Cek teks selanjutnya (_02, dst)
    parts = base_name.split("_")
    if len(parts) == 4:
        prefix, week, day, idx = parts
        next_idx = f"{int(idx)+1:02d}"
        next_filename = f"{prefix}_{week}_{day}_{next_idx}.html"
        has_next = os.path.exists(os.path.join(path, next_filename))
    else:
        has_next = False
        next_filename = ""

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Buat blok tombol navigasi baru
    nav_buttons = '\n<div class="nav-container" style="margin: 30px 0; text-align: center; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">\n'
    nav_buttons += '  <a href="index.html" class="btn" style="background: #333; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Home</a>\n'
    
    if has_audio:
        nav_buttons += f'  <audio id="audio-player" src="{audio_filename}"></audio>\n'
        nav_buttons += '  <button onclick="document.getElementById(\'audio-player\').play()" class="btn" style="background: #28a745; color: #fff; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Suara</button>\n'

    if has_video:
        nav_buttons += f'  <a href="{video_filename}" target="_blank" class="btn" style="background: #17a2b8; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Video</a>\n'
    
    if has_next:
        nav_buttons += f'  <a href="{next_filename}" class="btn" style="background: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Bacaan Selanjutnya</a>\n'
        
    nav_buttons += '</div>\n'

    # Hapus kontainer tombol navigasi lama (baik div class nav-container atau div yang membungkus tombol Garis Besar/Pendalaman)
    content = re.sub(r'<div class="nav-container"[\s\S]*?</div>', '', content)
    content = re.sub(r'<div[^>]*style="[^"]*display:\s*flex[^"]*"[\s\S]*?Garis Besar[\s\S]*?</div>', '', content)
    
    # Masukkan tombol baru tepat sebelum </body>
    if "</body>" in content:
        content = content.replace("</body>", f"{nav_buttons}\n</body>")
    else:
        content += nav_buttons

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

print("Pembaruan bersih selesai!")

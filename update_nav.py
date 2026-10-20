import os, glob, re

path = "/home/hari/Dokumen/mini-web-pp/"
files = glob.glob(path + "t_*.html")

for filepath in files:
    filename = os.path.basename(filepath)
    base_name = filename.replace(".html", "")
    
    # 1. Cek file audio yang sesuai (s_03_selasa_01.mp3)
    audio_filename = base_name.replace("t_", "s_") + ".mp3"
    audio_path = os.path.join(path, audio_filename)
    has_audio = os.path.exists(audio_path)

    # 2. Cek file video yang sesuai (v_03_selasa_01.mp4 / webm / mkv)
    video_filename = ""
    has_video = False
    for ext in [".mp4", ".webm", ".mkv"]:
        v_name = base_name.replace("t_", "v_") + ext
        if os.path.exists(os.path.join(path, v_name)):
            video_filename = v_name
            has_video = True
            break

    # 3. Cek apakah ada teks selanjutnya (misal _01 -> _02)
    parts = base_name.split("_")
    if len(parts) == 4:
        prefix, week, day, idx = parts
        next_idx = f"{int(idx)+1:02d}"
        next_filename = f"{prefix}_{week}_{day}_{next_idx}.html"
        next_path = os.path.join(path, next_filename)
        has_next = os.path.exists(next_path)
    else:
        has_next = False
        next_filename = ""

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Buat blok tombol navigasi kondisional
    nav_buttons = '<div class="nav-container" style="margin-top: 30px; text-align: center;">\n'
    nav_buttons += '  <a href="index.html" class="btn btn-home">Home</a>\n'
    
    if has_audio:
        nav_buttons += f'  <audio id="audio-player" src="{audio_filename}"></audio>\n'
        nav_buttons += '  <button onclick="document.getElementById(\'audio-player\').play()" class="btn btn-audio">Suara</button>\n'

    if has_video:
        nav_buttons += f'  <a href="{video_filename}" target="_blank" class="btn btn-video">Video</a>\n'
    
    if has_next:
        nav_buttons += f'  <a href="{next_filename}" class="btn btn-next">Bacaan Selanjutnya</a>\n'
        
    nav_buttons += '</div>\n'

    # Sisipkan atau perbarui wadah navigasi
    if '<div class="nav-container"' in content:
        content = re.sub(r'<div class="nav-container"[\s\S]*?</div>\s*', nav_buttons, content)
    else:
        content = content.replace("</body>", f"{nav_buttons}\n</body>")

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

print("Berhasil menambahkan dukungan tombol Video kondisional!")

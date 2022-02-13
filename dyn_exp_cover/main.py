import time

import requests
from PIL import Image, ImageDraw, ImageFont
import vk_api

FONT_SIZE = 268
FONT = "vk_sans.otf"
COLOR = "#8F63FE"

BCK_01 = "./expert.png"
BCK_02 = "./experta.png"
BCK_03 = "./expertov.png"

GROUP_ID = 206651170


session = vk_api.VkApi(
    token="574a2acecf533ee05415cc5db1317d34084e7558883b65a23910f571f1d4823360e239624ce00c334c027")
vk = session.get_api()


def draw_subs(back: str, text: str):
    # Basics
    font = ImageFont.truetype(FONT, FONT_SIZE)

    # Image worker
    im = Image.open(back)
    W, H = im.size
    draw = ImageDraw.Draw(im)
    w, h = draw.textsize(text=text, font=font)

    # Text pos
    xy = ((W - w) / 2, (H - h - 100) / 2)

    # Draw & save
    draw.text(xy=xy, text=text, fill=COLOR, font=font)
    im.save("cover.png", "PNG")


def get_subs():
    return vk.groups.getById(group_ids="vkexperts", fields="members_count")[0]["members_count"]


def upload_cover():
    upload_url = vk.photos.getOwnerCoverPhotoUploadServer(group_id=GROUP_ID, crop_x=0, crop_y=0, crop_x2=2719, crop_y2=907)['upload_url']
    ans = requests.post(upload_url,
                        files={'photo': open("cover.png", 'rb')}).json()
    vk.photos.saveOwnerCoverPhoto(hash=ans['hash'], photo=ans['photo'])


def get_cover(subs):
    text = '{:,}'.format(int(subs)).replace(',', ' ')
    match int(text[-1]):
        case 1:
            draw_subs(BCK_01, text)
        case 2 | 3 | 4:
            draw_subs(BCK_02, text)
        case 5 | 6 | 7 | 8 | 9 | 0:
            draw_subs(BCK_03, text)
        case _:
            draw_subs(BCK_01, "Error")


if __name__ == "__main__":
    old_subs = 0
    while True:
        now_subs = get_subs()
        if old_subs != now_subs:
            old_subs = now_subs
            try:
                get_cover(now_subs)
                upload_cover()
                print("Done")
                time.sleep(60)
            except Exception as err:
                print(err)
        else:
            print("Pass")
            time.sleep(60)

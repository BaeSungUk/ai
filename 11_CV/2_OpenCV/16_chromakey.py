import cv2
from pathlib import Path
from time import perf_counter

cap_foreground = cv2.VideoCapture("./movies/woman.mp4")
cap_background = cv2.VideoCapture("./movies/sea.mp4")

fps = cap_foreground.get(cv2.CAP_PROP_FPS)
delay = max(1, round(1000/fps)) if fps > 0 else 30
print(fps)
print(delay)

while True:
    ret1, frame1 = cap_foreground.read()
    if not ret1:
        break
    ret2, frame2 = cap_background.read()
    if not ret2:
        cap_background.set(cv2.CAP_PROP_POS_FRAMES, 0)
        ret2, frame2 = cap_background.read()
        if not ret2:
            break
    # 두 영상 크기가 다르면 배경 영상을 전경 영상 크기에 맞춤
    frame2 = cv2.resize(frame2, (frame1.shape[1], frame1.shape[0]))
    #전경 영상을 HSV로 변환
    hsv = cv2.cvtColor(frame1, cv2.COLOR_BGR2HSV)

    lower_green = (50, 150, 0)
    upper_green = (90, 255, 255)
    green_mask = cv2.inRange(hsv, lower_green, upper_green)

    result = frame1.copy()
    cv2.copyTo(frame2, green_mask, result)

    cv2.imshow("chromakey", result)
    # cv2.imshow("mask", green_mask)
    key = cv2.waitKey(delay)

    if key == ord(" "):
        cv2.waitKey(0)
    elif key == 27:
        break

cap_foreground.release()
cap_background.release()
cv2.destroyAllWindows()


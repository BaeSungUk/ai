"""기본 카메라의 영상을 실시간으로 화면에 표시하는 예제입니다."""

import cv2
import sys

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("카메라를 열 수 없습니다.")
    sys.exit()

print("카메라 연결 성공!")

width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = cap.get(cv2.CAP_PROP_FPS)
print(f"너비: {width}, 높이: {height}, FPS: {fps}")

while True:
    ret, frame = cap.read()
    if not ret:
        print("카메라 프레임을 읽지 못했습니다.")
        break
    cv2.imshow("camera", frame)
    if cv2.waitKey(1) == 27:
        break

cap.release()
cv2.destroyAllWindows()

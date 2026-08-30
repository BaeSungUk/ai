"""기본 카메라의 영상을 실시간으로 화면에 표시하는 예제입니다."""

# 카메라 영상 읽기와 화면 출력을 위해 OpenCV를 불러옵니다.
import cv2

# 카메라 연결 실패 시 프로그램을 종료하기 위해 sys를 불러옵니다.
import sys

# 인덱스 0번인 시스템의 기본 카메라에 연결합니다.
cap = cv2.VideoCapture(0)

# 카메라가 정상적으로 열렸는지 확인합니다.
if not cap.isOpened():
    # 카메라 권한이나 연결 상태에 문제가 있으면 안내 문구를 출력합니다.
    print("카메라를 열 수 없습니다.")

    # 프레임 읽기를 시도하지 않고 프로그램을 종료합니다.
    sys.exit()

# 카메라 연결 성공 메시지를 출력합니다.
print("카메라 연결 성공!")

# 카메라가 제공하는 프레임 너비를 가져옵니다.
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))

# 카메라가 제공하는 프레임 높이를 가져옵니다.
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

# 카메라가 제공하는 초당 프레임 수를 가져옵니다.
fps = cap.get(cv2.CAP_PROP_FPS)

# 카메라 영상 정보를 출력합니다.
print(f"너비: {width}, 높이: {height}, FPS: {fps}")

# 카메라 프레임 읽기를 계속 반복합니다.
while True:
    # 카메라에서 한 프레임을 읽습니다.
    ret, frame = cap.read()

    # 프레임을 읽지 못하면 메시지를 출력하고 반복을 종료합니다.
    if not ret:
        print("카메라 프레임을 읽지 못했습니다.")
        break

    # 읽은 프레임을 'camera' 창에 표시합니다.
    cv2.imshow("camera", frame)

    # 1ms 동안 키를 확인하고 ESC(27)를 누르면 반복을 종료합니다.
    if cv2.waitKey(1) == 27:
        break

# 카메라 장치를 다른 프로그램도 사용할 수 있도록 해제합니다.
cap.release()

# OpenCV가 만든 모든 창을 닫습니다.
cv2.destroyAllWindows()

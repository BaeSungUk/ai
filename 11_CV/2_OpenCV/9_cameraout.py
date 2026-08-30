"""카메라 영상을 실시간으로 표시하면서 AVI 파일로 저장하는 예제입니다."""

# 카메라와 동영상 저장 기능을 사용하기 위해 OpenCV를 불러옵니다.
import cv2

# 카메라 연결 실패 시 프로그램을 종료하기 위해 sys를 불러옵니다.
import sys

# 시스템의 기본 카메라인 0번 카메라를 엽니다.
cap = cv2.VideoCapture(0)

# 카메라가 정상적으로 열렸는지 확인합니다.
if not cap.isOpened():
    # 카메라 연결 실패 메시지를 출력합니다.
    print("카메라를 열 수 없습니다.")

    # 프레임 처리 없이 프로그램을 종료합니다.
    sys.exit()

# 카메라 연결 성공 메시지를 출력합니다.
print("카메라 연결 성공!")

# 카메라 프레임의 너비를 가져옵니다.
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))

# 카메라 프레임의 높이를 가져옵니다.
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

# 카메라가 제공하는 FPS를 가져옵니다.
fps1 = cap.get(cv2.CAP_PROP_FPS)

# 확인한 카메라 영상 정보를 출력합니다.
print(f"너비: {width}, 높이: {height}, FPS: {fps1}")

# 저장에 사용할 XVID 코덱 코드를 만듭니다.
fourcc = cv2.VideoWriter_fourcc(*"XVID")

# 카메라 프레임을 camera.avi에 기록할 VideoWriter 객체를 만듭니다.
out = cv2.VideoWriter("camera.avi", fourcc, fps1, (width, height))

print(f'녹화 시작: {width}X{height}, {fps1:.1f}FPS')
print('ESC 키를 누르면 녹화를 종료 합니다.')

# 카메라 프레임을 계속 읽고 저장합니다.
while True:
    # 카메라에서 다음 프레임을 읽습니다.
    ret, frame = cap.read()

    # 프레임 읽기에 실패하면 반복을 종료합니다.
    if not ret:
        print('카메라 프레임을 읽지 못했습니다.')
        break

    # 현재 프레임을 출력 동영상 파일에 기록합니다.
    out.write(frame)

    # 녹화 중인 프레임을 'output' 창에서 보여 줍니다.
    cv2.imshow("output", frame)

    # ESC 키를 누르면 중단 상태를 기록하고 반복을 종료합니다.
    if cv2.waitKey(1) == 27:
        break

# 카메라 장치를 해제합니다.
cap.release()

# 출력 동영상 파일 기록을 마치고 자원을 해제합니다.
out.release()

# OpenCV가 만든 모든 창을 닫습니다.
cv2.destroyAllWindows()

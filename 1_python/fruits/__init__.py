# fruits/__init__.py
from .apple import info as apple_info, func1
from .banana import info as banana_info

# ex) import fruits
# ex) from fruits import apple_info, banana_info
# ex) from fruits import * < 별표는 __all__안에있는 함수만 쓰겠다는 얘기.
# str으로 사용 하면 더 좋다, 그냥 사용 해도 상관은 없음.
__all__ = ["apple_info", "banana_info", "func1"]

# 👉 패키지에서 바로 사용할 API 정의
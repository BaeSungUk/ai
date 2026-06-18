class Contact:
    """연락처 한 건의 이름, 전화번호, 주소를 관리한다."""

    def __init__(self, name, phone, address=""):
        # TODO: 프로퍼티를 통해 이름, 전화번호, 주소를 저장하세요.
        self.name = name
        self.phone = phone
        self.address = address

    def __repr__(self):
        """Contact 객체를 확인하기 쉬운 문자열로 반환한다."""
        # TODO: 이름, 전화번호, 주소가 포함된 문자열을 반환하세요.
        return f"name: {self.name}, phone: {self.phone}, address: {self.address}"
    @property
    def name(self):
        """저장된 이름을 반환한다."""
        # TODO: 비공개 이름 속성을 반환하세요.
        return self.__name
    @name.setter
    def name(self, name):
        """공백을 제거하고 비어 있지 않은 이름을 저장한다."""
        # TODO: 앞뒤 공백 제거, 빈 값 검사, 값 저장을 구현하세요.
        if not name:
            raise ValueError("이름은 비워둘 수 없습니다.")
        self.__name = name

    @property
    def phone(self):
        """저장된 전화번호를 반환한다."""
        # TODO: 비공개 전화번호 속성을 반환하세요.
        return self.__phone

    @phone.setter
    def phone(self, phone):
        """공백을 제거하고 비어 있지 않은 전화번호를 저장한다."""
        # TODO: 앞뒤 공백 제거, 빈 값 검사, 값 저장을 구현하세요.
        if not phone:
            raise ValueError("전화번호는 비워둘 수 없습니다.")
        self.__phone = phone

    @property
    def address(self):
        """저장된 주소를 반환한다."""
        # TODO: 비공개 주소 속성을 반환하세요.
        return self.__address

    @address.setter
    def address(self, address):
        """주소의 앞뒤 공백을 제거해 저장한다."""
        # TODO: 주소를 정리한 뒤 저장하세요.
        if not address:
            raise ValueError("주소는 비워둘 수 없습니다.")
        self.__address = address

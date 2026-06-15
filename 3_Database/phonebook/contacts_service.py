from contact import Contact
from contacts_dao import ContactsDAO


class ContactsService:
    """사용자 입력을 받아 연락처 기능을 처리하고 결과를 출력한다."""

    def __init__(self):
        pass

    @staticmethod
    def print_contact(contact):
        """조회된 연락처 한 건을 보기 좋은 형식으로 출력한다."""
        pass

    def insert_contact(self):
        """연락처 정보를 입력받아 데이터베이스에 등록한다."""
        pass

    def print_all(self):
        """전체 연락처를 조회해 출력한다."""
        pass

    def search_contacts(self):
        """이름 또는 전화번호 검색어로 연락처를 찾아 출력한다."""
        pass

    def edit_contact(self):
        """전화번호로 연락처를 찾은 뒤 새 정보로 수정한다."""
        pass

    def delete_contact(self):
        """전화번호로 연락처를 찾아 삭제한다."""
        pass

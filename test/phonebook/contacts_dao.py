import MySQLdb


class ContactsDAO:
    """전화번호부 테이블에 대한 데이터베이스 작업을 담당한다."""

    def __init__(self):
        pass

    def connect(self):
        """MySQL 데이터베이스에 연결한다."""
        pass

    def disconnect(self):
        """열려 있는 데이터베이스 연결을 종료한다."""
        pass

    def insert(self, contact):
        """Contact 객체의 정보를 데이터베이스에 추가한다."""
        pass

    def select_all(self):
        """모든 연락처를 이름과 전화번호 순으로 조회한다."""
        pass

    def search_all(self, keyword):
        """이름 또는 전화번호에 검색어가 포함된 연락처를 조회한다."""
        pass

    def search(self, phone):
        """전화번호가 정확히 일치하는 연락처 한 건을 조회한다."""
        pass

    def update(self, contact, old_phone):
        """기존 전화번호를 기준으로 연락처 정보를 수정한다."""
        pass

    def delete(self, phone):
        """전화번호가 일치하는 연락처를 삭제한다."""
        pass

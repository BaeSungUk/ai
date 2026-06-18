import MySQLdb


class ContactsDAO:
    """전화번호부 테이블에 대한 데이터베이스 작업을 담당한다."""

    def __init__(self):
        self.db = None

    def connect(self):
        """MySQL 데이터베이스에 연결한다."""
        self.db = MySQLdb.connect(host='localhost', user='root', password='1234', db='testdb', charset='utf8')
    def disconnect(self):
        """열려 있는 데이터베이스 연결을 종료한다."""
        if self.db:
            self.db.close()

    def insert(self, contact):
        """Contact 객체의 정보를 데이터베이스에 추가한다."""
        self.connect()
        cur = self.db.cursor()
        sql = "insert into phonebook (name,  phone, address) values (%s, %s, %s)"
        data = (contact.name, contact.phone, contact.address)
        cur.execute(sql, data)
        self.db.commit()
        cur.close()
        self.disconnect()
        

    def select_all(self):
        """모든 연락처를 이름과 전화번호 순으로 조회한다."""
        self.connect()  
        cur = self.db.cursor(MySQLdb.cursors.DictCursor)
        sql = "select * from phonebook"
        cur.execute(sql)
        rows = cur.fetchall()
        cur.close()
        self.disconnect()
        return rows

    def search_all(self, keyword):
        """이름 또는 전화번호에 검색어가 포함된 연락처를 조회한다."""
        self.connect()  
        cur = self.db.cursor(MySQLdb.cursors.DictCursor)
        sql = "select name, phone, address from phonebook where (name like concat('%%', %s,  '%%') or phone like concat('%%', %s , '%%'))"
        data = (keyword, keyword)
        cur.execute(sql, data)
        rows = cur.fetchall()
        cur.close()
        self.disconnect()
        return rows
    
    def search(self, phone):
        """전화번호가 정확히 일치하는 연락처 한 건을 조회한다."""
        self.connect()
        cur = self.db.cursor(MySQLdb.cursors.DictCursor)
        sql = " select name, phone, address from phonebook where phone = %s"
        cur.execute(sql, (phone,))
        row = cur.fetchone()
        cur.close()
        self.disconnect()
        return row

    def update(self, contact, old_phone):
        """기존 전화번호를 기준으로 연락처 정보를 수정한다."""
        self.connect()
        cur = self.db.cursor()
        sql = " update phonebook set name = %s, phone = %s, address = %s where phone = %s;"
        data = (contact.name, contact.phone, contact.address, old_phone)
        result = cur.execute(sql, data)
        self.db.commit()
        cur.close()
        self.disconnect()
        return result
        

    def delete(self, phone):
        """전화번호가 일치하는 연락처를 삭제한다."""
        self.connect()
        cur = self.db.cursor()
        sql = " delete from phonebook where phone = %s"
        result = cur.execute(sql, (phone,))
        self.db.commit()
        cur.close()
        self.disconnect()
        return result

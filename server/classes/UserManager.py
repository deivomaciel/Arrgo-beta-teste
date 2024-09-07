from uuid import uuid4
import pyotp

class UserManager:
    def __init__(self) -> None:
        self.users = []

    def get_code(self) -> dict:
        id = str(uuid4())
        code = self.__generate_code()
        user = { 'id': id, 'code': code }
        self.users.append(user)
        return user

    def __generate_code(self) -> str:
        secret = pyotp.random_base32()
        totp = pyotp.TOTP(secret)
        
        print(totp)
        
        code = totp.now() 
        return code
    
    def verify_code(self, code):
        pass

    def generate_id(self) -> str:
        return str(uuid4())
    
    def remove_user(self, user: dict) -> None:
        self.users.remove(user)
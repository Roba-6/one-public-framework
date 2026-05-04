import unittest
from typing import Any, Dict
from uuid import UUID

from pydantic import ValidationError

from one_public_api.models import User
from parameterized import parameterized


class TestUserModel(unittest.TestCase):
    def setUp(self) -> None:
        # This method will run before every test
        self.users: list[User] = [
            User(
                name="test-user-01",
                email="test-user-01@example.com",
            ),
            User(
                name="test-user-02",
                email="test-user-02@example.com",
                firstname="John",
                lastname="Doe",
                nickname="JohnDoe",
                password="password",
                is_enabled=False,
                is_locked=True,
                failed_attempts=3,
                id=UUID("12345678-1234-5678-1234-567812345678"),
            ),
        ]

    def test_creation(self) -> None:
        self.assertEqual(self.users[0].name, "test-user-01")
        self.assertEqual(self.users[0].email, "test-user-01@example.com")
        self.assertTrue(self.users[0].is_enabled)
        self.assertFalse(self.users[0].is_locked)
        self.assertEqual(self.users[0].failed_attempts, 0)

        self.assertEqual(self.users[1].name, "test-user-02")
        self.assertEqual(self.users[1].email, "test-user-02@example.com")
        self.assertEqual(self.users[1].firstname, "John")
        self.assertEqual(self.users[1].lastname, "Doe")
        self.assertEqual(self.users[1].nickname, "JohnDoe")
        self.assertEqual(self.users[1].email, "test-user-02@example.com")
        self.assertEqual(self.users[1].email, "test-user-02@example.com")
        self.assertFalse(self.users[1].is_enabled)
        self.assertTrue(self.users[1].is_locked)
        self.assertEqual(self.users[1].failed_attempts, 3)
        self.assertEqual(self.users[1].id, UUID("12345678-1234-5678-1234-567812345678"))

    @parameterized.expand(  # type: ignore
        [
            ({"name": "abc"},),
            ({"name": "A" * 55},),
            ({"email": "a@b.c"},),
            (
                {
                    "email": (
                        "100words_!#ijklmn.opqrstuvwxy$%^&*+abcdef-ghi=jklm"
                        "yzabcdefghijkl@abcdefghiJKLmnopqrstu.international"
                    )
                },
            ),
            ({"firstname": ""},),
            ({"firstname": "A" * 100},),
            ({"lastname": ""},),
            ({"lastname": "A" * 100},),
            ({"nickname": ""},),
            ({"nickname": "A" * 100},),
            ({"is_enabled": True},),
            ({"is_enabled": False},),
            ({"is_locked": True},),
            ({"is_locked": False},),
            ({"failed_attempts": 0},),
            ({"failed_attempts": 1000},),
            ({"password": ""},),
            ({"password": "A" * 64},),
        ]
    )
    def test_validation_success(self, field: Dict[str, Any]) -> None:
        user = User.model_validate(
            {
                "name": "test-user",
                "email": "test@example.com",
                **field,
            }
        )
        if "name" in field.keys():
            self.assertEqual(user.name, field["name"])
        else:
            self.assertEqual(user.name, "test-user")

    @parameterized.expand(  # type: ignore
        [
            ({"name": "ab"},),
            ({"name": "A" * 56},),
            ({"email": "ab.c"},),
            (
                {
                    "email": (
                        "101words_!A#ijklmn.opqrstuvwxy$%^&*+abcdef-ghi=jklm"
                        "yzabcdefghijkl@abcdefghiJKLmnopqrstu.international"
                    )
                },
            ),
            ({"firstname": ("A" * 101)},),
            ({"lastname": ("A" * 101)},),
            ({"nickname": ("A" * 101)},),
            ({"is_enabled": "str"},),
            ({"is_locked": 123},),
            ({"failed_attempts": -1},),
            ({"password": ("A" * 65)},),
        ]
    )
    def test_validation_failed(self, field: Dict[str, Any]) -> None:
        with self.assertRaises(ValidationError):
            User.model_validate(
                {
                    "name": "test-user",
                    "email": "test@example.com",
                    **field,
                }
            )

    def test_user_relationship_fields(self) -> None:
        self.assertIsInstance(self.users[0].tokens, list)
        self.assertIsInstance(self.users[0].comments, list)
        self.assertIsInstance(self.users[0].configurations, list)

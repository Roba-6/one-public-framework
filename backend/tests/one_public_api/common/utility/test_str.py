import unittest

from parameterized import parameterized

from one_public_api.common.utility.str import to_camel


class StrTestCase(unittest.TestCase):
    @parameterized.expand(
        [
            ("One word", "test", "test"),
            ("Two words", "test_string", "testString"),
            ("Include capital letters", "tEst_stRinG", "testString"),
            ("Include numbers", "test_2_string_3", "test2String3"),
            ("Include numbers but no underscores", "test2_3str4ing5", "test23str4ing5"),
            ("Camel case", "testString", "teststring"),
            ("Start with capital letter", "Test_string", "testString"),
            ("Start with underscore", "_test_string", "TestString"),
            ("End with underscore", "test_string_", "testString"),
            ("Consecutive underscores", "__test__string__", "TestString"),
            ("Only underscores", "_", ""),
            ("Blank", "", ""),
            ("Include symbols", "test._?+str&ing$", "test.?+str&ing$"),
        ]
    )
    def test_to_camel(self, _: str, value: str, excepted: str) -> None:
        self.assertEqual(to_camel(value), excepted)


if __name__ == "__main__":
    unittest.main()

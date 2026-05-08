# WorkshopBlock/flowperl_engine.py
import re
import sys
from io import StringIO
from typing import Any, Dict, List, Optional, Tuple

class FlowPerlError(Exception):
    """Користувацький виняток для помилок FlowPerl."""
    def __init__(self, message: str, line: int, severity: int = 1):
        super().__init__(message)
        self.line = line
        self.severity = severity  # 1 - критична (червона), 2 - попередження (жовта), 3 - інфо (синя)

class FlowPerlEngine:
    """
    Інтерпретатор мови FlowPerl.
    Виконує код у безпечному оточенні.
    """
    def __init__(self):
        # Безпечне оточення для виконання згенерованого Python-коду
        self.safe_globals = {
            '__builtins__': {
                'True': True,
                'False': False,
                'None': None,
                'maybe': None,  # maybe буде представлятися як None
                'print': self._safe_print,
                'len': len,
                'range': range,
                'map': map,
                'filter': filter,
                'reduce': self._safe_reduce,
                'int': int,
                'float': float,
                'str': str,
                'bool': bool,
                'list': list,
                'dict': dict,
                'TypeError': TypeError,
                'ValueError': ValueError,
            },
            'say': self._say_command,  # для виводу з підтримкою that
        }
        self.output = StringIO()
        self.errors: List[Tuple[str, int, int]] = []  # (повідомлення, рядок, серйозність)

    def _safe_print(self, *args, **kwargs):
        """Безпечний print, записує в self.output."""
        print(*args, file=self.output, **kwargs)

    def _safe_reduce(self, func, iterable, initial=None):
        """Безпечна реалізація reduce."""
        it = iter(iterable)
        if initial is None:
            try:
                value = next(it)
            except StopIteration:
                raise TypeError("reduce() of empty sequence with no initial value")
        else:
            value = initial
        for element in it:
            value = func(value, element)
        return value

    def _say_command(self, *args, that: bool = False):
        """
        Команда say. Приймає значення, і якщо that=True, виводить їх.
        В FP: say "Hi" – просто зберігає, say -that "Hi" – виводить.
        """
        if that:
            print(*args, file=self.output)
        return args  # завжди повертає те, що отримала, для ланцюжків

    # ---- Парсинг та трансляція ----
    def translate(self, code: str) -> str:
        """
        Перетворює FlowPerl код на Python код.
        Повертає рядок Python-коду.
        """
        lines = code.split('\n')
        python_lines = []
        self.errors.clear()
        indent_level = 0

        i = 0
        while i < len(lines):
            line = lines[i].strip()
            if not line or line.startswith('//'):
                python_lines.append('')
                i += 1
                continue

            try:
                # Визначаємо тип рядка і транслюємо
                if line.startswith('say '):
                    python_line = self._translate_say(line, i + 1)
                elif line.startswith('let '):
                    python_line = self._translate_let(line, i + 1)
                elif line.startswith('que '):
                    # Багаторядковий que – обробляємо весь блок
                    block, i = self._extract_que_block(lines, i)
                    python_lines.append(f'# que translate')
                    # Трансляція que відбувається пізніше, поки заглушка
                    python_lines.append(f'raise NotImplementedError("que not implemented yet")')
                    i += 1
                    continue
                elif line.startswith('fn('):
                    # Анонімна функція всередині виразу – має оброблятися в контексті
                    python_line = line
                else:
                    # Вираз (вважаємо чистим Python для сумісності на першому етапі)
                    python_line = line
                
                python_lines.append('    ' * indent_level + python_line)
            except FlowPerlError as e:
                self.errors.append((str(e), e.line, e.severity))
                python_lines.append(f'# Error line {e.line}: {e}')
            except Exception as e:
                self.errors.append((f"Помилка трансляції: {e}", i + 1, 1))
                python_lines.append(f'# Unexpected error')

            i += 1

        # Додаємо обробку помилок
        if self.errors:
            # Вставляємо коментарі про помилки перед кодом
            header = []
            for msg, line, sev in self.errors:
                color = {1: 'red', 2: 'yellow', 3: 'blue'}.get(sev, 'red')
                header.append(f'# FP-{color.upper()}: line {line}: {msg}')
            python_lines = header + [""] + python_lines

        return '\n'.join(python_lines)

    def _translate_say(self, line: str, lineno: int) -> str:
        """Перекладає рядок say."""
        # Видаляємо 'say '
        rest = line[4:].strip()
        if rest.startswith('-that ') or rest.startswith('- that '):
            # say -that "текст"
            content = rest[6:].strip() if rest.startswith('-that ') else rest[7:].strip()
            # Генеруємо: say(..., that=True)
            return f"say({content}, that=True)"
        else:
            # say без that -> say(...)
            return f"say({rest})"

    def _translate_let(self, line: str, lineno: int) -> str:
        """
        Обробляє let:
        - let -pack /input ?value/ in name.box
        - let -pack value in name.box
        - let -create name.fnc
        - let -side name.box put- value
        """
        # Забираємо 'let '
        rest = line[4:].strip()

        if rest.startswith('-pack '):
            return self._translate_let_pack(rest[6:].strip(), lineno)
        elif rest.startswith('-create '):
            return self._translate_let_create(rest[8:].strip(), lineno)
        elif rest.startswith('-side '):
            return self._translate_let_side(rest[6:].strip(), lineno)
        else:
            # Звичайне присвоєння? Поки помилка
            raise FlowPerlError("Невідома форма let", lineno, 1)

    def _translate_let_pack(self, expr: str, lineno: int) -> str:
        """let -pack ... in ..."""
        # Шукаємо ' in ' для розділення значення та цілі
        if ' in ' not in expr:
            raise FlowPerlError("let -pack потребує 'in'", lineno, 1)
        value_part, target = expr.split(' in ', 1)
        value_part = value_part.strip()
        target = target.strip()

        # Визначаємо тип значення
        if value_part.startswith('/input ') and value_part.endswith('/'):
            # input з підказкою
            prompt = value_part[len('/input '):-1].strip()
            # Генеруємо код для input
            return f"{target} = input({prompt})"
        elif value_part.startswith('/input/'):
            # input без підказки
            return f"{target} = input()"
        else:
            # звичайне значення, можливо з ! для вводу від користувача
            if value_part.startswith('!'):
                # !значення -> input з підказкою
                prompt = value_part[1:].strip()
                return f"{target} = input({prompt})"
            else:
                return f"{target} = {value_part}"

    def _translate_let_create(self, expr: str, lineno: int) -> str:
        """let -create name.fnc або name.box"""
        if not ('.fnc' in expr or '.box' in expr):
            raise FlowPerlError("-create потребує .fnc або .box", lineno, 1)
        # Для функції створюємо def або lambda пізніше; поки заглушка
        return f"# let create: {expr}"

    def _translate_let_side(self, expr: str, lineno: int) -> str:
        """let -side name.box put- value"""
        # Шукаємо ' put- '
        if ' put- ' not in expr:
            raise FlowPerlError("-side потребує put-", lineno, 1)
        target, value = expr.split(' put- ', 1)
        return f"{target.strip()} = {value.strip()}"

    def _extract_que_block(self, lines: List[str], start: int) -> Tuple[str, int]:
        """Виймає блок que, повертає об'єднаний рядок та новий індекс."""
        # Шукаємо закриття блоку (можливо, кінець відступу)
        # Поки не реалізовано
        return "", start

    def run(self, code: str) -> Dict[str, Any]:
        """
        Виконує код FlowPerl і повертає результат.
        """
        python_code = self.translate(code)
        if self.errors:
            critical = [e for e in self.errors if e[2] == 1]
            if critical:
                return {
                    'stdout': '',
                    'stderr': '\n'.join([f"FP-ERROR line {l}: {m}" for m, l, s in self.errors]),
                    'returncode': 1
                }
        try:
            # Очищаємо вивід перед виконанням
            self.output.seek(0)
            self.output.truncate(0)
            # Виконуємо згенерований Python код у безпечному оточенні
            exec(python_code, self.safe_globals)
            stdout = self.output.getvalue()
            return {
                'stdout': stdout,
                'stderr': '',
                'returncode': 0
            }
        except Exception as e:
            return {
                'stdout': '',
                'stderr': f'FP-RUNTIME ERROR: {e}',
                'returncode': 1
            }
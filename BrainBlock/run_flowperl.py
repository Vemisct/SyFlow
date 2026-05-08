# run_flowperl.py
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))
from WorkshopBlock.flowperl_engine import FlowPerlEngine

if __name__ == '__main__':
    code = sys.stdin.read()
    engine = FlowPerlEngine()
    result = engine.run(code)
    print(result['stdout'], end='')
    if result['stderr']:
        print(result['stderr'], file=sys.stderr)
    sys.exit(result['returncode'])
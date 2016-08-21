#!/usr/bin/env python
import sys
sys.path.insert(0,'ressources/')
from my_apis import *

def run(PROJECT_NAME):
    sys.path.insert(0,'../' + PROJECT_NAME + '/')
    
    query_apis()

if __name__ == '__main__':
    run(sys.argv[1])

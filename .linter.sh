#!/bin/bash
cd /home/kavia/workspace/code-generation/lingolite-45734-0d6bbc96/lingolite_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


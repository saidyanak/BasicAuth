#!/bin/bash

echo "🚀 BasicAuth Frontend Starting..."
echo ""
echo "📦 Port: 3000"
echo "🌐 URL: http://localhost:3000"
echo "🔗 API: http://localhost:8080/api"
echo ""
echo "✨ Opening browser..."
echo ""

npx http-server -p 3000 -c-1 --cors -o
